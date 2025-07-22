import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS, GET_USER_COUNT } from '../../graphql/queries/userQueries';
import { useUserManagement } from '../../hooks/useUserManagement';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { Pagination } from './Pagination';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

const UserManagementPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [offset, setOffset] = useState<number>(0);

  const { loading: usersLoading, data } = useQuery(GET_USERS, {
    variables: { limit: PAGE_SIZE, offset },
  });

  const { loading: countLoading, data: countData } = useQuery(GET_USER_COUNT);

  const { handlePromote, handleDemote, handleDelete, handleCreate } =
    useUserManagement();

  // Fetch users data and update state
  useEffect(() => {
    if (data) {
      setUsers(data.users);
    }
  }, [data]);

  // Fetch total user count for pagination
  useEffect(() => {
    if (countData) {
      setUserCount(countData.userCount); // Set the total count from backend response
    }
  }, [countData]);

  const isFirstPage = offset === 0;
  const hasNextPage = users.length === PAGE_SIZE;

  const handlePrevious = () => {
    if (offset > 0) setOffset(offset - PAGE_SIZE);
  };

  const handleNext = () => {
    if (hasNextPage) setOffset(offset + PAGE_SIZE);
  };

  const isLoading = usersLoading || countLoading;

  const handleCreateUser = async (
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const user = await handleCreate(email, password, role);
      if (user) {
        setUsers((prevUsers) => [user, ...prevUsers]);
        setUserCount((prevCount) => prevCount + 1); // Increment user count
        setOffset(0); // Reset pagination
        toast.success('User created successfully!');
      } else {
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  return (
    <div className='p-4 mt-6 bg-white rounded-xl shadow'>
      <h2 className='text-xl font-semibold mb-4'>User Management</h2>

      <UserForm isAdminPortal={true} onSubmit={handleCreateUser} />

      {countLoading && <p>Loading user count...</p>}
      {usersLoading && <p>Loading users...</p>}

      <UserTable
        users={users}
        loading={isLoading}
        onPromote={handlePromote}
        onDemote={handleDemote}
        onDelete={handleDelete}
        setUsers={setUsers} // Make sure to update the user list optimistically
        userCount={userCount}
      />

      <Pagination
        isFirstPage={isFirstPage}
        hasNextPage={hasNextPage}
        onPrevious={handlePrevious}
        onNext={handleNext}
        offset={offset}
        PAGE_SIZE={PAGE_SIZE}
      />

      {/* Display total user count */}
      <div className='mt-4 text-sm'>
        <strong>Total Users: </strong>
        {userCount}
      </div>
    </div>
  );
};

export default UserManagementPanel;
