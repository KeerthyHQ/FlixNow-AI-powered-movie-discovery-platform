import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

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