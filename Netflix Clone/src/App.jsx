import React, { useEffect } from "react";
import Home from "./pages/Home/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../src/pages/Login/Login";
import Player from "./pages/Player/Player";
import TVShows from "./pages/TVShows/TVShows";
import Movies from "./pages/Movies/Movies";
import MyList from "./pages/MyList/MyList";
import Search from "./pages/Search/Search";
import AISearch from "./pages/AISearch/AISearch";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged in");
        // Only redirect to home if currently on login page
        if (window.location.pathname === "/login") {
          navigate("/");
        }
      } else {
        console.log("Logged out");
        navigate("/login");
      }
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/ai-search" element={<AISearch />} />
      </Routes>
    </div>
  );
};

export default App;
