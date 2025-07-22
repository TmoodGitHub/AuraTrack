import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import type { AuditLog } from '../../types/AuditLog';
import { exportCSV } from '../../utils/exportCSV';
import { Pagination } from './Pagination';
import { AuditLogTable } from './AuditLogTable';

import { AdminActionAnalytics } from './AdminActionAnalytics';

const PAGE_SIZE = 25;

type AuditActionType = 'PROMOTE_TO_ADMIN' | 'DEMOTE_TO_USER' | 'DELETE_USER';

const AuditLogPanel = () => {
  // Updated to allow only "" or valid AuditActionType values
  const [selectedAction, setSelectedAction] = useState<
    AuditActionType | undefined
  >(undefined);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);

  // Use custom hook for data fetching
  const { logs, loading } = useAuditLogs({
    limit: PAGE_SIZE,
    offset,
    // Only send `action` if it's not an empty string or undefined
    action: selectedAction, // Omit `action` if empty
    adminEmail: selectedAdminEmail || undefined,
  });

  // Unique Admin Emails for filtering
  const uniqueEmails = Array.from(
    new Set(logs.map((log: AuditLog) => log.admin_email).filter(Boolean))
  ) as string[];

  const isFirstPage = offset === 0;
  const hasNextPage = logs.length === PAGE_SIZE;

  const handlePrevious = () => {
    if (offset > 0) setOffset(offset - PAGE_SIZE);
  };

  const handleNext = () => {
    if (hasNextPage) setOffset(offset + PAGE_SIZE);
  };

  const handleActionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? undefined : e.target.value;
    setSelectedAction(value as AuditActionType | undefined);
    setOffset(0);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAdminEmail(e.target.value);
    setOffset(0);
  };

  return (
    <div className='p-4 mt-6 bg-white rounded-xl shadow'>
      <h2 className='text-xl font-semibold mb-4'>Audit Log</h2>

      {/* Action and Admin Email Filter */}
      <div className='mb-4 flex gap-4 flex-wrap'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Action
          </label>
          <select
            value={selectedAction}
            onChange={handleActionChange}
            className='border rounded px-2 py-1 text-sm'
          >
            <option value=''>All</option>
            <option value='PROMOTE_TO_ADMIN'>Promote to Admin</option>
            <option value='DEMOTE_TO_USER'>Demote to User</option>
            <option value='DELETE_USER'>Delete User</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Admin Email
          </label>
          <select
            value={selectedAdminEmail}
            onChange={handleEmailChange}
            className='border rounded px-2 py-1 text-sm'
          >
            <option value=''>All</option>
            {uniqueEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Displaying Loading or Error Messages */}
      <div className='flex items-center justify-between mb-2'>
        {loading ? <p>Loading...</p> : <p>Total Logs: {logs.length}</p>}

        <button
          onClick={() => exportCSV(selectedAction, selectedAdminEmail)}
          className='text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Export CSV
        </button>
      </div>

      {/* Table of Audit Logs */}
      <AuditLogTable logs={logs} loading={loading} />

      {/* Pagination */}
      <Pagination
        isFirstPage={isFirstPage}
        hasNextPage={hasNextPage}
        onPrevious={handlePrevious}
        onNext={handleNext}
        offset={offset}
        PAGE_SIZE={PAGE_SIZE}
      />

      {/* Admin Action Analytics - Display this below the table and pagination */}
      <AdminActionAnalytics logs={logs} />
    </div>
  );
};

export default AuditLogPanel;
