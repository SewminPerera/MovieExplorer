import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useMovieContext } from '../../context/MovieContext';
import './Navbar.css';

export default function Navbar() {
  const { mode, toggleTheme, favorites, setLastSearch } = useMovieContext();
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    e.preventDefault();
    setLastSearch(''); // reset  active query 
    navigate('/');     //home page
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand-link" onClick={handleBrandClick}>
        <h1 className="brand-title">
          Movie<span>Explorer</span>
        </h1>
      </Link>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          end
          onClick={() => setLastSearch('')}
        >
          Home
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Favorites
          <span className="fav-counter">{favorites.length}</span>
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Login
        </NavLink>

        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
        >
          {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          <span className="theme-btn-label">
            {mode === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>
      </nav>
    </header>
  );
}