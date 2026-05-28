import React, { useState, useEffect, useRef } from "react";
import "./Search.css";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import search_icon from "../../assets/search_icon.svg";

const TMDB_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjNlN2Q0NWJmODhlMGIwNDNkY2NkZDA1MzZjYWUzNiIsIm5iZiI6MTc1MDkzOTQwNC41NDMsInN1YiI6IjY4NWQzNzBjMjIwNzY0ZjhkYTE1NTVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dbK6BOyNMoxw2KSyyZPq3j5u_mhbMD42dABjvpm3QFc";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-focus search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const performSearch = async (q) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: TMDB_TOKEN,
          },
        }
      );
      const data = await res.json();
      // Filter out people results, only keep movie & tv
      const filtered = (data.results || []).filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayInfo = (item) => {
    const title = item.title || item.name || item.original_title || item.original_name;
    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
    const image = item.poster_path || item.backdrop_path;
    return { title, year, rating, image };
  };

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-hero">
        <div className="search-hero-inner">
          <h1>Find Your Next Watch</h1>
          <p>Search movies, TV shows, documentaries and more</p>
          <div className="search-input-wrapper">
            <img src={search_icon} alt="search" className="search-input-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search for a movie or TV show..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button className="search-clear-btn" onClick={() => setQuery("")}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="search-results-area">
        {loading && (
          <div className="search-loading">
            <div className="search-spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="search-no-results">
            <div className="no-results-icon">🔍</div>
            <h2>No results for "{query}"</h2>
            <p>Try different keywords or check your spelling.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="search-placeholder">
            <div className="search-placeholder-icon">🎬</div>
            <h2>Discover something new</h2>
            <p>Start typing to search across thousands of movies and TV shows</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="search-result-count">
              {results.length} result{results.length !== 1 ? "s" : ""} for <strong>"{query}"</strong>
            </p>
            <div className="search-grid">
              {results.map((item) => {
                const { title, year, rating, image } = getDisplayInfo(item);
                const mediaType = item.media_type;
                return (
                  <Link
                    to={`/player/${item.id}?type=${mediaType}`}
                    className="search-card"
                    key={item.id}
                  >
                    <div className="search-card-image">
                      {image ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w342${image}`}
                          alt={title}
                        />
                      ) : (
                        <div className="search-card-no-img">
                          <span>🎬</span>
                        </div>
                      )}
                      <span className={`search-type-badge ${mediaType}`}>
                        {mediaType === "tv" ? "TV Show" : "Movie"}
                      </span>
                    </div>
                    <div className="search-card-info">
                      <p className="search-card-title">{title}</p>
                      <div className="search-card-meta">
                        {year && <span className="search-year">{year}</span>}
                        {rating && (
                          <span className="search-rating">⭐ {rating}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
