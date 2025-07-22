import { useQuery } from '@apollo/client';
import {
  GET_AUDIT_LOGS,
  GET_AUDIT_LOG_COUNT,
} from '../graphql/queries/auditQueries';

export const useAuditLogs = (variables: any) => {
  const { data, loading, error } = useQuery(GET_AUDIT_LOGS, { variables });
  const {
    data: countData,
    loading: countLoading,
    error: countError,
  } = useQuery(GET_AUDIT_LOG_COUNT, { variables });

  return {
    logs: data?.getAuditLogs || [],
    totalCount: countData?.getAuditLogCount || 0,
    loading,
    error,
    countLoading,
    countError,
  };
};
