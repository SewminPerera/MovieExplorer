import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext(null);

export const MovieProvider = ({ children }) => {
  // Theme state: dark by default, retrieved from localStorage
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('movie_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastSearch, setLastSearch] = useState(() => {
    return localStorage.getItem('last_search_query') || '';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', mode);
    document.body.className = mode;
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('movie_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (lastSearch.trim()) {
      localStorage.setItem('last_search_query', lastSearch);
    }
  }, [lastSearch]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        return prev.filter((item) => item.id !== movie.id);
      } else {
        const compactMovie = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        };
        return [compactMovie, ...prev];
      }
    });
  };

  const isFavorite = (movieId) => {
    return favorites.some((item) => item.id === movieId);
  };

  return (
    <MovieContext.Provider
      value={{
        mode,
        toggleTheme,
        favorites,
        toggleFavorite,
        isFavorite,
        lastSearch,
        setLastSearch,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};