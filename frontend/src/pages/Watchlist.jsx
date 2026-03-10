import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Watchlist.css";

function Watchlist() {

  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(list);
  }, []);

  return (
    <div className="page-container">
      <h2>🔖 My Watchlist</h2>

      <div className="movie-grid">
        {watchlist.map((movie) => (
          <Link key={movie._id} to={`/movie/${movie._id}`}>
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;