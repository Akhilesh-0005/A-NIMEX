import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOutIcon } from './icons/LogOutIcon';
import { SearchIcon } from './icons/SearchIcon';
import { AppIcon } from './icons/AppIcon';
import { MenuIcon } from './icons/MenuIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { UsersIcon } from './icons/UsersIcon';
import { UserIcon } from './icons/UserIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { HeartIcon } from './icons/HeartIcon';
import { Logo } from './icons/Logo';
import { FilterIcon } from './icons/FilterIcon';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';
import { XIcon } from './icons/XIcon';
import type { AnimeMovie } from '../types';

interface HeaderProps {
  onSearchQueryChange: (query: string) => void;
  allMovies: Pick<AnimeMovie, 'id' | 'title'>[];
  sortValue: string;
  onSortChange: (value: string) => void;
  onNavigateProfile: () => void;
  allGenres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  onOpenAddModal: () => void;
  onOpenManageUsersModal: () => void;
  isFavoritesFilterActive: boolean;
  onToggleFavoritesFilter: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onSearchQueryChange,
    allMovies,
    sortValue, 
    onSortChange,
    onNavigateProfile,
    allGenres,
    selectedGenre,
    onGenreChange,
    onOpenAddModal,
    onOpenManageUsersModal,
    isFavoritesFilterActive,
    onToggleFavoritesFilter,
}) => {
  const { user, logout } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.email === 'admin@example.com';

  useEffect(() => {
    const timerId = setTimeout(() => {
      onSearchQueryChange(inputValue);
      setIsSearching(false);
    }, 300);

    if (inputValue) {
      setIsSearching(true);
    } else {
      // Hide spinner immediately if input is cleared
      setIsSearching(false);
    }

    return () => clearTimeout(timerId);
  }, [inputValue, onSearchQueryChange]);
  
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [inputValue]);

  const suggestions = useMemo(() => {
    if (inputValue.length < 2) return [];
    const lowerCaseInput = inputValue.toLowerCase();
    return allMovies.filter(movie => 
        movie.title.toLowerCase().includes(lowerCaseInput)
    ).slice(0, 5);
  }, [inputValue, allMovies]);
  
  useEffect(() => {
    // Show suggestions if there are any, hide otherwise.
    // This will react to the user typing.
    setIsSuggestionsOpen(suggestions.length > 0);
  }, [suggestions]);

  const handleSuggestionClick = (title: string) => {
    setInputValue(title);
    onSearchQueryChange(title);
    setIsSuggestionsOpen(false);
    setIsFilterMenuOpen(false);
  };

  const handleClearSearch = () => {
    setInputValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSuggestionsOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        if (highlightedIndex > -1) {
          e.preventDefault();
          handleSuggestionClick(suggestions[highlightedIndex].title);
        }
        break;
      case 'Escape':
        setIsSuggestionsOpen(false);
        break;
    }
  };

  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
        return <span className="truncate">{text}</span>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span className="truncate">
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <strong key={i} className="font-bold text-red-300">
                        {part}
                    </strong>
                ) : (
                    part
                )
            )}
        </span>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) &&
        (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(event.target as Node))
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const hasSuggestions = isSuggestionsOpen && suggestions.length > 0;

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center flex-shrink-0">
            <div className="flex-shrink-0 mr-3">
              <AppIcon className="w-8 h-8"/>
            </div>
            <Logo className="h-8 w-auto" />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              <div 
                className="relative w-full max-w-xs lg:max-w-sm" 
                ref={searchContainerRef}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={hasSuggestions}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for anime..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="suggestions-list-desktop"
                  aria-activedescendant={highlightedIndex > -1 ? `suggestion-desktop-${highlightedIndex}` : undefined}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isSearching ? (
                    <LoadingSpinnerIcon className="h-5 w-5 text-gray-400" />
                  ) : inputValue && (
                    <button onClick={handleClearSearch} className="text-gray-400 hover:text-white" aria-label="Clear search">
                        <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {hasSuggestions && (
                  <ul 
                    id="suggestions-list-desktop"
                    role="listbox"
                    className="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-b-lg mt-1 z-50 shadow-lg max-h-60 overflow-y-auto"
                  >
                      {suggestions.map((suggestion, index) => (
                          <li 
                              key={suggestion.id}
                              id={`suggestion-desktop-${index}`}
                              role="option"
                              aria-selected={index === highlightedIndex}
                              className={`px-4 py-2 text-white cursor-pointer transition-colors duration-200 ${
                                index === highlightedIndex ? 'bg-red-600' : 'hover:bg-red-600'
                              }`}
                              onMouseDown={() => handleSuggestionClick(suggestion.title)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                          >
                              {renderHighlightedText(suggestion.title, inputValue)}
                          </li>
                      ))}
                  </ul>
                )}
              </div>
              <div className="relative">
                <select id="genre-filter" value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)} className="appearance-none bg-gray-700/80 hover:bg-gray-700 transition-colors text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer" aria-label="Filter by genre">
                  <option value="">All Genres</option>
                  {allGenres.map(genre => (<option key={genre} value={genre}>{genre}</option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><ChevronDownIcon className="h-5 w-5" /></div>
              </div>
              <div className="relative">
                <select id="sort-filter" value={sortValue} onChange={(e) => onSortChange(e.target.value)} className="appearance-none bg-gray-700/80 hover:bg-gray-700 transition-colors text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer" aria-label="Sort anime collection">
                  <option value="imdbRating-desc">Rating (High)</option>
                  <option value="imdbRating-asc">Rating (Low)</option>
                  <option value="releaseYear-desc">Year (Newest)</option>
                  <option value="releaseYear-asc">Year (Oldest)</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="genre-asc">Genre (A-Z)</option>
                  <option value="genre-desc">Genre (Z-A)</option>
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><ChevronDownIcon className="h-5 w-5" /></div>
              </div>
               <div className="flex items-center gap-2" title={isFavoritesFilterActive ? "Show all anime" : "Show only favorites"}>
                <HeartIcon className={`w-5 h-5 transition-colors ${isFavoritesFilterActive ? 'text-red-400' : 'text-gray-400'}`} />
                <button
                    id="favorites-toggle"
                    role="switch"
                    aria-checked={isFavoritesFilterActive}
                    onClick={onToggleFavoritesFilter}
                    className={`${isFavoritesFilterActive ? 'bg-red-500' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500`}
                >
                    <span
                        className={`${isFavoritesFilterActive ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </button>
              </div>
            </div>
            
            <div className="md:hidden flex items-center gap-2">
                <button
                    onClick={() => {
                        const opening = !isFilterMenuOpen;
                        setIsFilterMenuOpen(opening);
                        if (opening) {
                            setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
                        }
                    }}
                    className="flex items-center bg-gray-700/80 hover:bg-gray-700 text-gray-300 hover:text-white p-2 rounded-lg transition duration-300"
                    aria-label="Toggle search and filters"
                >
                   {isFilterMenuOpen ? <XIcon className="w-6 h-6"/> : <SearchIcon className="w-6 h-6" />}
                </button>
            </div>
            <div className="relative flex-shrink-0" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center bg-gray-700/80 hover:bg-gray-700 text-gray-300 hover:text-white p-2 rounded-lg transition duration-300" aria-label="User Menu" aria-expanded={isMenuOpen} aria-haspopup="true">
                    <MenuIcon className="w-6 h-6" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in-sm">
                        {user && (
                            <div className="px-4 py-3 border-b border-gray-700">
                                <p className="text-sm font-semibold text-white truncate">Signed in as</p>
                                <p className="text-sm text-gray-400 truncate">{user.email}</p>
                            </div>
                        )}
                        <div className="py-2">
                            {isAdmin && (
                                <>
                                    <button onClick={() => { onOpenAddModal(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3">
                                        <PlusCircleIcon className="w-5 h-5" /> Add Anime
                                    </button>
                                    <button onClick={() => { onOpenManageUsersModal(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3">
                                        <UsersIcon className="w-5 h-5" /> Manage Users
                                    </button>
                                    <div className="border-t border-gray-700 my-1"></div>
                                </>
                            )}
                            <button onClick={() => { onNavigateProfile(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3">
                                <UserIcon className="w-5 h-5" /> My Profile
                            </button>
                            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/50 hover:text-white flex items-center gap-3">
                                <LogOutIcon className="w-5 h-5" /> Logout
                            </button>
                        </div>
                    </div>
                )}
                <style>{`.animate-fade-in-sm { animation: fadeIn 0.2s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
            </div>
          </div>
        </div>
        {isFilterMenuOpen && (
            <div className="md:hidden pb-4 animate-fade-in-sm">
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-700">
                    <div 
                      className="relative w-full" 
                      ref={mobileSearchContainerRef}
                      role="combobox"
                      aria-haspopup="listbox"
                      aria-expanded={hasSuggestions}
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            ref={mobileSearchInputRef}
                            type="text"
                            placeholder="Search for anime..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                            autoComplete="off"
                            aria-autocomplete="list"
                            aria-controls="suggestions-list-mobile"
                            aria-activedescendant={highlightedIndex > -1 ? `suggestion-mobile-${highlightedIndex}` : undefined}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {isSearching ? (
                                <LoadingSpinnerIcon className="h-5 w-5 text-gray-400" />
                            ) : inputValue && (
                                <button onClick={handleClearSearch} className="text-gray-400 hover:text-white" aria-label="Clear search">
                                    <XIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        {hasSuggestions && (
                        <ul 
                          id="suggestions-list-mobile"
                          role="listbox"
                          className="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-b-lg mt-1 z-50 shadow-lg max-h-60 overflow-y-auto"
                        >
                            {suggestions.map((suggestion, index) => (
                                <li 
                                    key={suggestion.id}
                                    id={`suggestion-mobile-${index}`}
                                    role="option"
                                    aria-selected={index === highlightedIndex}
                                    className={`px-4 py-2 text-white cursor-pointer transition-colors duration-200 ${
                                      index === highlightedIndex ? 'bg-red-600' : 'hover:bg-red-600'
                                    }`}
                                    onMouseDown={() => handleSuggestionClick(suggestion.title)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    {renderHighlightedText(suggestion.title, inputValue)}
                                </li>
                            ))}
                        </ul>
                        )}
                    </div>
                    <div className="relative w-full">
                        <select id="genre-filter-mobile" value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)} className="appearance-none w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer" aria-label="Filter by genre">
                        <option value="">All Genres</option>
                        {allGenres.map(genre => (<option key={genre} value={genre}>{genre}</option>))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><ChevronDownIcon className="h-5 w-5" /></div>
                    </div>
                    <div className="relative w-full">
                        <select id="sort-filter-mobile" value={sortValue} onChange={(e) => onSortChange(e.target.value)} className="appearance-none w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer" aria-label="Sort anime collection">
                        <option value="imdbRating-desc">Rating (High)</option>
                        <option value="imdbRating-asc">Rating (Low)</option>
                        <option value="releaseYear-desc">Year (Newest)</option>
                        <option value="releaseYear-asc">Year (Oldest)</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                        <option value="genre-asc">Genre (A-Z)</option>
                        <option value="genre-desc">Genre (Z-A)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"><ChevronDownIcon className="h-5 w-5" /></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                        <span className="text-white font-medium">Show Favorites Only</span>
                        <div className="flex items-center gap-2" title={isFavoritesFilterActive ? "Show all anime" : "Show only favorites"}>
                            <HeartIcon className={`w-5 h-5 transition-colors ${isFavoritesFilterActive ? 'text-red-400' : 'text-gray-400'}`} />
                            <button
                                id="favorites-toggle-mobile"
                                role="switch"
                                aria-checked={isFavoritesFilterActive}
                                onClick={onToggleFavoritesFilter}
                                className={`${isFavoritesFilterActive ? 'bg-red-500' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500`}
                            >
                                <span
                                    className={`${isFavoritesFilterActive ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;