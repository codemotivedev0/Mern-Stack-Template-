import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import useAuth from '../../hooks/auth/useAuth.js';
import useShake from '../../hooks/auth/useShake.js';
import { loginSchema } from '../../validators/auth/auth.schema.js';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import AuthInput from '../../components/auth/AuthInput.jsx';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthSubmitButton from '../../components/auth/AuthSubmitButton.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formRef, shake] = useShake();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('root', { message: err.message });
      shake();
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue to your dashboard."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </>
      }
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit, shake)} className="space-y-5" noValidate>
        <AuthAlert message={errors.root?.message} />
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
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <AuthSubmitButton loading={isSubmitting} loadingText="Logging in…">
          Log in
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
