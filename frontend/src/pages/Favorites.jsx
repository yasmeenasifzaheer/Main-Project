import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css";

function Favorites() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  return (
    <div className="page-container">
      <h2>❤️ Favorite Movies</h2>

      <div className="movie-grid">
        {favorites.map((movie) => (
          <Link key={movie._id} to={`/movie/${movie._id}`}>
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Favorites;