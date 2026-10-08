import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import useAuth from '../../hooks/auth/useAuth.js';
import useShake from '../../hooks/auth/useShake.js';
import { PASSWORD_MIN, signupSchema } from '../../validators/auth/auth.schema.js';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import AuthInput from '../../components/auth/AuthInput.jsx';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthSubmitButton from '../../components/auth/AuthSubmitButton.jsx';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formRef, shake] = useShake();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      const user = await signup(values);
      toast.success(`Account created. Welcome, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('root', { message: err.message });
      shake();
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </>
      }
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit, shake)} className="space-y-5" noValidate>
        <AuthAlert message={errors.root?.message} />
        <AuthInput
          label="Full name"
          placeholder="Jane Doe"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder={`At least ${PASSWORD_MIN} characters`}
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <AuthSubmitButton loading={isSubmitting} loadingText="Creating account…">
          Create account
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
