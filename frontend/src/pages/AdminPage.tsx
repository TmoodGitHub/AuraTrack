import AuditLogPanel from '../components/admin/AuditLogPanel';
import UserManagementPanel from '../components/admin/UserManagementPanel';

const AdminPage = () => (
  <div>
    <h1 className='text-2xl font-bold mb-4'>Admin Portal</h1>
    <AuditLogPanel />
    <UserManagementPanel />
  </div>
);

export default AdminPage;
