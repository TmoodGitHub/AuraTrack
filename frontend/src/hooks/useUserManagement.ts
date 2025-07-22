import { useMutation } from '@apollo/client';
import {
  PROMOTE_USER_MUTATION,
  DEMOTE_USER_MUTATION,
  DELETE_USER_MUTATION,
  CREATE_USER_MUTATION, // Changed to CREATE_USER_MUTATION for clarity
} from '../graphql/mutations/userMutations.graphql';

export const useUserManagement = () => {
  const [promoteToAdmin] = useMutation(PROMOTE_USER_MUTATION);
  const [demoteToUser] = useMutation(DEMOTE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [createUser] = useMutation(CREATE_USER_MUTATION); // Updated mutation name

  const handlePromote = async (userId: string) => {
    try {
      const { data } = await promoteToAdmin({ variables: { userId } });
      // Check if the mutation was successful and return success
      return data?.promoteUser === true;
    } catch (error) {
      console.error('Error promoting user:', error);
      return false; // Return false if there's an error
    }
  };

  // Handle Demote User
  const handleDemote = async (userId: string) => {
    try {
      const { data } = await demoteToUser({ variables: { userId } });
      // Check if the mutation was successful and return success
      return data?.demoteUser === true;
    } catch (error) {
      console.error('Error demoting user:', error);
      return false; // Return false if there's an error
    }
  };

  // Handle Delete User
  const handleDelete = async (userId: string) => {
    try {
      const { data } = await deleteUser({ variables: { userId } });
      // Check if the mutation was successful and return success
      return data?.deleteUser === true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false; // Return false if there's an error
    }
  };

  const handleCreate = async (
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const { data } = await createUser({
        variables: { email, password, role },
      });
      if (data?.createUser) {
        return data.createUser; // Return the newly created user object
      } else {
        console.error('Error: No user returned from GraphQL mutation');
        return null; // Ensure null is returned if no user was created
      }
    } catch (error) {
      console.error('Error during user creation:', error);
      throw new Error('User creation failed');
    }
  };

  return { handlePromote, handleDemote, handleDelete, handleCreate };
};
