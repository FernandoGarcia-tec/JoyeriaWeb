
'use client';

import type { AuthUser } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loginAction, registerAction, type AuthActionState } from '@/lib/actions'; // We'll define these actions

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
  login: (formData: FormData, callback?: (result: AuthActionState) => void) => Promise<void>;
  register: (formData: FormData, callback?: (result: AuthActionState) => void) => Promise<void>;
  logout: () => void;
  setAuthUser: (user: AuthUser | null) => void; // Added this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'gleamGalleryAuthUser';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check localStorage
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY); // Clear corrupted data
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const login = async (formData: FormData, callback?: (result: AuthActionState) => void) => {
    setIsLoading(true);
    // Directly call the server action. The form component will handle state via useActionState.
    // This context login is more for programmatic login if needed, or can be simplified.
    // For now, form submission will directly use server action.
    // This function can be used to update context *after* successful action in the form component.
    const result = await loginAction({ message: undefined, user: undefined, errors: undefined }, formData);
    if (result.user) {
      handleLoginSuccess(result.user);
      toast({ title: "Logged In", description: `Welcome back, ${result.user.username}!` });
    } else if (result.message) {
      toast({ title: "Login Failed", description: result.message, variant: "destructive" });
    }
    setIsLoading(false);
    if (callback) callback(result);
  };

  const register = async (formData: FormData, callback?: (result: AuthActionState) => void) => {
    setIsLoading(true);
    const result = await registerAction({ message: undefined, user: undefined, errors: undefined }, formData);
     if (result.user) {
      // Optionally auto-login after registration or just show success
      toast({ title: "Registration Successful", description: "You can now log in." });
    } else if (result.message) {
      toast({ title: "Registration Failed", description: result.message, variant: "destructive" });
    }
    setIsLoading(false);
    if (callback) callback(result);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // No server action needed for simple logout, just clear client state.
    // If server-side sessions were used, an API call would be here.
  };
  
  // Expose a method to update the user, to be called from form components after successful server action
  const setAuthUser = (user: AuthUser | null) => {
    if (user) {
        handleLoginSuccess(user);
    } else {
        setCurrentUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
