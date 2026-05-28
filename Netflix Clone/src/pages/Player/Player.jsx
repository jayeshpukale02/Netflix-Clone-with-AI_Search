import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const TMDB_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjNlN2Q0NWJmODhlMGIwNDNkY2NkZDA1MzZjYWUzNiIsIm5iZiI6MTc1MDkzOTQwNC41NDMsInN1YiI6IjY4NWQzNzBjMjIwNzY0ZjhkYTE1NTVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dbK6BOyNMoxw2KSyyZPq3j5u_mhbMD42dABjvpm3QFc";

const Player = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mediaType = searchParams.get("type") || "movie";

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
  });

  useEffect(() => {
    const endpoint =
      mediaType === "tv"
        ? `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
        : `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;

    fetch(endpoint, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // Prefer official trailer, then teaser, else first result
        const videos = res.results || [];
        const trailer =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos.find((v) => v.site === "YouTube") ||
          videos[0];
        if (trailer) setApiData(trailer);
      })
      .catch((err) => console.error(err));
  }, [id, mediaType]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back"
        onClick={() => navigate(-1)}
      />
      {apiData.key ? (
        <iframe
          width="90%"
          height="90%"
          src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1`}
          title="trailer"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="player-no-video">
          <p>🎬 No trailer available for this title.</p>
        </div>
      )}
      <div className="player-info">
        <p>{apiData.published_at ? apiData.published_at.slice(0, 10) : ""}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  );
};

export default Player;
