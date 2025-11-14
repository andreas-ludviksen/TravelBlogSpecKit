/**
 * Login page
 * Displays login form for authentication
 */

import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Travel Blog',
  description: 'Login to access the travel blog',
};

interface LoginPageProps {
  searchParams: {
    expired?: string;
    redirect?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const isExpired = searchParams.expired === 'true';
  const redirectPath = searchParams.redirect;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Travel Blog
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your travel blog account
          </p>
          
          {isExpired && (
            <div 
              className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative"
              role="alert"
            >
              <p className="text-sm text-center">
                Your session has expired. Please log in again.
              </p>
            </div>
          )}
        </div>
        
        <LoginForm redirectPath={redirectPath} />
      </div>
    </div>
  );
}
