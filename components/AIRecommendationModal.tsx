import React, { useEffect, useState } from 'react';
import { AIRecommendation, AnimeMovie } from '../types';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SearchIcon } from './icons/SearchIcon';
import AnimeCard from './AnimeCard';
import ErrorMessage from './ErrorMessage';
import OjasGambheeraLogo from './OjasGambheeraLogo';

interface AIInteractionModalProps {
  onClose: () => void;
  onViewDetails: (movie: AnimeMovie) => void;
  getRecommendation: (query: string) => Promise<AIRecommendation[]>;
}

const AIInteractionModal: React.FC<AIInteractionModalProps> = ({ onClose, onViewDetails, getRecommendation }) => {
  const [view, setView] = useState<'query' | 'loading' | 'result' | 'error'>('query');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AIRecommendation[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setView('loading');
    setError('');
    try {
        const recommendations = await getRecommendation(query);
        setResult(recommendations);
        setView('result');
    } catch(err: any) {
        setError(err.message || 'An unknown error occurred while getting your recommendation.');
        setView('error');
    }
  }

  const handleReset = () => {
      setView('query');
      setQuery('');
      setResult(null);
      setError('');
  }

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
            <div className="text-center p-8 flex flex-col items-center">
                <div className="inline-block animate-spin mb-4">
                    <SparklesIcon className="w-12 h-12 text-red-400"/>
                </div>
                <OjasGambheeraLogo />
                <h3 className="text-2xl font-bold text-white mt-4">is thinking...</h3>
                <p className="text-gray-400 mt-2">Analyzing your query to find the perfect match.</p>
            </div>
        );
      case 'error':
        return (
            <div className="text-center p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong.</h3>
                <ErrorMessage message={error} />
                <button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300 mt-4"
                >
                    Try Again
                </button>
            </div>
        );
      case 'result':
        if (!result || result.length === 0) {
            return (
                <div className="text-center p-8">
                    <OjasGambheeraLogo />
                    <h3 className="text-2xl font-bold text-white mb-4 mt-4">No Matches Found</h3>
                    <p className="text-gray-400 mb-6">OJAS GAMBHEERA couldn't find a recommendation for "{query}". Try a different or more general query.</p>
                    <button
                        onClick={handleReset}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        const topRecommendations = result
            .sort((a, b) => b.movie.imdbRating - a.movie.imdbRating)
            .slice(0, 5);

        return (
          <>
            <div className="text-center mb-6">
                <OjasGambheeraLogo />
                <p className="text-lg font-bold text-gray-300 -mt-2">Top Picks</p>
                <p className="text-gray-400 mt-4">Here are the top matches for "{query}":</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                {topRecommendations.map((rec) => (
                    <AnimeCard 
                        key={rec.movie.id} 
                        movie={rec.movie} 
                        onClick={() => onViewDetails(rec.movie)}
                    />
                ))}
            </div>

            <div className="flex justify-center mt-8">
                 <button
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300"
                >
                    Search Again
                </button>
            </div>
          </>
        );
      case 'query':
      default:
        return (
          <>
            <div className="text-center mb-6">
                <OjasGambheeraLogo />
                <p className="text-gray-400 mt-2">Tell OJAS GAMBHEERA what you're looking for.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="ai-query" className="block text-gray-300 text-sm font-bold mb-2 mt-4">
                    Enter a genre, creator, theme, or actor
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="ai-query"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., 'dark fantasy' or 'Studio Ghibli'"
                        required
                        autoFocus
                    />
                </div>
                <button
                    type="submit"
                    className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Get Recommendation
                </button>
            </form>
          </>
        );
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-red-500/50 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2 transition-colors z-20"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          {renderContent()}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AIInteractionModal;