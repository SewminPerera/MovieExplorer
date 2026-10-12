# Movie Explorer

A responsive web application built with React that allows users to discover trending titles, search for movies, filter by release details, view cast and trailers, and manage a list of favorites.

- Live Demo - https://movieexplorer-iuwrp4vc8-sewminpereras-projects.vercel.app/
- GitHub Repository - https://github.com/SewminPerera/MovieExplorer
- GitLab Rpository -  https://gitlab.com/SewminPerera/movieExplorer.git

# Features Implemented

- Trending Movies - Fetches and displays popular releases for the current week on initial load.
- Search and Query Persistence - Real time search that preserves the last query in `localStorage` across page reloads.
- Filtering & Discovery - Filter catalog results directly by Genre, Release Year, and Minimum Rating via TMDb's discover API.
- Pagination - "Load More" button to append subsequent result pages without resetting scroll position.
- Detailed Movie View (`/movie/:id`) - Displays synopsis, runtime, genre tags, user score, top cast members, and an embedded YouTube trailer.
- Favorites System - Toggle favorites on any card; persisted locally in `localStorage` and viewable on `/favorites`.
- Theme Switching - Dark and Light mode toggle driven by custom CSS variables and saved to `localStorage`.
- Responsive Layout - Mobile first CSS grid supporting 2-column mobile displays up to multi column desktop screens.
- Mock Authentication - Basic login form interface located at `/login`.

# API Usage

This application integrates with The Movie Database (TMDb) using a centralized Axios client.

An Axios request interceptor automatically attaches the API key to every outgoing request. The primary endpoints used include:

- `GET /trending/movie/week` – Fetches weekly trending titles.
- `GET /search/movie` – Searches films by title query with pagination.
- `GET /discover/movie` – Queries films based on release year, genre ID, and vote average.
- `GET /movie/{id}?append_to_response=credits,videos` – Retrieves full film metadata along with cast credits and YouTube trailer keys in a single round-trip.
- `GET /genre/movie/list` – Populates available genres in the filter dropdown.

# Project Setup

# Prerequisites
- Node.js (v16.x or newer recommended)
- npm or yarn
- A TMDb API key ([themoviedb.org](https://developer.themoviedb.org/docs))

# Installation & Local Run

1. Clone the repository:
   ```bash
   git clone [https://github.com/SewminPerera/MovieExplorer.git](https://github.com/SewminPerera/MovieExplorer.git)
   cd MovieExplorer
