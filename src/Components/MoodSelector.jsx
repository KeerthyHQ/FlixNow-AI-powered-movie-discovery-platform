import React, { useState } from "react";
import { moods } from "../utility/moods.js";
import { getMoodRecommendations } from "../services/gemini.js";
import { searchMovies } from "../services/tmdb.js";
import Moviecard from "./Moviecard.jsx";

function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]);
  const [moodSummary, setMoodSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMoodClick = async (mood) => {
    setSelectedMood(mood);
    setMovies([]);
    setMoodSummary("");
    setError("");
    setLoading(true);

    try {
      // STEP 1: Ask Gemini for movie recommendations
      const aiResult = await getMoodRecommendations(mood);

      console.log("Gemini Mood Result:", aiResult);

      setMoodSummary(aiResult.moodSummary || "");

      // STEP 2: Search each recommended movie in TMDB
      const moviePromises = aiResult.movies.map(
        async (recommendation) => {
          const data = await searchMovies(
            recommendation.title
          );

          const movie = data.results?.[0];

          if (!movie) {
            return null;
          }

          // Combine TMDB movie data + Gemini information
          return {
            ...movie,
            aiReason: recommendation.reason,
            aiConfidence: recommendation.confidence,
          };
        }
      );

      // STEP 3: Wait for all TMDB requests
      const results = await Promise.all(moviePromises);

      // STEP 4: Remove movies that TMDB couldn't find
      setMovies(results.filter(Boolean));

    } catch (err) {
      console.error("Mood recommendation error:", err);

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
          🎭 What's Your Mood?
        </h1>

        <p className="text-gray-400 text-lg">
          Tell FlixNow how you're feeling and let AI
          find your perfect movies.
        </p>

      </div>


      {/* MOOD BUTTONS */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">

        {moods.map((mood) => (

          <button
            key={mood.id}
            onClick={() => handleMoodClick(mood)}
            disabled={loading}
            className={`
              p-5 rounded-xl
              border border-gray-700
              transition duration-300
              hover:scale-105
              text-center

              ${
                selectedMood?.id === mood.id
                  ? `${mood.color} text-white`
                  : "bg-[#222] hover:bg-[#333]"
              }

              ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >

            <div className="text-4xl mb-3">
              {mood.emoji}
            </div>

            <h2 className="font-bold text-lg">
              {mood.name}
            </h2>

            <p className="text-sm text-gray-300 mt-2">
              {mood.description}
            </p>

          </button>

        ))}

      </div>


      {/* LOADING */}
      {loading && (

        <div className="text-center mt-12">

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

          <p className="mt-4 text-gray-300">
            🤖 AI is finding movies for your mood...
          </p>

        </div>

      )}


      {/* ERROR */}
      {error && (

        <div className="max-w-md mx-auto mt-10">

          <div className="
            bg-red-900/30
            border border-red-600
            rounded-xl
            p-5
            text-center
          ">

            <p className="text-red-400 font-semibold mb-3">
              Something went wrong
            </p>

            <p className="text-gray-300 text-sm mb-4">
              {error}
            </p>

            <button
              onClick={() =>
                selectedMood &&
                handleMoodClick(selectedMood)
              }
              className="
                bg-red-600
                hover:bg-red-700
                px-5 py-2
                rounded-lg
                transition
              "
            >
              Try Again
            </button>

          </div>

        </div>

      )}


      {/* AI MOOD SUMMARY */}
      {moodSummary && !loading && (

        <div className="max-w-3xl mx-auto mt-10">

          <div className="
            bg-[#1f1f1f]
            border border-gray-700
            rounded-xl
            p-6
            text-center
          ">

            <h2 className="text-xl font-bold mb-3">
              🤖 AI Mood Analysis
            </h2>

            <p className="text-gray-300 leading-relaxed">
              {moodSummary}
            </p>

          </div>

        </div>

      )}


      {/* MOVIE RESULTS */}
      {movies.length > 0 && !loading && (

        <div className="mt-12">

          <h2 className="text-3xl font-bold text-center mb-8">
           🎬 Movies That Match Your Vibe  {selectedMood?.emoji} 
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

                {/* Your existing MovieCard */}
                <Moviecard
                  movieobj={movie}
                />

                {/* AI reason */}
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


      {/* EMPTY STATE */}
      {!selectedMood &&
        !loading &&
        !error && (

          <div className="text-center mt-16">

            <div className="text-6xl mb-5">
              🎬
            </div>

            <h3 className="text-xl font-semibold">
              Choose your mood
            </h3>

            <p className="text-gray-500 mt-2">
              Select a mood above to discover
              AI-powered movie recommendations.
            </p>

          </div>

        )}

    </div>
  );
}

export default MoodSelector;