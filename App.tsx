import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import AddEditAnimeModal from './components/AddEditAnimeModal';
import ManageUsersModal from './components/ManageUsersModal';
import { AppView, AnimeMovie } from './types';
import { ANIME_MOVIES } from './data/animeData';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

type ModalType = 'ADD_ANIME' | 'EDIT_ANIME' | 'MANAGE_USERS';

const App: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<AppView>(AppView.LOGIN);
  const [appView, setAppView] = useState<AppView>(AppView.HOME);

  // State for temporary data management
  const [movies, setMovies] = useState<AnimeMovie[]>(ANIME_MOVIES);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [movieToEdit, setMovieToEdit] = useState<AnimeMovie | null>(null);

  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } 
    );

    const currentFooterRef = footerRef.current;
    if (currentFooterRef) {
      observer.observe(currentFooterRef);
    }

    return () => {
      if (currentFooterRef) {
        observer.unobserve(currentFooterRef);
      }
    };
  }, []);


  const handleAddMovie = (newMovie: Omit<AnimeMovie, 'id'>) => {
    setMovies(prevMovies => [
      { ...newMovie, id: Date.now() }, 
      ...prevMovies
    ]);
    setActiveModal(null);
  };

  const handleUpdateMovie = (updatedMovie: AnimeMovie) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => movie.id === updatedMovie.id ? updatedMovie : movie)
    );
    setActiveModal(null);
    setMovieToEdit(null);
  };

  const handleDeleteMovie = (movieId: number) => {
    if (window.confirm('Are you sure you want to delete this anime? This action is temporary and will be undone on page reload.')) {
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    }
  };
  
  const handleOpenEditModal = (movie: AnimeMovie) => {
    setMovieToEdit(movie);
    setActiveModal('EDIT_ANIME');
  };

  const renderPage = () => {
      if (!user) {
          if (authView === AppView.SIGNUP) {
              return <SignUpPage onSwitchToLogin={() => setAuthView(AppView.LOGIN)} />;
          }
          return <LoginPage onSwitchToSignUp={() => setAuthView(AppView.SIGNUP)} />;
      }

      if (appView === AppView.PROFILE) {
          return <ProfilePage onNavigateHome={() => setAppView(AppView.HOME)} />;
      }

      return (
          <HomePage 
              movies={movies}
              onNavigateProfile={() => setAppView(AppView.PROFILE)}
              onOpenAddModal={() => setActiveModal('ADD_ANIME')}
              onOpenManageUsersModal={() => setActiveModal('MANAGE_USERS')}
              onEditMovie={handleOpenEditModal}
              onDeleteMovie={handleDeleteMovie}
          />
      );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>

      <Footer ref={footerRef} />

      <ScrollToTopButton isFooterVisible={isFooterVisible} />

      {user && (activeModal === 'ADD_ANIME' || activeModal === 'EDIT_ANIME') && (
        <AddEditAnimeModal
          movieToEdit={movieToEdit}
          onClose={() => {
            setActiveModal(null);
            setMovieToEdit(null);
          }}
          onSave={(movieData) => {
            if (movieToEdit) {
              handleUpdateMovie({ ...movieData, id: movieToEdit.id });
            } else {
              handleAddMovie(movieData);
            }
          }}
        />
      )}

      {user && activeModal === 'MANAGE_USERS' && (
        <ManageUsersModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default App;