import { useMemo } from 'react';

type AuditActionType = 'PROMOTE_TO_ADMIN' | 'DEMOTE_TO_USER' | 'DELETE_USER';

interface AdminActionAnalyticsProps {
  logs: Array<{ action: AuditActionType }>;
}

export const AdminActionAnalytics = ({ logs }: AdminActionAnalyticsProps) => {
  const actionCounts = useMemo(() => {
    const counts: Record<AuditActionType, number> = {
      PROMOTE_TO_ADMIN: 0,
      DEMOTE_TO_USER: 0,
      DELETE_USER: 0,
    };

    logs.forEach((log) => {
      if (log.action in counts) {
        counts[log.action]++;
      }
    });

    return counts;
  }, [logs]);

  return (
    <div className='bg-white p-4 rounded-xl shadow mt-6 border border-gray-300'>
      {' '}
      <h3 className='text-xl font-semibold mb-4'>Admin Action Analytics</h3>
      <div className='grid sm:grid-cols-3 gap-4 text-center'>
        {Object.entries(actionCounts).map(([action, count]) => (
          <div key={action} className='flex flex-col items-center'>
            <h4 className='text-sm capitalize'>{action.replace('_', ' ')}</h4>
            <span className='font-semibold'>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
