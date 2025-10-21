import React from 'react';
import { GhostIcon } from './icons/GhostIcon';

interface EmptyStateProps {
  query: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ query }) => {
  return (
    <div className="text-center py-20 flex flex-col items-center justify-center animate-fade-in-slow">
        <div className="mb-6">
            <GhostIcon className="w-24 h-24 text-gray-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-300 mb-3">It's a Ghost Town in Here...</h3>
        {query ? (
             <p className="text-gray-400 max-w-lg">
                Even our spectral scouts couldn't find anything for "{query}". Try a different search term or check for typos!
            </p>
        ) : (
            <p className="text-gray-400 max-w-lg">
                Looks like this view is empty. Try clearing your filters or adding some anime to your favorites to bring some life back to this place!
            </p>
        )}
        <style>{`.animate-fade-in-slow { animation: fadeIn 0.8s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default EmptyState;
