import React, { useState, useRef, useEffect } from "react";
import "./AISearch.css";
import Navbar from "../../components/Navbar/Navbar";
import { getAIMovieSuggestions } from "../../gemini";
import { Link } from "react-router-dom";

const TMDB_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjNlN2Q0NWJmODhlMGIwNDNkY2NkZDA1MzZjYWUzNiIsIm5iZiI6MTc1MDkzOTQwNC41NDMsInN1YiI6IjY4NWQzNzBjMjIwNzY0ZjhkYTE1NTVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dbK6BOyNMoxw2KSyyZPq3j5u_mhbMD42dABjvpm3QFc";

// Fetch TMDB data for a suggested title
const fetchTMDBCard = async (title, year, type) => {
  try {
    const mediaType = type === "tv" ? "tv" : "movie";
    const res = await fetch(
      `https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(title)}&language=en-US&page=1`,
      { headers: { accept: "application/json", Authorization: TMDB_TOKEN } }
    );
    const data = await res.json();
    const results = data.results || [];
    // Try to match by year
    const match =
      results.find((r) => {
        const releaseYear = (r.release_date || r.first_air_date || "").slice(0, 4);
        return releaseYear === year;
      }) || results[0];
    return match ? { ...match, mediaType } : null;
  } catch {
    return null;
  }
};

const AISearch = () => {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [particles, setParticles] = useState([]);

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // Generate random particles for background animation
  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 4,
    }));
    setParticles(p);
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setError("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      setTranscript(interim || final);
      if (final) {
        setPrompt((prev) => (prev ? prev + " " + final : final));
        setTranscript("");
      }
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error !== "aborted") {
        setError("Voice error: " + e.error + ". Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript("");
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleSearch = async () => {
    const searchPrompt = prompt.trim();
    if (!searchPrompt) return;

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);

    try {
      const suggestions = await getAIMovieSuggestions(searchPrompt);

      if (!suggestions || suggestions.length === 0) {
        setError("No suggestions returned. Try a different description.");
        setLoading(false);
        return;
      }

      // Fetch TMDB data for each suggestion in parallel
      const cards = await Promise.all(
        suggestions.map(async (s) => {
          const tmdb = await fetchTMDBCard(s.title, s.year, s.type);
          return { ...s, tmdb };
        })
      );

      setResults(cards);
    } catch (err) {
      console.error("[AISearch] Error:", err);
      const msg = err.message || "";
      if (msg.startsWith("QUOTA_EXCEEDED:")) {
        setError(
          "⏳ API quota reached — your Gemini free tier limit was hit. " +
          "Wait 1 minute and try again, or visit aistudio.google.com to check your usage."
        );
      } else if (msg.startsWith("API_KEY_INVALID:")) {
        setError(
          "🔑 Invalid API key — please make sure your Gemini API key is active at aistudio.google.com."
        );
      } else if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch")) {
        setError("🌐 Network error — please check your internet connection and try again.");
      } else {
        setError(`❌ ${msg || "Something went wrong. Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const examplePrompts = [
    "A thriller that keeps me on the edge of my seat",
    "Something funny to watch with my family",
    "Dark and twisted psychological drama",
    "Feel-good romance with a happy ending",
    "Epic fantasy world with dragons and magic",
  ];

  return (
    <div className="ai-search-page">
      <Navbar />

      {/* Animated background */}
      <div className="ai-bg">
        <div className="ai-bg-gradient"></div>
        {particles.map((p) => (
          <div
            key={p.id}
            className="ai-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="ai-search-container">
        {/* Header */}
        <div className="ai-search-header">
          <div className="ai-badge">
            <span className="ai-badge-sparkle">✨</span>
            AI Powered
          </div>
          <h1 className="ai-search-title">
            What are you in the
            <span className="ai-title-highlight"> mood</span> for?
          </h1>
          <p className="ai-search-subtitle">
            Describe your vibe, genre, feeling, or a story — our AI finds the perfect match
          </p>
        </div>

        {/* Search Box */}
        <div className="ai-search-box">
          <div className={`ai-textarea-wrapper ${isListening ? "listening" : ""}`}>
            <textarea
              ref={textareaRef}
              className="ai-textarea"
              placeholder={
                isListening
                  ? "🎙️ Listening..."
                  : "e.g. 'A dark sci-fi thriller about AI taking over the world' or 'Something heartwarming for a rainy evening'..."
              }
              value={isListening && transcript ? transcript : prompt}
              onChange={(e) => !isListening && setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              readOnly={isListening}
            />
            {isListening && (
              <div className="ai-listening-indicator">
                <div className="ai-sound-wave">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="ai-sound-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="ai-search-actions">
            {/* Voice Button */}
            <button
              className={`ai-mic-btn ${isListening ? "mic-active" : ""}`}
              onClick={isListening ? stopListening : startListening}
              title={isListening ? "Stop listening" : "Speak your mood"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isListening ? (
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                ) : (
                  <>
                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </>
                )}
              </svg>
              {isListening ? "Stop" : "Voice"}
            </button>

            {/* Search Button */}
            <button
              className="ai-search-btn"
              onClick={handleSearch}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <span className="ai-btn-loading">
                  <span className="ai-btn-spinner"></span>
                  Finding...
                </span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Search with AI
                </>
              )}
            </button>
          </div>

          {error && <p className="ai-error">{error}</p>}
        </div>

        {/* Example Prompts */}
        {!hasSearched && (
          <div className="ai-examples">
            <p className="ai-examples-label">Try asking:</p>
            <div className="ai-examples-list">
              {examplePrompts.map((ex, i) => (
                <button
                  key={i}
                  className="ai-example-chip"
                  onClick={() => setPrompt(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="ai-loading">
            <div className="ai-loading-orb"></div>
            <p>AI is curating your perfect watchlist...</p>
            <p className="ai-loading-sub">Analyzing mood, genres, and themes</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="ai-results">
            <div className="ai-results-header">
              <h2>
                <span className="ai-results-count">{results.length}</span> picks crafted just for you
              </h2>
              <p className="ai-results-prompt">Based on: "{prompt}"</p>
            </div>
            <div className="ai-results-grid">
              {results.map((item, idx) => {
                const tmdb = item.tmdb;
                const poster = tmdb?.poster_path || tmdb?.backdrop_path;
                const linkId = tmdb?.id;
                const mediaType = item.type === "tv" ? "tv" : "movie";
                const rating = tmdb?.vote_average?.toFixed(1);

                return (
                  <div className="ai-result-card" key={idx}>
                    <div className="ai-result-card-inner">
                      {/* Poster */}
                      <div className="ai-card-image">
                        {poster ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w342${poster}`}
                            alt={item.title}
                          />
                        ) : (
                          <div className="ai-card-no-img">
                            <span>🎬</span>
                            <p>{item.title}</p>
                          </div>
                        )}
                        <span className={`ai-type-badge ${mediaType}`}>
                          {mediaType === "tv" ? "TV" : "Movie"}
                        </span>
                        {rating && (
                          <span className="ai-rating-badge">⭐ {rating}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="ai-card-info">
                        <h3 className="ai-card-title">{item.title}</h3>
                        {item.year && <span className="ai-card-year">{item.year}</span>}
                        <p className="ai-card-reason">💡 {item.reason}</p>
                      </div>

                      {/* Play Button Overlay */}
                      {linkId && (
                        <Link
                          to={`/player/${linkId}?type=${mediaType}`}
                          className="ai-card-play-btn"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Watch
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="ai-no-results">
            <span>🤔</span>
            <h2>Hmm, couldn't find matches</h2>
            <p>Try rephrasing your description or be more specific about your mood or genre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISearch;
