import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppIcon } from './icons/AppIcon';
import { Logo } from './icons/Logo';
import ErrorMessage from './ErrorMessage';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-4">
                <AppIcon className="w-20 h-20" />
                <Logo className="h-9 w-auto" />
            </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In</h1>
          <p className="text-gray-400 mt-1">to access the collection.</p>
        </div>


        <form onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="••••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mb-4">
            (Hint: admin@example.com / adminpassword)
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-bold text-red-400 hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;