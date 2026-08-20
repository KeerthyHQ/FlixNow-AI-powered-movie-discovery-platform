import React, { useEffect, useState, useContext, useMemo } from "react";
import { genreids } from "../utility/genreid.js";
import { MovieContext } from "./Moviecontext.jsx";
import { useNavigate } from "react-router-dom";

function Watchlist() {
  const { watchlist, removeFromWatchlist, setWatchlist } =
    useContext(MovieContext);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [currentGenre, setCurrentGenre] = useState("All Genres");
  function getMovieGenre(movie) {
    if (movie.genre_ids?.length > 0) {
      return genreids[movie.genre_ids[0]];
    }

    if (movie.genres?.length > 0) {
      return movie.genres[0].name;
    }

    return "Unknown";
  }

  function sortByRatingasc() {
    setWatchlist((prev) =>
      [...prev].sort((a, b) => a.vote_average - b.vote_average),
    );
  }

  function sortByRatingdesc() {
    setWatchlist((prev) =>
      [...prev].sort((a, b) => b.vote_average - a.vote_average),
    );
  }

  function sortByPopularityasc() {
    setWatchlist((prev) =>
      [...prev].sort((a, b) => a.popularity - b.popularity),
    );
  }
  function sortByPopularitydesc() {
    setWatchlist((prev) =>
      [...prev].sort((a, b) => b.popularity - a.popularity),
    );
  }

  function filterByGenre(genre) {
    setCurrentGenre(genre);
  }

  const genreList = useMemo(() => {
    return [
      "All Genres",
      ...new Set(watchlist.map((movie) => getMovieGenre(movie))),
    ];
  }, [watchlist]);

  const filteredMovies = useMemo(() => {
    return watchlist
      .filter(
        (movie) =>
          currentGenre === "All Genres" ||
          currentGenre === getMovieGenre(movie),
      )
      .filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase()),
      );
  }, [watchlist, currentGenre, search]);

  return (
    <div>
      {/*genre filter*/}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {genreList.map((genre) => (
          <div
            key={genre}
            onClick={() => filterByGenre(genre)}
            className={
              currentGenre === genre
                ? "px-4 py-2 rounded-full transition bg-red-600 text-white"
                : "px-4 py-2 rounded-full transition bg-gray-800 text-white hover:bg-red-600"
            }
          >
            {genre}
          </div>
        ))}
      </div>

      {/*search title*/}
      <input
        type="text"
        placeholder="Search movies..."
        className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 mb-6 mt-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto bg-[#181818] rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-center">
            {/* Header */}
            <thead className="bg-black/60 text-gray-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Poster</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">
                  <i
                    className="fa-solid fa-arrow-up m-2"
                    onClick={sortByRatingasc}
                  ></i>
                  Rating
                  <i
                    className="fa-solid fa-arrow-down m-2"
                    onClick={sortByRatingdesc}
                  ></i>
                </th>
                <th className="py-4 px-6">
                  <i
                    className="fa-solid fa-arrow-up m-2"
                    onClick={sortByPopularityasc}
                  ></i>
                  Popularity
                  <i
                    className="fa-solid fa-arrow-down m-2"
                    onClick={sortByPopularitydesc}
                  ></i>
                </th>
                <th className="py-4 px-6">Genre</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="text-gray-200">
              {filteredMovies.map((movie) => (
                <tr
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="border-b border-gray-800 hover:bg-white/5 transition duration-300 cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      className="w-16 h-24 object-cover rounded-md"
                      alt="poster"
                    />
                  </td>

                  <td className="py-4 px-6 font-medium">{movie.title}</td>

                  <td className="py-4 px-6 text-yellow-400 font-semibold">
                    ★ {movie.vote_average}
                  </td>

                  <td className="py-4 px-6 text-gray-400">
                    {movie.popularity}
                  </td>

                  <td className="py-4 px-6 text-gray-400">
                    {getMovieGenre(movie)}
                  </td>

                  <td className="py-4 px-6">
                    <button
                      className="px-4 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm transition"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (
                          window.confirm(
                            `Remove "${movie.title}" from watchlist?`,
                          )
                        ) {
                          removeFromWatchlist(movie);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
