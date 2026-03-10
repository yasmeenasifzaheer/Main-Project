import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie._id}`}>
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>
  ⭐ {movie.averageRating ? Number(movie.averageRating).toFixed(1) : "0.0"}
</p>

        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
