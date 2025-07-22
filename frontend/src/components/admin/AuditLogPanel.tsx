import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';

const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($limit: Int, $offset: Int) {
    getAuditLogs(limit: $limit, offset: $offset) {
      id
      timestamp
      action
      details
      admin_id
      admin_email
      target_id
      target_email
    }
  }
`;

const PAGE_SIZE = 25;

const AuditLogPanel = () => {
  const [offset, setOffset] = useState(0);
  const { data, loading, error, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: { limit: PAGE_SIZE, offset },
    fetchPolicy: 'cache-and-network',
  });

  const logs = data?.getAuditLogs || [];
  const isFirstPage = offset === 0;
  const hasNextPage = logs.length === PAGE_SIZE;

  const handlePrevious = () => {
    if (!isFirstPage) {
      setOffset(offset - PAGE_SIZE);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      setOffset(offset + PAGE_SIZE);
    }
  };

  return (
    <div className='p-4 mt-6 bg-white rounded-xl shadow'>
      <h2 className='text-xl font-semibold mb-4'>Audit Log</h2>

      <div className='overflow-x-auto'>
        <table className='min-w-full border text-sm text-left border-gray-300'>
          <thead className='bg-gray-100 border-b'>
            <tr>
              <th className='px-4 py-2 border-b'>Timestamp</th>
              <th className='px-4 py-2 border-b'>Action</th>
              <th className='px-4 py-2 border-b'>Admin</th>
              <th className='px-4 py-2 border-b'>Target</th>
              <th className='px-4 py-2 border-b'>Details</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse border-b'>
                  <td className='px-4 py-2'>
                    <div className='h-4 bg-gray-200 rounded w-32' />
                  </td>
                  <td className='px-4 py-2'>
                    <div className='h-4 bg-gray-200 rounded w-24' />
                  </td>
                  <td className='px-4 py-2'>
                    <div className='h-4 bg-gray-200 rounded w-40' />
                  </td>
                  <td className='px-4 py-2'>
                    <div className='h-4 bg-gray-200 rounded w-40' />
                  </td>
                  <td className='px-4 py-2'>
                    <div className='h-4 bg-gray-200 rounded w-64' />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className='border-b'>
                  <td className='px-4 py-2 border-b'>
                    {format(
                      new Date(Number(log.timestamp)),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </td>
                  <td className='px-4 py-2 border-b'>{log.action}</td>
                  <td className='px-4 py-2 border-b'>
                    {log.admin_email ?? '[deleted]'}
                  </td>
                  <td className='px-4 py-2 border-b'>
                    {log.target_email ?? '[deleted]'}
                  </td>
                  <td className='px-4 py-2 border-b'>{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {error && (
        <p className='text-sm text-red-500'>Error loading audit logs</p>
      )}

      <div className='mt-4 flex justify-between items-center'>
        <button
          onClick={handlePrevious}
          disabled={isFirstPage}
          className={`px-4 py-2 rounded bg-gray-200 text-sm ${
            isFirstPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        <span className='text-sm text-gray-600'>
          Page {offset / PAGE_SIZE + 1}
        </span>

        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded bg-gray-200 text-sm ${
            hasNextPage ? 'hover:bg-gray-300' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogPanel;
