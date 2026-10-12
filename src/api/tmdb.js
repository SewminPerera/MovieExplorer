import axios from 'axios';

const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically append the API key to all outgoing requests
tmdbClient.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      api_key: API_KEY,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

export const tmdbApi = {
  // Weekly trending movies with pagination
  getTrending: async (page = 1) => {
    const response = await tmdbClient.get('/trending/movie/week', {
      params: { page },
    });
    return response.data;
  },

  // Search movies by title with pagination
  searchMovies: async (query, page = 1) => {
    const response = await tmdbClient.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  },

  // Movie details including cast credits and video trailers
  getMovieDetails: async (movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos',
      },
    });
    return response.data;
  },

  // Official movie genre list
  getGenres: async () => {
    const response = await tmdbClient.get('/genre/movie/list');
    return response.data.genres || [];
  },

  // Discover movies by Year, Genre, and Minimum Rating
  discoverMovies: async ({ genre, year, rating, page = 1 } = {}) => {
    const params = {
      page,
      sort_by: 'popularity.desc',
      include_adult: false,
    };

    if (genre) {
      params.with_genres = genre;
    }

    if (year) {
      params.primary_release_year = year;
    }

    if (rating) {
      params['vote_average.gte'] = rating;
      params['vote_count.gte'] = 50; // filters out obscure movies with single reviews
    }

    const response = await tmdbClient.get('/discover/movie', { params });
    return response.data;
  },
};

// Image helper with fallback placeholder
export const getImageUrl = (path, size = 'w500') => {
  if (!path) {
    return 'https://placehold.co/500x750/111827/9ca3af?text=No+Poster+Available';
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default tmdbClient;