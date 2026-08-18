import React, { useState, useEffect } from "react";
import Banner from "./Banner";
import Moviecard from "./Moviecard";
import Pagination from "./Pagination";

import {
  getNowPlayingMovies,
  getTrendingMovies,
} from "../services/tmdb";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [bannerMovie, setBannerMovie] = useState(null);

  const [pageNo, setPageNo] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Now Playing Movies
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);

      try {
        
        const data = await getNowPlayingMovies(pageNo);
        setMovies(data.results || []);
        setMaxPage(data.total_pages || 1);

      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [pageNo]);

  // Fetch Trending Movie for Banner
  useEffect(() => {
    async function fetchBannerMovie() {
      try {
        const data = await getTrendingMovies();

        const randomMovie =
          data.results[
            Math.floor(Math.random() * data.results.length)
          ];

        setBannerMovie(randomMovie);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBannerMovie();
  }, []);

  const previous = () => {
    if (pageNo > 1) {
      setPageNo(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const next = () => {
    if (pageNo < maxPage) {
      setPageNo(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white text-2xl mt-20">
        Loading Movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl mt-20">
        {error}
      </div>
    );
  }

  return (
    <div>
      <Banner movie={bannerMovie} />

      <h1 className="text-3xl font-bold text-center text-white my-6">
        Now Playing Movies
      </h1>

      <div className="flex flex-wrap justify-center gap-6 px-8 pb-10">
        {movies.map(movie => (
          <Moviecard
            key={movie.id}
            movieobj={movie}
          />
        ))}
      </div>

      <Pagination
        previous={previous}
        next={next}
        pageno={pageNo}
      />
    </div>
  );
}

export default Movies;