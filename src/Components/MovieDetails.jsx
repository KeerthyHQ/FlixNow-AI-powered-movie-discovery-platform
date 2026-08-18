import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
} from "../services/tmdb";
import { MovieContext } from "./Moviecontext.jsx";
import { useNavigate } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();

  const { watchlist, addToWatchlist, removeFromWatchlist } =
    useContext(MovieContext);

  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    async function fetchMovieData() {
      try {
        setLoading(true);
        setError("");

        const movieData = await getMovieDetails(id);
        const videoData = await getMovieVideos(id);
        const creditData = await getMovieCredits(id);
        const similarData = await getSimilarMovies(id);

        /*console.log("Movie Data:", movieData);
        console.log("Video Data:", videoData);
        console.log("Credit Data:", creditData);*/

        setMovie(movieData);
        setVideos(videoData.results || []);
        setCredits(creditData);
        setSimilarMovies(similarData.results || []);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex justify-center items-center">
        <h1 className="text-white text-2xl">Loading movie details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] flex justify-center items-center">
        <h1 className="text-red-500 text-2xl">{error}</h1>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#141414] flex justify-center items-center">
        <h1 className="text-white text-2xl">
          Please Try Again - Movie page not found
        </h1>
      </div>
    );
  }

  const isInWatchlist = watchlist.some((movieObj) => movieObj.id === movie.id);

  const trailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  const directors = credits?.crew?.filter(
    (person) => person.job === "Director",
  );

  const writers = credits?.crew?.filter(
    (person) => person.job === "Writer" || person.job === "Screenplay",
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* HERO SECTION */}
      <div
        className="relative min-h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#141414] to-transparent"></div>

        {/* Movie Content */}
        <div className="relative z-10 flex items-end min-h-[80vh] px-8 md:px-16 pb-16">
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-56 md:w-64 rounded-xl shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {movie.title}
              </h1>

              {/* Movie Meta */}
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-5">
                <span>{movie.release_date}</span>

                <span>⭐ {movie.vote_average?.toFixed(1)}</span>

                {movie.runtime > 0 && (
                  <span>
                    {hours}h {minutes}m
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-700/80 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-8">
                {movie.overview || "No description available."}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Trailer */}
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    <i className="fa-solid fa-play mr-2"></i>
                    Watch Trailer
                  </button>
                )}

                {/* Watchlist */}
                {isInWatchlist ? (
                  <button
                    onClick={() => removeFromWatchlist(movie)}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Added to Watchlist
                  </button>
                ) : (
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add to Watchlist
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAST SECTION */}
      <div className="px-8 md:px-16 py-12">
        <h2 className="text-3xl font-bold mb-6">Cast</h2>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {credits?.cast?.slice(0, 10).map((actor) => (
            <div key={actor.id} className="min-w-[150px]">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  alt={actor.name}
                  className="w-36 h-52 object-cover rounded-lg"
                />
              ) : (
                <div className="w-36 h-52 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <h3 className="font-semibold mt-3">{actor.name}</h3>

              <p className="text-gray-400 text-sm mt-1">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CREW SECTION */}
      <div className="px-8 md:px-16 pb-12">
        <h2 className="text-3xl font-bold mb-6">Crew</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Director */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Director</h3>

            {directors?.length > 0 ? (
              directors.map((person) => (
                <p key={person.id} className="text-gray-400">
                  {person.name}
                </p>
              ))
            ) : (
              <p className="text-gray-500">Not available</p>
            )}
          </div>

          {/* Writers */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Writers</h3>

            {writers?.length > 0 ? (
              writers.slice(0, 5).map((person) => (
                <p key={person.id} className="text-gray-400">
                  {person.name}
                </p>
              ))
            ) : (
              <p className="text-gray-500">Not available</p>
            )}
          </div>
        </div>
      </div>
      {/* SIMILAR MOVIES */}
      <div className="px-8 md:px-16 pb-16">
        <h2 className="text-3xl font-bold mb-6">You May Also Like</h2>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {similarMovies.slice(0, 10).map((similarMovie) => (
            <div
              key={similarMovie.id}
              onClick={() => navigate(`/movie/${similarMovie.id}`)}
              className="min-w-[180px] cursor-pointer group"
            >
              {/* Poster */}
              <div className="overflow-hidden rounded-lg">
                {similarMovie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                    alt={similarMovie.title}
                    className="w-44 h-64 object-cover rounded-lg
              group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-44 h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Movie Title */}
              <h3 className="font-semibold mt-3 truncate">
                {similarMovie.title}
              </h3>

              {/* Rating */}
              <p className="text-yellow-400 text-sm mt-1">
                ⭐ {similarMovie.vote_average?.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTrailer(false);
            }
          }}
        >
          <div className="relative w-full max-w-4xl">
            {/* Close */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-3xl"
            >
              ×
            </button>

            {/* YouTube */}
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={`${movie.title} Trailer`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
