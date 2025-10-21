import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div role="alert" className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 flex items-center gap-3">
      <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorMessage;
