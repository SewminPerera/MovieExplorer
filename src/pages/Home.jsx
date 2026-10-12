import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbApi } from '../api/tmdb';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/movies/MovieCard';
import SearchBar from '../components/movies/SearchBar';
import MovieFilters from '../components/movies/MovieFilters';

export default function Home() {
  const { lastSearch } = useMovieContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states (Bonus requirement)
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const navigate = useNavigate();

  // Load movies for page 1
  const loadInitialMovies = useCallback(async (searchQuery) => {
    setLoading(true);
    setError(null);
    setPage(1);

    try {
      if (searchQuery && searchQuery.trim()) {
        const data = await tmdbApi.searchMovies(searchQuery.trim(), 1);
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } else {
        const data = await tmdbApi.getTrending(1);
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to fetch movies. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialMovies(lastSearch);
  }, [loadInitialMovies, lastSearch]);

  // Load More handler (pagination)
  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      let data;
      if (lastSearch && lastSearch.trim()) {
        data = await tmdbApi.searchMovies(lastSearch.trim(), nextPage);
      } else {
        data = await tmdbApi.getTrending(nextPage);
      }

      // Append new movies and remove duplicates
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newUnique = (data.results || []).filter((m) => !existingIds.has(m.id));
        return [...prev, ...newUnique];
      });
      setPage(nextPage);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = (searchTerm) => {
    loadInitialMovies(searchTerm);
  };

  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
  };

  // Client-side filtering across the fetched movie catalog
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // 1. Genre filter
      if (selectedGenre && !movie.genre_ids?.includes(Number(selectedGenre))) {
        return false;
      }
      // 2. Year filter
      if (selectedYear) {
        const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : '';
        if (releaseYear !== selectedYear) return false;
      }
      // 3. Rating filter
      if (selectedRating && (movie.vote_average || 0) < Number(selectedRating)) {
        return false;
      }
      return true;
    });
  }, [movies, selectedGenre, selectedYear, selectedRating]);

  return (
    <main className="main-content">
      <SearchBar onSearch={handleSearch} />

      {/* Filter Component */}
      <MovieFilters
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        onReset={handleResetFilters}
      />

      <div className="section-header">
        <h2 className="section-title">
          {lastSearch ? `Search Results for "${lastSearch}"` : 'Trending Movies'}
        </h2>
        <p className="section-desc">
          Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'}
        </p>
      </div>

      {error && <div className="status-error-box">{error}</div>}

      {loading && <div className="status-loading">Loading movies...</div>}

      {!loading && !error && filteredMovies.length === 0 && (
        <div className="status-empty">
          <p className="empty-title">No matching movies found</p>
          <p className="empty-subtitle">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {!loading && !error && filteredMovies.length > 0 && (
        <>
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={(id) => navigate(`/movie/${id}`)}
              />
            ))}
          </div>

          {page < totalPages && (
            <div className="load-more-wrap">
              <button
                type="button"
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading more movies...' : 'Load More Movies'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}