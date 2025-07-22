import { client } from '../graphql/apolloClient';
import { EXPORT_AUDIT_LOGS } from '../graphql/queries/auditQueries';

export const exportCSV = async (
  action: string | undefined,
  adminEmail: string
) => {
  try {
    const response = await client.query({
      query: EXPORT_AUDIT_LOGS,
      variables: { action, adminEmail },
      fetchPolicy: 'no-cache',
    });

    const csvData = response.data.exportAuditLogs;

    // Create blob and download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `audit_logs_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    alert('Failed to export CSV.');
  }
};
