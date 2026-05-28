import React from "react";
import "./MyList.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import useMyList from "../../hooks/useMyList";
import { Link } from "react-router-dom";

const MyList = () => {
  const { myList, removeItem } = useMyList();

  return (
    <div className="mylist-page">
      <Navbar />
      <div className="mylist-hero">
        <div className="mylist-hero-content">
          <span className="mylist-badge">My List</span>
          <h1>Your Personal Watchlist</h1>
          <p>{myList.length} title{myList.length !== 1 ? "s" : ""} saved</p>
        </div>
      </div>

      <div className="mylist-content">
        {myList.length === 0 ? (
          <div className="mylist-empty">
            <div className="empty-icon">🎬</div>
            <h2>Your list is empty</h2>
            <p>Add movies and TV shows by hovering over a card and clicking the <strong>+</strong> button.</p>
            <Link to="/" className="browse-btn">Browse Content</Link>
          </div>
        ) : (
          <div className="mylist-grid">
            {myList.map((item) => (
              <div className="mylist-card" key={item.id}>
                <Link to={`/player/${item.id}?type=${item.mediaType}`}>
                  {item.poster ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                      alt={item.title}
                    />
                  ) : (
                    <div className="mylist-no-image">
                      <span>{item.title}</span>
                    </div>
                  )}
                </Link>
                <div className="mylist-card-info">
                  <span className="mylist-card-title">{item.title}</span>
                  <span className="mylist-card-type">{item.mediaType === "tv" ? "TV Show" : "Movie"}</span>
                </div>
                <button
                  className="mylist-remove-btn"
                  onClick={() => removeItem(item.id)}
                  title="Remove from My List"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyList;
