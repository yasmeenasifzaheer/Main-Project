import React, { useEffect, useState } from "react";
import axios from "axios";

const HeroTrailer = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchLatestMovies();
  }, []);

  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === movies.length - 1 ? 0 : prev + 1
      );
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [movies]);

  const fetchLatestMovies = async () => {
    try {
      const res = await axios.get("/api/movies/latest");
      setMovies(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!movies.length) return <h2>Loading...</h2>;

  const currentMovie = movies[currentIndex];

  return (
    <div className="hero-container">
      <iframe
        key={currentMovie._id}
        src={currentMovie.trailer}
        allow="autoplay"
        frameBorder="0"
        className="hero-video"
      />

      <div className="hero-overlay">
        <h1>{currentMovie.title}</h1>
        <p>{currentMovie.description}</p>
      </div>
    </div>
  );
};

export default HeroTrailer;
