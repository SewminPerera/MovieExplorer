import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
});

tmdbClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: API_KEY,
  };
  return config;
});

export const tmdbApi = {
  getTrending: async (page = 1) => {
    const response = await tmdbClient.get('/trending/movie/week', {
      params: { page },
    });
    return response.data;
  },

  searchMovies: async (query, page = 1) => {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  getMovieDetails: async (movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos',
      },
    });
    return response.data;
  },

  getGenres: async () => {
    const response = await tmdbClient.get('/genre/movie/list');
    return response.data.genres;
  },
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) {
    return 'https://placehold.co/500x750/111827/9ca3af?text=No+Poster';
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};