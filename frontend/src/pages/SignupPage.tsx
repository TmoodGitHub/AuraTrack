import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import FloatingInput from '../components/FloatingInput';
import FloatingPasswordInput from '../components/FloatingPasswordInput';

type SignupFormData = {
  email: string;
  password: string;
};

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    clearErrors();
    setIsSubmitting(true);

    try {
      const user = await signup(data.email, data.password);

      if (user) {
        toast.success('Signup successful!');
        navigate('/dashboard');
      } else {
        setError('email', { message: 'Email may already be in use' });
        setError('password', { message: ' ' });
        toast.error('Signup failed. Please try a different email.');
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-16 p-4 border rounded shadow bg-white'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Sign Up</h1>

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
          disabled={isSubmitting}
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors'
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className='mt-4 text-center text-sm text-gray-600'>
        Already have an account?{' '}
        <Link to='/login' className='text-blue-600 hover:underline'>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
