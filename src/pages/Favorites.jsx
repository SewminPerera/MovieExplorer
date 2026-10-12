import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/movies/MovieCard';

export default function Favorites() {
  const { favorites } = useMovieContext();
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <div className="section-header">
        <h2 className="section-title">My Favorites</h2>
        <p className="section-desc">
          {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved locally
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="status-empty">
          <p className="empty-title">No favorite movies yet</p>
          <p className="empty-subtitle">Browse movies and click the heart icon to save them here.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={(id) => navigate(`/movie/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}