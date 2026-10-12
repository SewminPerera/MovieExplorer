import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getImageUrl } from '../../api/tmdb';
import { useMovieContext } from '../../context/MovieContext';
import './MovieCard.css';

export default function MovieCard({ movie, onSelect }) {
  const { toggleFavorite, isFavorite } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : 'N/A';

  const rating = movie.vote_average
    ? Number(movie.vote_average).toFixed(1)
    : 'NR';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="movie-card" onClick={() => onSelect && onSelect(movie.id)}>
      <div className="poster-wrapper">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className="movie-poster"
          loading="lazy"
        />

        <div className="rating-badge">
          <StarIcon fontSize="inherit" />
          <span>{rating}</span>
        </div>

        <button
          className={`fav-btn ${favorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorite ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </button>
      </div>

      <div className="movie-meta">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <span className="movie-year">{releaseYear}</span>
      </div>
    </div>
  );
}