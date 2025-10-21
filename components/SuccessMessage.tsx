import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div role="status" className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 flex items-center gap-3">
      <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default SuccessMessage;
