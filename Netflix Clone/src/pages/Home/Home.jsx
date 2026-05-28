import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import hero_banner from "../../assets/hero_banner.jpg";
import hero_title from "../../assets/hero_title.png";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import Titlecards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <img src={hero_banner} alt="" className="banner-img" />
        <div className="hero-caption">
          <img src={hero_title} alt="" className="caption-img" />
          <p>
            Discovering his ties to the ancient order, a young man living in
            modern Istanbul embarks on a quest to save the city from an immortal
            enemy
          </p>
          <div className="hero-btns">
            <button className="btn">
              <img src={play_icon} alt="" />
              Play
            </button>
            <button className="btn dark-btn">
              <img src={info_icon} alt="" />
              More Info
            </button>
          </div>
          <Titlecards title={"Now Playing"} category={"now_playing"} mediaType="movie" />
        </div>
      </div>
      <div className="more-cards">
        {/* Movie Rows */}
        <Titlecards title={"Blockbuster Movies"} category={"top_rated"} mediaType="movie" />
        <Titlecards title={"Only on Netflix"} category={"popular"} mediaType="movie" />
        <Titlecards title={"Upcoming Movies"} category={"upcoming"} mediaType="movie" />

        {/* TV Show Rows */}
        <Titlecards title={"Trending TV Shows"} category={"popular"} mediaType="tv" />
        <Titlecards title={"Top Rated Series"} category={"top_rated"} mediaType="tv" />
        <Titlecards title={"Airing Today"} category={"airing_today"} mediaType="tv" />
        <Titlecards title={"On The Air"} category={"on_the_air"} mediaType="tv" />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
