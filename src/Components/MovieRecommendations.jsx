import React, { useContext, useState } from "react";
import { MovieContext } from "./Moviecontext.jsx";
import { getMovieRecommendations } from "../services/gemini.js";
import { searchMovies } from "../services/tmdb.js";
import Moviecard from "./Moviecard.jsx";

function MovieRecommendations() {

  const { watchlist } = useContext(MovieContext);

  const [movies, setMovies] = useState([]);
  const [tasteSummary, setTasteSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetRecommendations = async () => {

    if (watchlist.length === 0) {
      setError(
        "Add some movies to your watchlist first."
      );
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);
    setTasteSummary("");

    try {

      // 1. Ask Gemini to understand the user's taste
      const aiResult =
      await getMovieRecommendations(watchlist);

      console.log(
        "Gemini Recommendation Result:",
        aiResult
      );

      setTasteSummary(
        aiResult.tasteSummary || ""
      );

      // 2. Search Gemini's recommendations in TMDB
      const moviePromises = aiResult.movies.map(
        async (recommendation) => {

          const data = await searchMovies(
            recommendation.title
          );

          const movie = data.results?.[0];

          if (!movie) {
            return null;
          }

          return {
            ...movie,
            aiReason: recommendation.reason,
            aiConfidence: recommendation.confidence,
          };
        }
      );

      // 3. Wait for all TMDB requests
      const results =
        await Promise.all(moviePromises);

      // 4. Remove failed searches
      setMovies(
        results.filter(Boolean)
      );

    } catch (err) {

      console.error(
        "Recommendation failed:",
        err
      );

      setError(
        "Unable to generate recommendations. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white px-6 py-10">

      {/* HEADER */}

      <div className="text-center mb-10">

        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          🤖 AI Movie Recommendations
        </h1>

        <p className="text-gray-400 text-lg">
          Let AI understand your movie taste.
        </p>

      </div>


      {/* WATCHLIST INFORMATION */}

      <div className="max-w-2xl mx-auto bg-[#1f1f1f] border border-gray-700 rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4 text-center">
          Your Watchlist
        </h2>

        {watchlist.length === 0 ? (

          <p className="text-gray-400 text-center">
            Your watchlist is empty.
          </p>

        ) : (

          <div className="flex flex-wrap justify-center gap-2">

            {watchlist.map((movie) => (

              <span
                key={movie.id}
                className="bg-gray-800 px-3 py-2 rounded-full text-sm"
              >
                {movie.title}
              </span>

            ))}

          </div>

        )}

      </div>


      {/* RECOMMEND BUTTON */}

      <div className="flex justify-center mt-8">

        <button
          onClick={handleGetRecommendations}
          disabled={
            loading ||
            watchlist.length === 0
          }
          className="
            bg-red-600
            hover:bg-red-700
            disabled:bg-gray-700
            disabled:cursor-not-allowed
            px-7 py-3
            rounded-lg
            font-semibold
            transition
          "
        >

          {loading
            ? "🤖 Finding Movies..."
            : "✨ Recommend Movies"}

        </button>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="text-center mt-10">

          <div
            className="
              animate-spin
              inline-block
              w-10 h-10
              border-4
              border-red-600
              border-t-transparent
              rounded-full
            "
          ></div>

          <p className="text-gray-400 mt-4">
            AI is analyzing your taste...
          </p>

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="max-w-md mx-auto mt-8">

          <div className="
            bg-red-900/30
            border border-red-600
            rounded-xl
            p-5
            text-center
          ">

            <p className="text-red-400">
              {error}
            </p>

          </div>

        </div>

      )}


      {/* AI TASTE SUMMARY */}

      {tasteSummary && !loading && (

        <div className="max-w-3xl mx-auto mt-10">

          <div className="
            bg-[#1f1f1f]
            border border-gray-700
            rounded-xl
            p-6
            text-center
          ">

            <h2 className="text-xl font-bold mb-3">
              🧠 Your Movie Taste
            </h2>

            <p className="text-gray-300 leading-relaxed">
              {tasteSummary}
            </p>

          </div>

        </div>

      )}


      {/* RECOMMENDATIONS */}

      {movies.length > 0 && !loading && (

        <div className="mt-12">

          <h2 className="text-3xl font-bold text-center mb-8">
            🎬 Recommended For You
          </h2>

          <div className="
            flex
            flex-wrap
            justify-center
            gap-8
          ">

            {movies.map((movie) => (

              <div
                key={movie.id}
                className="w-40"
              >

                <Moviecard
                  movieobj={movie}
                />

                <div className="mt-3">

                  <p className="
                    text-xs
                    text-gray-400
                    leading-relaxed
                  ">
                    🤖 {movie.aiReason}
                  </p>

                  <p className="
                    text-xs
                    text-green-400
                    mt-2
                    font-semibold
                  ">
                    AI Match: {movie.aiConfidence}%
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default MovieRecommendations;