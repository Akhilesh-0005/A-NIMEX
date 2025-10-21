import React, { useState, useRef, useEffect } from 'react';
import { AnimeMovie } from '../types';
import { useAuth } from '../hooks/useAuth';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MoreVerticalIcon } from './icons/MoreVerticalIcon';
import { HeartIcon } from './icons/HeartIcon';

interface AnimeCardProps {
  movie: AnimeMovie;
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  searchQuery?: string;
}

const getGenreColor = (genre?: string): string => {
  switch (genre?.toLowerCase()) {
    case 'action': return 'bg-red-500/50 text-red-200';
    case 'adventure': return 'bg-orange-500/50 text-orange-200';
    case 'comedy': return 'bg-yellow-500/50 text-yellow-200';
    case 'drama': return 'bg-blue-500/50 text-blue-200';
    case 'sci-fi': return 'bg-purple-500/50 text-purple-200';
    case 'fantasy': return 'bg-indigo-500/50 text-indigo-200';
    case 'horror': return 'bg-gray-600/50 text-gray-200';
    case 'romance': return 'bg-pink-500/50 text-pink-200';
    case 'sport': return 'bg-green-500/50 text-green-200';
    case 'thriller': return 'bg-rose-500/50 text-rose-200';
    case 'mystery': return 'bg-teal-500/50 text-teal-200';
    case 'crime': return 'bg-slate-500/50 text-slate-200';
    default: return 'bg-red-500/50 text-red-200';
  }
};

const AnimeCard: React.FC<AnimeCardProps> = ({ movie, onClick, onEdit, onDelete, isFavorite, onToggleFavorite, searchQuery = '' }) => {
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@example.com';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const canFavorite = typeof isFavorite !== 'undefined' && onToggleFavorite;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(e);
    setIsMenuOpen(false);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(e);
    setIsMenuOpen(false);
  };

  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim() || !text.toLowerCase().includes(highlight.toLowerCase())) {
        return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <strong key={i} className="font-bold text-red-300">
                        {part}
                    </strong>
                ) : (
                    part
                )
            )}
        </>
    );
  };

  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer group transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
    >
      <div className="relative">
        <img 
          src={movie.posterUrl} 
          alt={`${movie.title} Poster`} 
          className="w-full h-64 sm:h-72 object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
        
        {canFavorite && (
             <button
                onClick={onToggleFavorite}
                className={`absolute top-2 left-2 z-10 p-2 rounded-full transition-all duration-200 transform scale-0 group-hover:scale-100 ${
                    isFavorite 
                    ? 'bg-red-500/80 text-white hover:bg-red-600/80' 
                    : 'bg-gray-900/60 text-gray-300 hover:bg-gray-900/80 hover:text-white'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <HeartIcon className="w-4 h-4" filled={isFavorite} />
            </button>
        )}
        
        {isAdmin && onEdit && onDelete && (
          <div className="absolute top-2 right-2 z-10" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="bg-gray-900/60 hover:bg-gray-900/80 text-white p-2 rounded-full shadow-lg"
              aria-label="More options"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-700 border border-gray-600 rounded-md shadow-xl py-1 animate-fade-in-sm">
                <button
                  onClick={handleEditClick}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
             <h3 className="text-white text-lg font-bold truncate mb-1">{renderHighlightedText(movie.title, searchQuery)}</h3>
             <div className="flex items-center gap-2">
                {movie.genres && movie.genres.length > 0 && (
                    <span className={`backdrop-blur-sm text-xs font-medium px-2 py-0.5 rounded-full ${getGenreColor(movie.genres[0])}`}>
                        {movie.genres[0]}
                    </span>
                )}
                <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
             </div>
        </div>
      </div>
      <style>{`.animate-fade-in-sm { animation: fadeIn 0.2s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};

export default AnimeCard;