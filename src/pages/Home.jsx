import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbApi } from '../api/tmdb';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/movies/MovieCard';
import SearchBar from '../components/movies/SearchBar';
import MovieFilters from '../components/movies/MovieFilters';

export default function Home() {
  const { lastSearch, setLastSearch } = useMovieContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const navigate = useNavigate();

  const hasActiveFilters = Boolean(selectedGenre || selectedYear || selectedRating);

  // Fetch movies by  priority
  const fetchMovieCatalog = useCallback(
    async (targetPage = 1) => {
      if (lastSearch && lastSearch.trim()) {
        return await tmdbApi.searchMovies(lastSearch.trim(), targetPage);
      }

      if (hasActiveFilters) {
        return await tmdbApi.discoverMovies({
          genre: selectedGenre,
          year: selectedYear,
          rating: selectedRating,
          page: targetPage,
        });
      }

      return await tmdbApi.getTrending(targetPage);
    },
    [lastSearch, hasActiveFilters, selectedGenre, selectedYear, selectedRating]
  );

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    setError(null);
    setPage(1);

    fetchMovieCatalog(1)
      .then((data) => {
        if (!isSubscribed) return;
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.error('Fetch error:', err);
        setError('Unable to load movies. Please check your connection and try again.');
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [fetchMovieCatalog]);

  // handle load More 
  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const data = await fetchMovieCatalog(nextPage);
      setMovies((prevMovies) => {
        const existingIds = new Set(prevMovies.map((m) => m.id));
        const uniqueNewMovies = (data.results || []).filter((m) => !existingIds.has(m.id));
        return [...prevMovies, ...uniqueNewMovies];
      });
      setPage(nextPage);
    } catch (err) {
      console.error('Pagination error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // when searching clear any active dropdown filters
  const handleSearch = (searchTerm) => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setLastSearch(searchTerm);
  };

  // reset dropdown filters
  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
  };

  const renderSectionHeading = () => {
    if (lastSearch) {
      return `Search Results for "${lastSearch}"`;
    }
    if (hasActiveFilters) {
      const criteria = [];
      if (selectedYear) criteria.push(`Released in ${selectedYear}`);
      if (selectedRating) criteria.push(`Rated ${selectedRating}+ Stars`);
      return `Filtered Movies (${criteria.join(' • ') || 'Custom Selection'})`;
    }
    return 'Trending Movies';
  };

  return (
    <main className="main-content">
      <SearchBar onSearch={handleSearch} />

      <MovieFilters
        selectedGenre={selectedGenre}
        onGenreChange={(val) => {
          setLastSearch('');
          setSelectedGenre(val);
        }}
        selectedYear={selectedYear}
        onYearChange={(val) => {
          setLastSearch('');
          setSelectedYear(val);
        }}
        selectedRating={selectedRating}
        onRatingChange={(val) => {
          setLastSearch('');
          setSelectedRating(val);
        }}
        onReset={handleResetFilters}
      />

      <div className="section-header">
        <h2 className="section-title">{renderSectionHeading()}</h2>
        <p className="section-desc">
          Showing {movies.length} {movies.length === 1 ? 'title' : 'titles'}
        </p>
      </div>

      {error && <div className="status-error-box">{error}</div>}

      {loading && <div className="status-loading">Loading movies...</div>}

      {!loading && !error && movies.length === 0 && (
        <div className="status-empty">
          <p className="empty-title">No movies match this filter</p>
          <p className="empty-subtitle">Try choosing a different year, genre, or search term.</p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
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