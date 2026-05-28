import React from "react";
import "./TVShows.css";
import Navbar from "../../components/Navbar/Navbar";
import Titlecards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const TVShows = () => {
  return (
    <div className="tvshows-page">
      <Navbar />
      <div className="tvshows-hero">
        <div className="tvshows-hero-content">
          <span className="page-badge">TV Shows</span>
          <h1>Endless Episodes, Unforgettable Stories</h1>
          <p>Binge the world's best series — from gripping dramas to laugh-out-loud comedies.</p>
        </div>
      </div>
      <div className="tvshows-content">
        <Titlecards title={"Popular TV Shows"} category={"popular"} mediaType="tv" />
        <Titlecards title={"Top Rated Series"} category={"top_rated"} mediaType="tv" />
        <Titlecards title={"Trending This Week"} category={"on_the_air"} mediaType="tv" />
        <Titlecards title={"Airing Today"} category={"airing_today"} mediaType="tv" />
      </div>
      <Footer />
    </div>
  );
};

export default TVShows;
