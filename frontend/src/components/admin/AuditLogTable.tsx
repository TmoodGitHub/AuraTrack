// src/components/admin/AuditLogTable.tsx

import { format } from 'date-fns';
import type { AuditLog } from '../../types/AuditLog'; // Importing AuditLog interface

interface AuditLogTableProps {
  logs: AuditLog[]; // Using AuditLog interface
  loading: boolean;
}

export const AuditLogTable = ({ logs, loading }: AuditLogTableProps) => (
  <div className='overflow-x-auto max-w-full'>
    <table className='min-w-full text-xs sm:text-sm border border-gray-300 text-left'>
      <thead className='bg-gray-100'>
        <tr>
          <th className='px-4 py-2 border-b'>Timestamp</th>
          <th className='px-4 py-2 border-b'>Action</th>
          <th className='px-4 py-2 border-b'>Admin</th>
          <th className='px-4 py-2 border-b'>Target</th>
          <th className='px-4 py-2 border-b hidden sm:block'>Details</th>
        </tr>
      </thead>
      <tbody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className='animate-pulse'>
                {[32, 24, 40, 40, 64].map((w, j) => (
                  <td key={j} className='px-4 py-2'>
                    <div
                      className={`h-4 bg-gray-200 rounded`}
                      style={{ width: `${w}px` }}
                    />
                  </td>
                ))}
              </tr>
            ))
          : logs.map((log: AuditLog) => (
              <tr key={log.id} className='border-b'>
                <td className='px-4 py-2'>
                  {format(
                    new Date(Number(log.timestamp)),
                    'yyyy-MM-dd HH:mm:ss'
                  )}
                </td>
                <td className='px-4 py-2'>{log.action}</td>
                <td className='px-4 py-2'>{log.admin_email ?? '[deleted]'}</td>
                <td className='px-4 py-2'>{log.target_email ?? '[deleted]'}</td>
                <td className='px-4 py-2 hidden sm:block'>
                  {log.details || '—'}
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  </div>
);
