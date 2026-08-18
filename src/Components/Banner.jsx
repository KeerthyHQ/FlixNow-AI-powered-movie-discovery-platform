import React, { useContext } from "react";
import { MovieContext } from "./Moviecontext.jsx";
import { useNavigate } from "react-router-dom";

function Banner({ movie }) {
  const navigate = useNavigate();

  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useContext(MovieContext);

  if (!movie) return null;

  const isInWatchlist = watchlist.some(
    (m) => m.id === movie.id
  );

  return (
    <div
      className="relative h-[85vh] w-full bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent"></div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      {/* Content */}
      <div className="relative max-w-2xl px-8 md:px-16 mt-20">

        <p className="text-red-500 font-semibold tracking-widest mb-3">
          TRENDING NOW
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          {movie.title}
        </h1>

        <p className="text-gray-200 text-base mb-8 leading-relaxed line-clamp-4">
          {movie.overview || "No description available."}
        </p>

        <div className="mt-6 flex space-x-4">

          {/* Watch Now */}
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold shadow-md transition"
          >
            <i className="fa-solid fa-play mr-2"></i>
            Watch Now
          </button>

          {/* Watchlist */}
          {isInWatchlist ? (
            <button
              onClick={() => removeFromWatchlist(movie)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold shadow-md transition"
            >
              <i className="fa-solid fa-check mr-2"></i>
              Added
            </button>
          ) : (
            <button
              onClick={() => addToWatchlist(movie)}
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-semibold shadow-md transition"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add to Watchlist
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default Banner;