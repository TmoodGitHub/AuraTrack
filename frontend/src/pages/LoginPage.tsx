import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import FloatingInput from '../components/FloatingInput';
import FloatingPasswordInput from '../components/FloatingPasswordInput';

type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    clearErrors();
    setIsSubmitting(true);

    try {
      const user = await login(data.email, data.password);

      if (user) {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('email', { message: 'Invalid credentials' });
        setError('password', { message: ' ' });
        toast.error(
          'Login failed. Please check your credentials and try again.'
        );
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
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
          Log In
        </button>
      </form>

      <p className='mt-4 text-center text-sm text-gray-600'>
        Don&apos;t have an account?{' '}
        <Link to='/signup' className='text-blue-600 hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
