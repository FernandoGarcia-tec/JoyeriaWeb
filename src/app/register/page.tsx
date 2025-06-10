
import { RegisterForm } from '@/components/auth/register-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Gleam Gallery',
  description: 'Create your Gleam Gallery account.',
};

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <RegisterForm />
    </div>
  );
}
