import React, { useEffect } from 'react';
import { AnimeMovie } from '../types';
import { useAuth } from '../hooks/useAuth';
import { XIcon } from './icons/XIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { StarIcon } from './icons/StarIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { HeartIcon } from './icons/HeartIcon';
import { FilmIcon } from './icons/FilmIcon';

interface AnimeDetailModalProps {
  movie: AnimeMovie;
  onClose: () => void;
  onEdit: (movie: AnimeMovie) => void;
  onDelete: (movieId: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: number) => void;
}

const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({ movie, onClose, onEdit, onDelete, isFavorite, onToggleFavorite }) => {
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@example.com';

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

  const handleDeleteClick = () => {
    onDelete(movie.id);
    onClose();
  };

  const handleEditClick = () => {
    onEdit(movie);
    onClose();
  };


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-gray-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2 transition-colors z-20"
          aria-label="Close modal"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="relative h-64 md:h-96 w-full">
          <img 
            src={movie.posterUrl} 
            alt={`${movie.title} Poster`} 
            className="w-full h-full object-cover object-top rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/70 to-transparent"></div>
        </div>

        <div className="p-6 md:p-8 -mt-20 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">{movie.title}</h2>

            <div className="grid grid-cols-2 gap-3 mb-10 max-w-sm">
                <button
                    onClick={() => onToggleFavorite(movie.id)}
                    className={`font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 ${
                        isFavorite
                        ? 'bg-slate-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                    }`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <HeartIcon className="w-5 h-5" filled={isFavorite} />
                    <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>
                {isAdmin && (
                    <>
                        <button onClick={handleEditClick} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2">
                            <PencilIcon className="w-4 h-4" /> Edit
                        </button>
                         <button onClick={handleDeleteClick} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2">
                            <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                    </>
                )}
                 <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2">
                    <FilmIcon className="w-5 h-5"/>
                    Watch Trailer
                </a>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-400 mb-10">
                <div className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-red-400" /><span>{movie.releaseYear}</span></div>
                <div className="flex items-center gap-2"><UserCircleIcon className="w-5 h-5 text-red-400" /><span>Creator: {movie.creator}</span></div>
                {movie.imdbRating && (<div className="flex items-center gap-2"><StarIcon className="w-5 h-5 text-yellow-400"/><span>{movie.imdbRating} / 10 IMDb</span></div>)}
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-10">{movie.description}</p>
          
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-white mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => (<span key={index} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">{genre}</span>))}
                </div>
              </div>
            )}

            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><StarIcon className="w-6 h-6 text-yellow-400"/>Star Cast</h3>
                <div className="flex flex-wrap gap-2">
                    {movie.starCast.map((actor, index) => (<span key={index} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">{actor}</span>))}
                </div>
            </div>
        </div>
      </div>
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } .animate-slide-up { animation: slideUp 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AnimeDetailModal;