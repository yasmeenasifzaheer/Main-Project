import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Movies.css";

function Movies() {
  const location = useLocation();

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Fetch movies (same API Home uses)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/movies"
        );
        setMovies(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  // Filter based on navbar query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const filter = params.get("filter") || "all";

    let result = movies;

    // Category filtering (uses same boolean fields as Home)
    if (filter !== "all") {
      result = result.filter((movie) => movie[filter]);
    }

    // Search filtering
    if (search) {
      result = result.filter((movie) =>
        movie.title
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredMovies(result);
  }, [location.search, movies]);

 return (
  <div className="movies-page">
    <h2 className="movies-title">Movie Results</h2>

    <div className="movie-grid">
      {filteredMovies.map((movie) => (
        <Link
          key={movie._id}
          to={`/movie/${movie._id}`}
          className="movie-card"
        >
          <img src={movie.poster} alt={movie.title} />
          <h4>{movie.title}</h4>
        </Link>
      ))}
    </div>
  </div>
);
}

export default Movies;