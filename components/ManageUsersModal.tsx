import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';

interface ManageUsersModalProps {
  onClose: () => void;
}

const ManageUsersModal: React.FC<ManageUsersModalProps> = ({ onClose }) => {
  const { user: currentUser, users, deleteUser } = useAuth();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleDelete = async (userId: string, userEmail: string) => {
    if (currentUser?.id === userId) {
      setFeedback({ type: 'error', message: "You cannot delete your own account."});
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the user "${userEmail}"? This is temporary.`)) {
      const result = await deleteUser(userId);
      if(result.success) {
        setFeedback({ type: 'success', message: `User "${userEmail}" deleted.`});
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-700 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Manage Users</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
        </div>
        <div className="p-6 overflow-y-auto">
            {feedback?.type === 'success' && <SuccessMessage message={feedback.message} />}
            {feedback?.type === 'error' && <ErrorMessage message={feedback.message} />}
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-white truncate">{user.email}</span>
                    {currentUser?.id === user.id && <span className="text-xs text-cyan-400 font-bold">(You)</span>}
                </div>
                <button 
                  onClick={() => handleDelete(user.id, user.email)}
                  disabled={currentUser?.id === user.id}
                  className="p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Delete user ${user.email}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
       <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } .animate-slide-up { animation: slideUp 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default ManageUsersModal;