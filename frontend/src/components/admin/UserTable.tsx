import { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Lock,
} from 'lucide-react';
import { ConfirmActionModal } from './ConfirmActionModal';

interface User {
  id: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  onPromote: (userId: string) => void;
  onDemote: (userId: string) => void;
  onDelete: (userId: string) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setUserCount: React.Dispatch<
    React.SetStateAction<number>
  >;
}

export const UserTable = ({
  users,
  loading,
  onPromote,
  onDemote,
  onDelete,
  setUsers,
}: UserTableProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<
    'promote' | 'demote' | 'delete' | null
  >(null);
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const openModal = (
    action: 'promote' | 'demote' | 'delete',
    user: User
  ) => {
    setSelectedUser(user);
    setModalAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalAction(null);
    setModalOpen(false);
  };

  const confirmAction = () => {
    if (!selectedUser || !modalAction) return;

    if (modalAction === 'promote') {
      onPromote(selectedUser.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, role: 'admin' }
            : u
        )
      );
    }

    if (modalAction === 'demote') {
      onDemote(selectedUser.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, role: 'user' }
            : u
        )
      );
    }

    if (modalAction === 'delete') {
      onDelete(selectedUser.id);
    }

    closeModal();
  };

  return (
    <div className='overflow-x-auto max-w-full'>
      <table className='min-w-full text-xs sm:text-sm border border-gray-300 text-left'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2 border-b'>Email</th>
            <th className='px-4 py-2 border-b'>Role</th>
            <th className='px-4 py-2 border-b'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  {[32, 24, 40].map((w, j) => (
                    <td key={j} className='px-4 py-2'>
                      <div
                        className='h-4 bg-gray-200 rounded'
                        style={{ width: `${w}px` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            : users.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b ${
                    user.email === 'admin@auratrack.io'
                      ? 'font-bold'
                      : ''
                  }`}
                >
                  <td className='px-4 py-2'>
                    {user.email}
                  </td>
                  <td className='px-4 py-2'>{user.role}</td>
                  <td className='px-4 py-2'>
                    {user.email !==
                      'admin@auratrack.io' && (
                      <>
                        <button
                          onClick={() =>
                            openModal('promote', user)
                          }
                          className='text-blue-600 hover:text-blue-800'
                          title='Promote to Admin'
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          onClick={() =>
                            openModal('demote', user)
                          }
                          className='ml-4 text-yellow-600 hover:text-yellow-800'
                          title='Demote to User'
                        >
                          <ArrowDown size={18} />
                        </button>
                        <button
                          onClick={() =>
                            openModal('delete', user)
                          }
                          className='ml-4 text-red-600 hover:text-red-800'
                          title='Delete User'
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                    {user.email !==
                      'admin@auratrack.io' && (
                      <button className='ml-4 text-green-600 hover:text-green-800'>
                        <Lock size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <ConfirmActionModal
        open={modalOpen}
        action={modalAction}
        user={selectedUser}
        onClose={closeModal}
        onConfirm={confirmAction}
      />
    </div>
  );
};
