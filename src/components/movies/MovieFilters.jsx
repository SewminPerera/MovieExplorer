import React, { useEffect, useState } from 'react';
import { tmdbApi } from '../../api/tmdb';
import './MovieFilters.css';

export default function MovieFilters({
  selectedGenre,
  onGenreChange,
  selectedYear,
  onYearChange,
  selectedRating,
  onRatingChange,
  onReset,
}) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenreList = async () => {
      try {
        const list = await tmdbApi.getGenres();
        setGenres(list || []);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    fetchGenreList();
  }, []);

  // Generate recent years (current year down to 1990)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, idx) => currentYear - idx);

  const hasActiveFilters = selectedGenre || selectedYear || selectedRating;

  return (
    <div className="filters-bar">
      {/* Genre Filter */}
      <div className="filter-group">
        <label className="filter-label">Genre</label>
        <select
          className="filter-select"
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div className="filter-group">
        <label className="filter-label">Year</label>
        <select
          className="filter-select"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
        >
          <option value="">All Years</option>
          {years.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating Filter */}
      <div className="filter-group">
        <label className="filter-label">Min Rating</label>
        <select
          className="filter-select"
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="8">8+ ⭐ (Exceptional)</option>
          <option value="7">7+ ⭐ (Good)</option>
          <option value="6">6+ ⭐ (Decent)</option>
          <option value="5">5+ ⭐ (Average)</option>
        </select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          className="reset-filters-btn"
          onClick={onReset}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}