import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import { Link } from "react-router-dom";
import useMyList from "../../hooks/useMyList";

const Titlecards = ({ title, category, mediaType = "movie" }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();
  const { addItem, removeItem, isInList } = useMyList();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjNlN2Q0NWJmODhlMGIwNDNkY2NkZDA1MzZjYWUzNiIsIm5iZiI6MTc1MDkzOTQwNC41NDMsInN1YiI6IjY4NWQzNzBjMjIwNzY0ZjhkYTE1NTVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dbK6BOyNMoxw2KSyyZPq3j5u_mhbMD42dABjvpm3QFc",
    },
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const endpoint =
      mediaType === "tv"
        ? `https://api.themoviedb.org/3/tv/${category ? category : "popular"}?language=en-US&page=1`
        : `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`;

    fetch(endpoint, options)
      .then((res) => res.json())
      .then((res) => setApiData(res.results || []))
      .catch((err) => console.error(err));

    const ref = cardsRef.current;
    ref.addEventListener("wheel", handleWheel, { passive: false });
    return () => ref.removeEventListener("wheel", handleWheel);
  }, [category, mediaType]);

  const handleMyListToggle = (e, card) => {
    e.preventDefault();
    e.stopPropagation();
    const displayTitle = card.original_title || card.original_name || card.title || card.name;
    const imagePath = card.backdrop_path || card.poster_path;
    const item = {
      id: card.id,
      title: displayTitle,
      poster: imagePath,
      mediaType,
    };
    if (isInList(card.id)) {
      removeItem(card.id);
    } else {
      addItem(item);
    }
  };

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          const displayTitle = card.original_title || card.original_name || card.title || card.name;
          const imagePath = card.backdrop_path || card.poster_path;
          const inList = isInList(card.id);
          return (
            <Link
              to={`/player/${card.id}?type=${mediaType}`}
              className="card"
              key={index}
            >
              {imagePath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${imagePath}`}
                  alt={displayTitle}
                />
              ) : (
                <div className="card-no-image">
                  <span>{displayTitle}</span>
                </div>
              )}
              <p>{displayTitle}</p>
              <button
                className={`my-list-btn ${inList ? "in-list" : ""}`}
                onClick={(e) => handleMyListToggle(e, card)}
                title={inList ? "Remove from My List" : "Add to My List"}
              >
                {inList ? "✓" : "+"}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Titlecards;
