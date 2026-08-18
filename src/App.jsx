import Navbar from "./Components/Navbar.jsx";
import Movies from "./Components/Movies.jsx";
import Watchlist from "./Components/Watchlist.jsx";
import MovieDetails from "./Components/MovieDetails.jsx";
import { MovieContext } from "./Components/Moviecontext.jsx";

import MoodSelector from "./Components/MoodSelector.jsx";
import MovieRecommendations from "./Components/MovieRecommendations.jsx";
import SmartSearch from "./Components/SmartSearch.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");

    return saved ? JSON.parse(saved) : [];
  });

  // add movie to watchlist
  function addToWatchlist(movie) {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev;
      }

      return [...prev, movie];
    });
  }

  // remove movie from watchlist
  function removeFromWatchlist(movie) {
    setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
  }

  // Sync watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <BrowserRouter>
      <MovieContext.Provider
        value={{ watchlist, addToWatchlist, removeFromWatchlist, setWatchlist }}
      >
        <div className="bg-[#141414] min-h-screen text-white">
          <Navbar />

          <div className="pt-20">
            <Routes>

              <Route path="/smart-search" element={<SmartSearch />}/>
              <Route path="/" element={<Movies />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/mood" element={<MoodSelector />} />
              <Route path="/recommendations" element={<MovieRecommendations />}  />


            </Routes>
          </div>
        </div>
      </MovieContext.Provider>
    </BrowserRouter>
  );
}

export default App;
