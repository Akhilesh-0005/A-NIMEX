import React, { useState, useEffect } from 'react';
import { AnimeMovie } from '../types';
import { XIcon } from './icons/XIcon';

interface AddEditAnimeModalProps {
  movieToEdit: AnimeMovie | null;
  onClose: () => void;
  onSave: (movie: Omit<AnimeMovie, 'id'>) => void;
}

const AddEditAnimeModal: React.FC<AddEditAnimeModalProps> = ({ movieToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    releaseYear: new Date().getFullYear(),
    description: '',
    creator: '',
    starCast: '',
    posterUrl: '',
    trailerUrl: '',
    imdbRating: 0.0,
    genres: ''
  });

  const isEditMode = !!movieToEdit;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: movieToEdit.title,
        releaseYear: movieToEdit.releaseYear,
        description: movieToEdit.description,
        creator: movieToEdit.creator,
        starCast: movieToEdit.starCast.join(', '),
        posterUrl: movieToEdit.posterUrl,
        trailerUrl: movieToEdit.trailerUrl,
        imdbRating: movieToEdit.imdbRating,
        genres: movieToEdit.genres.join(', '),
      });
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [movieToEdit, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const movieData = {
      ...formData,
      starCast: formData.starCast.split(',').map(s => s.trim()).filter(Boolean),
      genres: formData.genres.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave(movieData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-gray-700 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Anime' : 'Add New Anime'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-300">Release Year</label>
              <input type="number" name="releaseYear" id="releaseYear" value={formData.releaseYear} onChange={handleChange} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label htmlFor="imdbRating" className="block text-sm font-medium text-gray-300">IMDb Rating</label>
              <input type="number" name="imdbRating" id="imdbRating" value={formData.imdbRating} onChange={handleChange} step="0.1" required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
          </div>
          <div>
            <label htmlFor="creator" className="block text-sm font-medium text-gray-300">Creator</label>
            <input type="text" name="creator" id="creator" value={formData.creator} onChange={handleChange} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-300">Poster URL</label>
            <input type="url" name="posterUrl" id="posterUrl" value={formData.posterUrl} onChange={handleChange} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="trailerUrl" className="block text-sm font-medium text-gray-300">IMDb/Trailer URL</label>
            <input type="url" name="trailerUrl" id="trailerUrl" value={formData.trailerUrl} onChange={handleChange} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="genres" className="block text-sm font-medium text-gray-300">Genres (comma-separated)</label>
            <input type="text" name="genres" id="genres" value={formData.genres} onChange={handleChange} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
           <div>
            <label htmlFor="starCast" className="block text-sm font-medium text-gray-300">Star Cast (comma-separated)</label>
            <input type="text" name="starCast" id="starCast" value={formData.starCast} onChange={handleChange} required className="mt-1 w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition mr-2">Cancel</button>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">{isEditMode ? 'Save Changes' : 'Add Anime'}</button>
          </div>
        </form>
      </div>
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } .animate-slide-up { animation: slideUp 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AddEditAnimeModal;