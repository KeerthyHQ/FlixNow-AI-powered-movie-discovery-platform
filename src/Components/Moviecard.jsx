import React from "react";
import { useContext } from "react";
import { MovieContext } from "./Moviecontext.jsx";
import { useNavigate } from "react-router-dom";

function Moviecard({ movieobj }) {
  
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, watchlist } =
    useContext(MovieContext);

  // Check if movie exists in watchlist
  const isInWatchlist = watchlist.some((movie) => movie.id === movieobj.id);

  return (
    <div className="m-4">
      <div
        onClick={() => navigate(`/movie/${movieobj.id}`)}
        className="relative w-40 h-60 rounded-lg overflow-hidden 
        bg-cover bg-center cursor-pointer
        transform transition duration-300 hover:scale-110 hover:z-20 shadow-lg"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${movieobj.poster_path})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/* Add / Remove Button */}
        {isInWatchlist ? (
          <div
            className="absolute top-2 right-2 z-20 bg-green-600 rounded-full p-2 cursor-pointer hover:bg-green-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              removeFromWatchlist(movieobj);
            }}
          >
            <i className="fa-solid fa-check text-white"></i>
          </div>
        ) : (
          <div
            className="absolute top-2 right-2 z-20 bg-red-600 rounded-full p-2 cursor-pointer hover:bg-red-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              addToWatchlist(movieobj);
            }}
          >
            <i className="fa-solid fa-plus text-white"></i>
          </div>
        )}

        {/* Movie Title */}
        <div className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-white">
          {movieobj.title}
        </div>
      </div>
    </div>
  );
}

export default Moviecard;
