import { gql } from '@apollo/client';

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs(
    $limit: Int
    $offset: Int
    $action: AuditActionType
    $adminEmail: String
  ) {
    getAuditLogs(
      limit: $limit
      offset: $offset
      action: $action
      adminEmail: $adminEmail
    ) {
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

export const GET_AUDIT_LOG_COUNT = gql`
  query GetAuditLogCount($action: AuditActionType, $adminEmail: String) {
    getAuditLogCount(action: $action, adminEmail: $adminEmail)
  }
`;

export const EXPORT_AUDIT_LOGS = gql`
  query ExportAuditLogs($action: AuditActionType, $adminEmail: String) {
    exportAuditLogs(action: $action, adminEmail: $adminEmail)
  }
`;
