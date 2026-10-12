import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useMovieContext } from '../../context/MovieContext';
import './Navbar.css';

export default function Navbar() {
  const { mode, toggleTheme, favorites, setLastSearch } = useMovieContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBrandClick = () => {
    setLastSearch('');
    setMenuOpen(false);
    window.location.href = '/';
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-bar">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={handleBrandClick}>
          Movie<span className="brand-accent">Explorer</span>
        </div>

        {/* Right side controls: Theme toggle + Hamburger */}
        <div className="navbar-actions">
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
          >
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </button>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button
            type="button"
            className="nav-link-btn"
            onClick={handleBrandClick}
          >
            Home
          </button>

          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Favorites
            {favorites.length > 0 && <span className="fav-badge">{favorites.length}</span>}
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Login
          </NavLink>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu-dropdown">
          <button
            type="button"
            className="mobile-nav-item"
            onClick={handleBrandClick}
          >
            Home
          </button>

          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
            onClick={closeMenu}
          >
            <span>Favorites</span>
            {favorites.length > 0 && <span className="fav-badge">{favorites.length}</span>}
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
            onClick={closeMenu}
          >
            Login
          </NavLink>
        </div>
      )}
    </header>
  );
}
