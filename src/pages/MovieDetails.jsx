import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { tmdbApi, getImageUrl } from '../api/tmdb';
import './MovieDetails.css';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tmdbApi.getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error('Failed to load movie details:', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="details-container">
        <div className="status-loading">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="details-container">
        <div className="status-error-box">{error || 'Movie not found.'}</div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="small" /> Go Back
        </button>
      </div>
    );
  }

  // find official youTube trailer
  const trailer = movie.videos?.results?.find(
    (vid) => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
  );

  // take top 8 billed cast members
  const topCast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize="small" /> Back to Movies
      </button>

      <section className="details-hero">
        <div className="details-poster-wrap">
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="details-poster"
          />
        </div>

        <div className="details-info">
          <h1 className="details-title">{movie.title}</h1>
          {movie.tagline && <p className="details-tagline">"{movie.tagline}"</p>}

          <div className="details-meta-row">
            <span className="meta-pill">
              <StarIcon fontSize="small" />
              {movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'NR'} / 10
            </span>

            {movie.release_date && (
              <span className="meta-pill">
                <CalendarMonthIcon fontSize="small" />
                {movie.release_date}
              </span>
            )}

            {movie.runtime > 0 && (
              <span className="meta-pill">
                <AccessTimeIcon fontSize="small" />
                {movie.runtime} min
              </span>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="genre-tags">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-tag">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div>
            <h2 className="details-section-heading">Overview</h2>
            <p className="details-overview">
              {movie.overview || 'No overview available for this title.'}
            </p>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      {topCast.length > 0 && (
        <section style={{ marginTop: '36px' }}>
          <h2 className="details-section-heading">Top Billed Cast</h2>
          <div className="cast-grid">
            {topCast.map((person) => (
              <div key={person.id} className="cast-card">
                <img
                  src={
                    person.profile_path
                      ? getImageUrl(person.profile_path, 'w185')
                      : 'https://placehold.co/185x225/111827/9ca3af?text=No+Photo'
                  }
                  alt={person.name}
                  className="cast-img"
                  loading="lazy"
                />
                <p className="cast-name" title={person.name}>
                  {person.name}
                </p>
                <p className="cast-character" title={person.character}>
                  {person.character}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trailer Section */}
      {trailer && (
        <section className="trailer-section">
          <h2 className="details-section-heading">Official Trailer</h2>
          <div className="trailer-wrapper">
            <iframe
              className="trailer-iframe"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </div>
  );
}