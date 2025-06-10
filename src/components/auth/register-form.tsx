
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, UserPlus } from 'lucide-react';
import { registerAction, type AuthActionState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const initialState: AuthActionState = { message: undefined, user: undefined, errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <>
          <UserPlus className="mr-2 h-4 w-4 animate-spin" /> Registering...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" /> Register
        </>
      )}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message && state.user) { // Successfully registered
      toast({
        title: "Registration Successful!",
        description: state.message,
      });
      router.push('/login'); // Redirect to login page after successful registration
    } else if (state.message && state.errors?._form) { // General form error on registration
      toast({
        title: "Registration Failed",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, router]);

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-playfair-display text-primary">Create Account</CardTitle>
        <CardDescription>Join Gleam Gallery to save your favorites and track orders.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state.message && state.errors?._form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Failed</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="chooseausername"
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
              placeholder="•••••••• (min. 6 characters)"
              required
              className="mt-1"
            />
            {state.errors?.password && <p className="text-sm text-destructive mt-1">{state.errors.password.join(', ')}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
