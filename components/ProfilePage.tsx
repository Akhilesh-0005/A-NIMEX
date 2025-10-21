import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { KeyIcon } from './icons/KeyIcon';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

interface ProfilePageProps {
  onNavigateHome: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateHome }) => {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long.');
        return;
    }

    setIsLoading(true);
    if (user) {
        const result = await changePassword(user.email, currentPassword, newPassword);
        if (result.success) {
            setSuccess(result.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError(result.message);
        }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
            <div className="inline-block bg-red-600 p-3 rounded-full mb-4">
                <UserCircleIcon className="w-8 h-8 text-white"/>
            </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
          <p className="text-gray-400 mt-2 truncate">Logged in as {user?.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <KeyIcon className="w-5 h-5 text-red-400"/>
            Change Password
          </h2>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="current-password">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••••"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••••"
              required
            />
          </div>
           <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••••"
              required
            />
          </div>
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
            ) : 'Save Changes'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          <button onClick={onNavigateHome} className="font-bold text-red-400 hover:underline">
            Back to Home
          </button>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;