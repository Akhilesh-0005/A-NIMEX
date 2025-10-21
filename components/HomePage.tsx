import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from '../hooks/useAuth';
import { ANIME_MOVIES } from '../data/animeData'; // Keep for AI context
import { AnimeMovie, AIRecommendation } from '../types';
import Header from './Header';
import AnimeCard from './AnimeCard';
import AnimeDetailModal from './AnimeDetailModal';
import AIInteractionModal from './AIRecommendationModal';
import { SparklesIcon } from './icons/SparklesIcon';
import EmptyState from './EmptyState';

type SortKey = 'title' | 'releaseYear' | 'imdbRating' | 'genre';
type SortDirection = 'asc' | 'desc';

const MOVIES_PER_PAGE = 20;

const enhancedSearch = (query: string, text: string): number => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return 0;

    const normalizedText = text.toLowerCase();

    // Prioritize matches in order of quality
    if (normalizedText === normalizedQuery) return 5; // 1. Exact match
    if (normalizedText.startsWith(normalizedQuery)) return 4; // 2. Starts with match
    if (normalizedText.includes(normalizedQuery)) return 3; // 3. Contains match
    
    // 4. Word starts with match
    const words = normalizedText.split(/\s+/);
    if (words.some(word => word.startsWith(normalizedQuery))) return 2;

    // 5. Fuzzy character sequence match (lowest score)
    const queryChars = normalizedQuery.replace(/\s/g, '');
    let queryIndex = 0;
    let textIndex = 0;
    while (queryIndex < queryChars.length && textIndex < normalizedText.length) {
        if (queryChars[queryIndex] === normalizedText[textIndex]) {
            queryIndex++;
        }
        textIndex++;
    }

    return queryIndex === queryChars.length ? 1 : 0;
};


interface HomePageProps {
    movies: AnimeMovie[];
    onNavigateProfile: () => void;
    onOpenAddModal: () => void;
    onOpenManageUsersModal: () => void;
    onEditMovie: (movie: AnimeMovie) => void;
    onDeleteMovie: (movieId: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
    movies, 
    onNavigateProfile,
    onOpenAddModal,
    onOpenManageUsersModal,
    onEditMovie,
    onDeleteMovie
}) => {
  const { user, toggleFavorite } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<AnimeMovie | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('imdbRating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const movieTitlesForHeader = useMemo(() => movies.map(({ id, title }) => ({ id, title })), [movies]);

  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    movies.forEach(movie => {
        movie.genres.forEach(genre => genresSet.add(genre));
    });
    return Array.from(genresSet).sort();
  }, [movies]);

  const filteredAndSortedMovies = useMemo(() => {
    let currentMovies = [...movies];
    
    if (showFavoritesOnly) {
        currentMovies = currentMovies.filter(movie => user?.favorites?.includes(movie.id));
    }

    if (selectedGenre) {
        currentMovies = currentMovies.filter(movie => movie.genres.includes(selectedGenre));
    }

    const scoredMovies = currentMovies
      .map(movie => {
        let relevanceScore = 0;
        if (searchQuery) {
            const titleScore = enhancedSearch(searchQuery, movie.title);
            const creatorScore = enhancedSearch(searchQuery, movie.creator);
            const otherFieldsMaxScore = Math.max(
                ...movie.genres.map(genre => enhancedSearch(searchQuery, genre)),
                enhancedSearch(searchQuery, movie.description),
                ...movie.starCast.map(actor => enhancedSearch(searchQuery, actor))
            );
            // New weighting: Title gets 10x, Creator gets 5x, other fields get 1x.
            relevanceScore = (titleScore * 10) + (creatorScore * 5) + otherFieldsMaxScore;
        }
        return { movie, relevanceScore };
      })
      .filter(({ relevanceScore }) => !searchQuery || relevanceScore > 0);

    scoredMovies.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      const movieA = a.movie;
      const movieB = b.movie;
      const aValue = sortKey === 'genre' ? (movieA.genres[0] || '') : movieA[sortKey];
      const bValue = sortKey === 'genre' ? (movieB.genres[0] || '') : movieB[sortKey];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return scoredMovies.map(({ movie }) => movie);
  }, [searchQuery, sortKey, sortDirection, selectedGenre, movies, showFavoritesOnly, user?.favorites]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortKey, sortDirection, selectedGenre, showFavoritesOnly]);

  const totalPages = Math.ceil(filteredAndSortedMovies.length / MOVIES_PER_PAGE);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    return filteredAndSortedMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [currentPage, filteredAndSortedMovies]);

  const handleSortChange = (value: string) => {
    const [key, direction] = value.split('-') as [SortKey, SortDirection];
    setSortKey(key);
    setSortDirection(direction);
  };
  
  const handleCardClick = (movie: AnimeMovie) => {
    setSelectedMovie(movie);
  };

 const handleGetRecommendation = async (query: string): Promise<AIRecommendation[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const availableMovies = ANIME_MOVIES; 
        if (availableMovies.length === 0) {
            throw new Error("There are no movies in the database to recommend from.");
        }
        const candidateTitles = availableMovies.map(m => m.title);
        const prompt = `You are an expert anime recommender AI called "OJAS GAMBHEERA". A user is looking for an anime recommendation based on this query: "${query}". This query could be a genre, creator, actor, or a theme. Your task is to analyze the query and recommend the best matching anime from the list of available candidates. If multiple anime are good matches, you can return several. Your recommendations MUST be from the provided candidate list. Provide a personalized and insightful reason (2-3 sentences) for EACH recommendation, explaining *why* it is a great match for the user's query.

Available candidates:
${JSON.stringify(candidateTitles, null, 2)}

Your response should be a JSON object with a single key "recommendations" which is an array of objects, where each object contains a "title" and a "reason".`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT, properties: { recommendations: { type: Type.ARRAY, description: "A list of recommended anime.", items: { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: "The exact title of the recommended anime from the candidate list." }, reason: { type: Type.STRING, description: "A detailed, personalized reason for the recommendation." } }, required: ["title", "reason"] } } }, required: ["recommendations"]
                }
            }
        });
        
        const responseText = response.text.trim();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error("AI Recommendation Error: Failed to parse JSON.", { error: parseError, response: responseText });
            throw new Error("The AI returned an invalid response format. Please try again.");
        }

        if (result.recommendations && Array.isArray(result.recommendations)) {
            const recommendations: AIRecommendation[] = result.recommendations
                .map((rec: { title: string; reason: string }) => {
                    const recommendedMovie = ANIME_MOVIES.find(m => m.title === rec.title);
                    if (recommendedMovie) { return { movie: recommendedMovie, reason: rec.reason }; }
                    return null;
                })
                .filter((rec: AIRecommendation | null): rec is AIRecommendation => rec !== null);
            return recommendations;
        } else {
             throw new Error("Could not get a recommendation. The AI response was incomplete. Please try again.");
        }
    } catch (err: any) {
        console.error("AI Recommendation API Error:", err);
        throw new Error(err.message || "Failed to get a recommendation due to a network or API error.");
    }
  };

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const sortValue = `${sortKey}-${sortDirection}`;

  return (
    <div className="flex-grow flex flex-col">
      <Header 
        onSearchQueryChange={setSearchQuery}
        allMovies={movieTitlesForHeader}
        sortValue={sortValue}
        onSortChange={handleSortChange}
        onNavigateProfile={onNavigateProfile}
        allGenres={allGenres}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        onOpenAddModal={onOpenAddModal}
        onOpenManageUsersModal={onOpenManageUsersModal}
        isFavoritesFilterActive={showFavoritesOnly}
        onToggleFavoritesFilter={() => setShowFavoritesOnly(prev => !prev)}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-200">Featured Anime</h2>
            <button
                onClick={() => setIsRecModalOpen(true)}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                title="Get an AI-powered recommendation"
            >
                <SparklesIcon className="w-5 h-5"/>
                <span>Get AI Recommendation</span>
            </button>
        </div>

        {filteredAndSortedMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {paginatedMovies.map((movie) => (
                <AnimeCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={() => handleCardClick(movie)}
                    isFavorite={user?.favorites?.includes(movie.id) ?? false}
                    searchQuery={searchQuery}
                    onToggleFavorite={(e) => {
                        e.stopPropagation();
                        toggleFavorite(movie.id);
                    }}
                    onEdit={(e) => {
                        e.stopPropagation();
                        onEditMovie(movie);
                    }}
                    onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteMovie(movie.id);
                    }}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="bg-gray-700 hover:bg-red-600 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Previous
                </button>
                <span className="text-gray-400 font-semibold">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-gray-700 hover:bg-red-600 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
            <EmptyState query={searchQuery} />
        )}
      </main>

      {selectedMovie && (
        <AnimeDetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          onEdit={onEditMovie}
          onDelete={onDeleteMovie}
          isFavorite={user?.favorites?.includes(selectedMovie.id) ?? false}
          onToggleFavorite={toggleFavorite}
        />
      )}
       {isRecModalOpen && (
        <AIInteractionModal
            onClose={() => setIsRecModalOpen(false)}
            getRecommendation={handleGetRecommendation}
            onViewDetails={(movie) => {
                setIsRecModalOpen(false);
                setSelectedMovie(movie);
            }}
        />
      )}
    </div>
  );
};

export default HomePage;