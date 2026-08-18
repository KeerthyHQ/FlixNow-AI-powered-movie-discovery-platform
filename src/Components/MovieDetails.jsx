import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/tmdb";

function MovieDetails() {

  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
  async function fetchMovie() {
    try {

      const data = await getMovieDetails(id);
      setMovie(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  }

  fetchMovie();

}, [id]);

if (loading) {
  return (
    <div className="text-white text-center mt-20">
      Loading...
    </div>
  );
}

  return (
    <div className="text-white text-center mt-24">
      <h1 className="text-4xl text-white font-bold">
        Movie Details
      </h1>
    </div>
  );
}

export default MovieDetails;