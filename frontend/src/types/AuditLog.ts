export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'PROMOTE_TO_ADMIN' | 'DEMOTE_TO_USER' | 'DELETE_USER';
  details: string | null;
  admin_id: string;
  admin_email: string | null;
  target_id: string;
  target_email: string | null;
}
