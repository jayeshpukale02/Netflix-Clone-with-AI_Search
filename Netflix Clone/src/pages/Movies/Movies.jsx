import React from "react";
import "./Movies.css";
import Navbar from "../../components/Navbar/Navbar";
import Titlecards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const Movies = () => {
  return (
    <div className="movies-page">
      <Navbar />
      <div className="movies-hero">
        <div className="movies-hero-content">
          <span className="movies-badge">Movies</span>
          <h1>Blockbusters, Indies & Everything Between</h1>
          <p>From Hollywood's finest to hidden gems — your next favourite film is here.</p>
        </div>
      </div>
      <div className="movies-content">
        <Titlecards title={"Now Playing"} category={"now_playing"} mediaType="movie" />
        <Titlecards title={"Popular Movies"} category={"popular"} mediaType="movie" />
        <Titlecards title={"Top Rated All Time"} category={"top_rated"} mediaType="movie" />
        <Titlecards title={"Coming Soon"} category={"upcoming"} mediaType="movie" />
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
