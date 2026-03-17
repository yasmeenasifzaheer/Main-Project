import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  // ================= STATES =================
  const [movies, setMovies] = useState([]);
  const [inTheaterMovies, setInTheaterMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loveMovies, setLoveMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [disneyMovies, setDisneyMovies] = useState([]);

  const [mainMovie, setMainMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playTrailer, setPlayTrailer] = useState(false);

  const listRef = useRef(null);
  const currentIndex = useRef(0);
  const navigate = useNavigate();

  // ================= FETCH MOVIES =================
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get("https://main-project-1-20ny.onrender.com/api/movies");
        const allMovies = data || [];

        // Trailer movies (not in theater)
        const trailerMovies = allMovies.filter((movie) => !movie.inTheater);
        setMovies(trailerMovies);

        if (trailerMovies.length > 0) setMainMovie(trailerMovies[0]);

        // Sections
        setInTheaterMovies(allMovies.filter((movie) => movie.inTheater));
        setUpcomingMovies(allMovies.filter((movie) => movie.upcoming));
        setLoveMovies(allMovies.filter((movie) => movie.love));
        setActionMovies(allMovies.filter((movie) => movie.action));
        setHorrorMovies(allMovies.filter((movie) => movie.horror));
        setDisneyMovies(allMovies.filter((movie) => movie.disney));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

 // ================= AUTO TRAILER SCROLL =================
useEffect(() => {
  if (!movies.length) return;

  const trailerMovies = movies.slice(0, 17);
  let index = 0;

  const interval = setInterval(() => {
    // 1️⃣ Update main trailer
    setMainMovie(trailerMovies[index]);
    setPlayTrailer(false);

    // 2️⃣ Scroll Up Next list only if visible
    requestAnimationFrame(() => {
      if (listRef.current) {
        const container = listRef.current;
        const cardHeight = container.firstChild?.offsetHeight || 0;
        const gap = 15;

        // Calculate desired scrollTop
        let scrollTop = index * (cardHeight + gap);

        // Cap scroll so it never jumps beyond content
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        if (scrollTop > maxScrollTop) scrollTop = maxScrollTop;

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    });

    // 3️⃣ Increment index safely
    if (index < trailerMovies.length - 1) {
      index += 1;
    } else {
      clearInterval(interval); // stop at last trailer
    }
  }, 5000);

  return () => clearInterval(interval);
}, [movies]);
  // ================= NAVIGATION =================
  const goToNext = () => {
    if (!movies.length) return;

    currentIndex.current = (currentIndex.current + 1) % movies.length;
    setMainMovie(movies[currentIndex.current]);
    setPlayTrailer(false);
  };

  const goToPrev = () => {
    if (!movies.length) return;

    currentIndex.current = (currentIndex.current - 1 + movies.length) % movies.length;
    setMainMovie(movies[currentIndex.current]);
    setPlayTrailer(false);
  };

  // ================= LOADING =================
  if (loading) return <div className="loading">Loading trailers...</div>;

  // ================= REUSABLE MOVIE SECTION =================
  const MovieSection = React.memo(({ title, movies }) => {
    if (!movies.length) return null;

    return (
      <div className="in-theater-section">
        <h3>{title}</h3>

        <div className="movie-list-horizontal">
          {movies.map((movie) => (
            <Link key={movie._id} to={`/movie/${movie._id}`} className="movie-card">
            <div className="poster-wrapper">
                {/* FAVORITE & WATCHLIST ICONS */}
  <div className="movie-actions">
    <span className="favorite-icon" onClick={(e) => addFavorite(movie, e)}>❤️</span>
    <span className="watchlist-icon" onClick={(e) => addWatchlist(movie, e)}>🔖</span>
  </div>

  <img
    src={movie.poster}
    alt={movie.title}
  />

  {movie.rating && (
    <div className="rating-circle">
      {movie.rating.toFixed(1)}
    </div>
  )}

  {/* Info below poster */}
  <div className="poster-info">
    <h4 className="info-title">{movie.title}</h4>
    <div className="info-details">
      <span className="info-duration">{movie.duration}</span>
      {movie.categories && (
        <span className="info-categories">
          • {movie.categories.join(" • ")}
        </span>
      )}
      {movie.numReviews && (
        <span className="info-views">
          👁 {formatCount(movie.numReviews)}
        </span>
      )}
    </div>
  </div>
</div>
              
            </Link>
          ))}
        </div>
      </div>
    );
  });
  // FAVORITE
const addFavorite = (movie, e) => {
  e.preventDefault();

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const exists = favorites.find((m) => m._id === movie._id);

  if (!exists) {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("❤️ Added to Favorites");
  } else {
    alert("Already in Favorites");
  }
};

// WATCHLIST
const addWatchlist = (movie, e) => {
  e.preventDefault();

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  const exists = watchlist.find((m) => m._id === movie._id);

  if (!exists) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("🔖 Added to Watchlist");
  } else {
    alert("Already in Watchlist");
  }
};

  // ================= RENDER =================
  return (
    <div className="home">
      {/* ===== TRAILER SECTION ===== */}
      <div className="trailer-layout">
        {mainMovie && (
          <div className="main-trailer">
            {playTrailer ? (
              <iframe
                className="main-iframe"
                src={mainMovie.trailer}
                title={mainMovie.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="poster-container">
                <img src={mainMovie.poster} alt={mainMovie.title} className="main-poster" />

                <button className="nav-arrow left" onClick={goToPrev}>
                  ❮
                </button>

                <button className="nav-arrow right" onClick={goToNext}>
                  ❯
                </button>

                <div className="bottom-info">
                  <img src={mainMovie.poster} alt={mainMovie.title} className="mini-poster" />

                  <button className="inline-play-btn" onClick={() => setPlayTrailer(true)}>
                    ▶
                  </button>

                  <div className="text-info">
                    <h2>{mainMovie.title}</h2>
                    <p>
                      ▶ {mainMovie.year} • {mainMovie.duration || "2h 30m"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== UP NEXT ===== */}
        <div className="up-next">
          <h3>Up Next</h3>

          <div className="trailer-list" ref={listRef}>
            {movies.slice(0, 20).map((movie) => (
              <Link key={movie._id} to={`/movie/${movie._id}`} className="trailer-card">
                <div className="card-poster">
                  <img src={movie.poster} alt={movie.title} />
                  <div className="poster-play">▶</div>
                </div>

                <div className="card-details">
                  <p className="watch-year">▶ {movie.year}</p>
                  <h4 className="movie-title">{movie.title}</h4>
                  <div className="reaction-row">
                    <div className="like-box">👍 {formatCount(movie.likes || 0)}</div>
                    <div className="heart-box">❤️ {formatCount(movie.hearts || 0)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/trailers" className="browse-btn">
            Browse All Trailers →
          </Link>
        </div>
      </div>

      

      {/* ===== MOVIE SECTIONS ===== */}
      <MovieSection title="In Theaters" movies={inTheaterMovies} />
      <MovieSection title="Upcoming Movies" movies={upcomingMovies} />
      <MovieSection title="Love Movies" movies={loveMovies} />
      <MovieSection title="Action Movies" movies={actionMovies} />
      <MovieSection title="Horror Movies" movies={horrorMovies} />
      <MovieSection title="Disney Movies" movies={disneyMovies} />

      {/* ===== CTA SECTION ===== */}
      <div className="cta-section">
        <div className="cta-card">
          <p className="cta-small">JOIN OUR COMMUNITY</p>
          <h2>START YOUR JOURNEY</h2>
          <p className="cta-description">
            Sign up with MovieView to create your watchlist, rate movies, and get personalized
            recommendations.
          </p>

          <div className="cta-form">
            <input type="email" placeholder="Enter Your Email" />
            <button onClick={() => navigate("/register")}>GET STARTED</button>
          </div>

          <div className="cta-security">
            <span>● 100% Secure</span>
            <span>● Privacy Protected</span>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2 className="logo-text">MOVIEVIEW</h2>
            <p>
              Your ultimate destination for movies. Discover, rate, and enjoy the best films.
            </p>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <Link to="/">Browse Movies</Link>
            <Link to="/trending">Trending Now</Link>
            <Link to="/watchlist">My Watchlist</Link>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQs</Link>
          </div>

          <div className="footer-links">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ================= FORMAT FUNCTION =================
const formatCount = (num) => {
  if (!num) return 0;
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
};

export default Home;