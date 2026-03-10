import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaHeart, FaBookmark } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [favorites, setFavorites] = useState([]);
const [watchlist, setWatchlist] = useState([]);

useEffect(() => {
  const fav = JSON.parse(localStorage.getItem("favorites")) || [];
  const watch = JSON.parse(localStorage.getItem("watchlist")) || [];

  setFavorites(fav);
  setWatchlist(watch);
}, []);

  // Sync dropdown with URL filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilter = params.get("filter");
    if (urlFilter) {
      setFilter(urlFilter);
    } else {
      setFilter("all");
    }
  }, [location.search]);

  const handleSearch = () => {
    navigate(`/movies?search=${searchTerm}&filter=${filter}`);
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <h2 className="logo">MOVIEVIEW</h2>
        <Link to="/">Home</Link>
        <Link to="/movies?filter=inTheater">Movies</Link>
        <Link to="/movies?filter=upcoming">Upcoming</Link>
      </div>

      {/* CENTER SEARCH */}
      <div className="navbar-center">
        <div className="search-box">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="inTheater">In Theaters</option>
            <option value="upcoming">Upcoming</option>
            <option value="love">Love</option>
            <option value="action">Action</option>
            <option value="horror">Horror</option>
            <option value="disney">Disney</option>
          </select>

          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
       <div className="navbar-icons">

  <Link to="/favorites" className="nav-icon">
    ❤️ <span>{favorites.length}</span>
  </Link>

  <Link to="/watchlist" className="nav-icon">
    🔖 <span>{watchlist.length}</span>
  </Link>

</div>
        <button
          className="signin-btn"
          onClick={() => navigate("/login")}
        >
          SIGN IN
        </button>
      </div>
    </nav>
  );
}

export default Navbar;