import { gql } from 'apollo-server-express';

export const auditTypeDefs = gql`
  enum AuditActionType {
    PROMOTE_TO_ADMIN
    DELETE_USER
    DEMOTE_TO_USER
  }

  type AuditLogEntry {
    id: ID!
    timestamp: String!
    action: AuditActionType!
    admin_id: ID!
    admin_email: String
    target_id: ID!
    target_email: String
    details: String
  }

  type AdminActionSummary {
    admin_email: String!
    PROMOTE_TO_ADMIN: Int!
    DEMOTE_TO_USER: Int!
    DELETE_USER: Int!
  }

  extend type Query {
    getAuditLogs(
      limit: Int
      offset: Int
      action: AuditActionType
      adminEmail: String
    ): [AuditLogEntry!]!

    getAuditLogCount(action: AuditActionType, adminEmail: String): Int!

    exportAuditLogs(action: AuditActionType, adminEmail: String): String!

    getAuditActionCountsPerAdmin: [AdminActionSummary!]!
  }
`;
