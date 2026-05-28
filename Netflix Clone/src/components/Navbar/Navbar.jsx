import React, { useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { logout } from "../../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY >= 80) {
          navRef.current.classList.add("nav-dark");
        } else {
          navRef.current.classList.remove("nav-dark");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Netflix" />
        </Link>
        <ul>
          <li>
            <Link to="/" className={isActive("/") ? "nav-active" : ""}>Home</Link>
          </li>
          <li>
            <Link to="/tv-shows" className={isActive("/tv-shows") ? "nav-active" : ""}>TV Shows</Link>
          </li>
          <li>
            <Link to="/movies" className={isActive("/movies") ? "nav-active" : ""}>Movies</Link>
          </li>
          <li>
            <Link to="/search" className={isActive("/search") ? "nav-active" : ""}>New &amp; Popular</Link>
          </li>
          <li>
            <Link to="/my-list" className={isActive("/my-list") ? "nav-active" : ""}>My List</Link>
          </li>
          <li>
            <Link to="/ai-search" className={`nav-ai-link ${isActive("/ai-search") ? "nav-active" : ""}`}>
              ✨ AI Search
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <img
          src={search_icon}
          alt="Search"
          className="icons"
          onClick={() => navigate("/search")}
          title="Search"
        />
        <img src={bell_icon} alt="Notifications" className="icons" />
        <div className="navbar-profile">
          <img src={profile_img} alt="Profile" className="profile" />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={() => logout()}>Sign out of Netflix</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
