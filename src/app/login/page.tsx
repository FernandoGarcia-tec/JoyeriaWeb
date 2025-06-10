
import { LoginForm } from '@/components/auth/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Gleam Gallery',
  description: 'Log in to your Gleam Gallery account.',
};

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <LoginForm />
    </div>
  );
}
