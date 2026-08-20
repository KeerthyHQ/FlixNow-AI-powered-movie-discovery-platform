import axios from "axios";
import { genreids } from "../utility/genreid.js";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

//fetch ids for genres
const genreNameToId = Object.entries(genreids).reduce(
  (acc, [id, name]) => {
    acc[name.toLowerCase()] = id;
    return acc;
  },
  {}
);

// Fetch Now Playing Movies
export const getNowPlayingMovies = async (page = 1) => {
  const response = await api.get("/movie/now_playing", {
    params: {
      page,
    },
  });

  return response.data || {};
};

// Fetch Trending Movies
export const getTrendingMovies = async () => {
  const response = await api.get("/trending/movie/day");

  return response.data || {};
};

// Fetch Movie Details
export const getMovieDetails = async (movieId) => {
  const response = await api.get(`/movie/${movieId}`);

  return response.data || {};
};

// Fetch Movie Trailer
export const getMovieVideos = async (movieId) => {
  const response = await api.get(`/movie/${movieId}/videos`);

  return response.data || {};
};

// Fetch Cast
export const getMovieCredits = async (movieId) => {
  const response = await api.get(`/movie/${movieId}/credits`);

  return response.data || {};
};

// Fetch Similar Movies
export const getSimilarMovies = async (movieId) => {
  const response = await api.get(`/movie/${movieId}/similar`);

  return response.data || {};
};

// Search Movies
export const searchMovies = async (query) => {
  const response = await api.get("/search/movie", {
    params: {
      query,
      page: 1,
    },
  });

  return response.data || {};
};

// Discover Movies by smart search filters
export const discoverMovies = async (filters) => {

  const genreIds = filters.genres.map(genre => genreNameToId[genre.toLowerCase()]
    ).filter(Boolean);

  const response = await api.get("/discover/movie", {
    params: {
      sort_by:
        filters.sortBy || "popularity.desc",

      ...(genreIds.length > 0 && {
        with_genres: genreIds.join(","),
      }),

      ...(filters.minRating !== null && {
        "vote_average.gte": filters.minRating,
      }),

      ...(filters.maxRuntime !== null && {
        "with_runtime.lte":
          filters.maxRuntime,
      }),

      ...(filters.minRuntime !== null && {
        "with_runtime.gte":
          filters.minRuntime,
      }),

      ...(filters.releaseYearFrom !== null && {
        "primary_release_date.gte":
          `${filters.releaseYearFrom}-01-01`,
      }),

      ...(filters.releaseYearTo !== null && {
        "primary_release_date.lte":
          `${filters.releaseYearTo}-12-31`,
      }),
    },
  });

  return response.data || {};
};

//get movie review
export const getMovieReviews = async (movieId) => {

  const response = await api.get(
    `/movie/${movieId}/reviews`
  );

  return response.data || {};

};