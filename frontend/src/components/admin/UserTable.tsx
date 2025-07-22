import { ArrowUp, ArrowDown, Trash2, Lock } from 'lucide-react'; // Icons for actions

interface UserTableProps {
  users: any[];
  loading: boolean;
  onPromote: (userId: string) => void;
  onDemote: (userId: string) => void;
  onDelete: (userId: string) => void;
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  userCount: number;
}

export const UserTable = ({
  users,
  loading,
  onPromote,
  onDemote,
  onDelete,
  setUsers,
}: UserTableProps) => {
  // Sort users to ensure admin is at the top
  const sortedUsers = [...users].sort((a, b) => {
    if (a.email === 'admin@auratrack.io') return -1; // Ensure admin is always first
    return a.email < b.email ? -1 : 1;
  });

  // Handle actions like promote, demote, delete, password reset
  const handleOptimisticPromote = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: 'admin' } : user
    );
    onPromote(userId);
    setUsers(updatedUsers); // Optimistic update for promoting user
  };

  const handleOptimisticDemote = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: 'user' } : user
    );
    onDemote(userId);
    setUsers(updatedUsers); // Optimistic update for demoting user
  };

  const handleOptimisticDelete = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    onDelete(userId);
    setUsers(updatedUsers); // Optimistic update for deleting user
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
            : sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b ${
                    user.email === 'admin@auratrack.io' ? 'font-bold' : ''
                  }`}
                >
                  <td className='px-4 py-2'>{user.email}</td>
                  <td className='px-4 py-2'>{user.role}</td>
                  <td className='px-4 py-2'>
                    {user.email !== 'admin@auratrack.io' && (
                      <>
                        <button
                          onClick={() => handleOptimisticPromote(user.id)}
                          className='text-blue-600 hover:text-blue-800'
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          onClick={() => handleOptimisticDemote(user.id)}
                          className='ml-4 text-yellow-600 hover:text-yellow-800'
                        >
                          <ArrowDown size={18} />
                        </button>
                        <button
                          onClick={() => handleOptimisticDelete(user.id)}
                          className='ml-4 text-red-600 hover:text-red-800'
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                    {user.email !== 'admin@auratrack.io' && (
                      <button className='ml-4 text-green-600 hover:text-green-800'>
                        <Lock size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
