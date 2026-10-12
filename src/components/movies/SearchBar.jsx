import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useMovieContext } from '../../context/MovieContext';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const { lastSearch, setLastSearch } = useMovieContext();
  const [query, setQuery] = useState(lastSearch);

  // keep query in sync
  useEffect(() => {
    setQuery(lastSearch);
  }, [lastSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLastSearch(query.trim());
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    setLastSearch('');
    onSearch(''); // triggers return to trending movies
  };

  return (
    <div>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search movies by title (press Enter)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={handleClear}
              aria-label="Clear search input"
            >
              <CloseIcon fontSize="small" />
            </button>
          )}
        </div>
      </form>

      {lastSearch && (
        <div className="last-search-chip">
          Showing results for: <strong>"{lastSearch}"</strong> •{' '}
          <span onClick={handleClear}>Back to Trending</span>
        </div>
      )}
    </div>
  );
}