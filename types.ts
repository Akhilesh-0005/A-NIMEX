export interface User {
  id: string;
  email: string;
  password?: string;
  favorites?: number[];
}

export interface AnimeMovie {
  id: number;
  title: string;
  releaseYear: number;
  description: string;
  creator: string;
  starCast: string[];
  posterUrl: string;
  trailerUrl: string;
  imdbRating: number;
  genres: string[];
}

export interface AIRecommendation {
    movie: AnimeMovie;
    reason: string;
}

export enum AppView {
    LOGIN = 'login',
    SIGNUP = 'signup',
    HOME = 'home',
    PROFILE = 'profile',
}