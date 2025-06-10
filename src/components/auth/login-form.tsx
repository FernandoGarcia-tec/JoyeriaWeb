
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogIn } from 'lucide-react';
import { loginAction, type AuthActionState } from '@/lib/actions';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const initialState: AuthActionState = { message: undefined, user: undefined, errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <>
          <LogIn className="mr-2 h-4 w-4 animate-spin" /> Logging In...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" /> Login
        </>
      )}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { setAuthUser } = useAuth(); // Get setAuthUser from context
  const router = useRouter();

  useEffect(() => {
    if (state.user) {
      setAuthUser(state.user); // Update context with logged-in user
      // Redirect handled by AuthContext or SiteHeader based on user role
      if (state.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [state, setAuthUser, router]);

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-playfair-display text-primary">Login</CardTitle>
        <CardDescription>Access your Gleam Gallery account.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state.message && state.errors?._form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="yourusername"
              defaultValue={state.input?.username}
              required
              className="mt-1"
            />
            {state.errors?.username && <p className="text-sm text-destructive mt-1">{state.errors.username.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="mt-1"
            />
            {state.errors?.password && <p className="text-sm text-destructive mt-1">{state.errors.password.join(', ')}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
