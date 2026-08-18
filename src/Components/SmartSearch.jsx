import React, { useState } from "react";

import {parseSmartSearch } from "../services/gemini.js";
import {discoverMovies} from "../services/tmdb.js";

import Moviecard from "./Moviecard.jsx";

function SmartSearch() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);
    setFilters(null);

    try {

      // Gemini understands the user's query

      const parsedFilters = await parseSmartSearch(query);

      console.log(
        "Smart Search Filters:",
        parsedFilters
      );

      setFilters(parsedFilters);


      // Send structured filters to TMDB

      const data = await discoverMovies(parsedFilters);

      console.log(
        "Smart Search TMDB Results:",
        data
      );


      //Save movie results

      setMovies(
        data.results || []
      );

    } catch (error) {

      console.error(
        "Smart Search Error:",
        error
      );

      setError(
        "Unable to understand your search. Please try again."
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
          🔎 Smart Search
        </h1>

        <p className="text-gray-400">
          Search movies naturally. Let AI understand what you mean.
        </p>

      </div>


      {/* SEARCH BAR */}

      <div className="max-w-3xl mx-auto flex gap-3">

        <input
          type="text"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Try: funny movies under 2 hours"
          className="
            flex-1
            px-5 py-4
            rounded-xl
            bg-[#222]
            border border-gray-700
            text-white
            outline-none
            focus:border-red-600
          "
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="
            bg-red-600
            hover:bg-red-700
            px-6
            rounded-xl
            font-semibold
            transition
            disabled:bg-gray-700
          "
        >
          {loading ? "Searching..." : "Search"}
        </button>

      </div>


      {/* EXAMPLES */}

      <div className="max-w-3xl mx-auto mt-5">

        <p className="text-gray-500 text-sm mb-3">
          Try:
        </p>

        <div className="flex flex-wrap gap-2">

          {[
            "funny movies under 2 hours",
            "highly rated sci-fi movies",
            "romantic movies from the last 5 years",
            "dark horror movies",
          ].map((example) => (

            <button
              key={example}
              onClick={() => {
                setQuery(example);
              }}
              className="
                bg-[#222]
                hover:bg-red-600
                border border-gray-700
                px-3 py-2
                rounded-full
                text-sm
                transition
              "
            >
              {example}
            </button>

          ))}

        </div>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="text-center mt-12">

          <div className="
            animate-spin
            inline-block
            w-10 h-10
            border-4
            border-red-600
            border-t-transparent
            rounded-full
          "></div>

          <p className="text-gray-400 mt-4">
            🤖 AI is Processing your search...
          </p>

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="
          max-w-md
          mx-auto
          mt-8
          text-center
          text-red-400
        ">
          {error}
        </div>

      )}


      {/* INTERPRETED SEARCH */}

      {filters && !loading && (

        <div className="
          max-w-3xl
          mx-auto
          mt-10
          bg-[#1f1f1f]
          border border-gray-700
          rounded-xl
          p-5
        ">

          <h2 className="font-bold text-lg mb-3">
            🤖 AI Smart Search Results 
          </h2>

          <div className="flex flex-wrap gap-2">

            {filters.genres?.map((genre) => (

              <span
                key={genre}
                className="
                  bg-red-600/20
                  text-red-400
                  px-3 py-1
                  rounded-full
                  text-sm
                "
              >
                {genre}
              </span>

            ))}

            {filters.minRating && (
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                ⭐ {filters.minRating}+
              </span>
            )}

            {filters.maxRuntime && (
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                ⏱️ Under {filters.maxRuntime} min
              </span>
            )}

          </div>

        </div>

      )}


      {/* RESULTS */}

      {movies.length > 0 && !loading && (

        <div className="mt-12">

          <h2 className="text-3xl font-bold text-center mb-8">
            🎬 Search Results
          </h2>

          <div className="
            flex
            flex-wrap
            justify-center
            gap-8
          ">

            {movies.map((movie) => (

              <Moviecard
                key={movie.id}
                movieobj={movie}
              />

            ))}

          </div>

        </div>

      )}


      {/* NO RESULTS */}

      {!loading &&
        filters &&
        movies.length === 0 && (

          <div className="text-center mt-12">

            <p className="text-gray-400">
              No movies matched your search.
            </p>

          </div>

        )}

    </div>
  );
}

export default SmartSearch;