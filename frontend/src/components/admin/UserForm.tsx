import { useForm } from 'react-hook-form';
import FloatingInput from '../FloatingInput';
import FloatingPasswordInput from '../FloatingPasswordInput';

type UserFormData = {
  email: string;
  password: string;
  role: 'user' | 'admin';
};

export const UserForm = ({
  onSubmit,
  isAdminPortal,
}: {
  onSubmit: Function;
  isAdminPortal?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset, // Reset form values
    formState: { errors },
  } = useForm<UserFormData>();

  const onSubmitForm = async (data: UserFormData) => {
    await onSubmit(data.email, data.password, data.role); // Call onSubmit without toast
    reset(); // Reset the form after successful submission
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 mb-6'>
      <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
        <FloatingInput
          id='email'
          label='Email'
          type='email'
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />

        <FloatingPasswordInput
          id='password'
          label='Password'
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password?.message}
        />

        {isAdminPortal && (
          <div>
            <label
              htmlFor='role'
              className='block text-sm font-medium text-gray-700'
            >
              Role
            </label>
            <select
              id='role'
              {...register('role', { required: 'Role is required' })}
              className='mt-1 block w-full border rounded px-3 py-2'
            >
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
            {errors.role && (
              <p className='text-red-500 text-xs'>{errors.role.message}</p>
            )}
          </div>
        )}

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors'
        >
          Create User
        </button>
      </form>
    </div>
  );
};
