import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import FloatingInput from '../components/FloatingInput';
import FloatingPasswordInput from '../components/FloatingPasswordInput';

type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const loggedInUser = await login(data.email, data.password);

    if (loggedInUser) {
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('email', { message: 'Invalid credentials' });
      setError('password', { message: ' ' });
    }
  };

  return (
    <div className='max-w-md mx-auto mt-16 p-4 border rounded shadow bg-white'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
            minLength: { value: 6, message: 'Min 6 characters' },
          })}
          error={errors.password?.message}
        />

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors'
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
