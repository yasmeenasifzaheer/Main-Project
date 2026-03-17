import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MovieDetails.css";

const FALLBACK_IMAGE = "/fallback.jpg";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  // ⭐ Missing states added
  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");
const [showReviewBox, setShowReviewBox] = useState(false);
const [rating, setRating] = useState(0);

  console.log("Movie Data:", movie);
  console.log("Comments:", comments);

  const navigate = useNavigate();

 useEffect(() => {
  const fetchMovie = async () => {
    try {
      const res = await axios.get(
        `https://main-project-1-20ny.onrender.com/api/movies/${id}`
      );

      console.log("Comments from API:", res.data.userReviews?.comments);
      const movieData = res.data;

      setMovie(movieData);

      // ⭐ IMPORTANT
      setComments(movieData.userReviews?.comments || []);

    } catch (err) {
      console.error("Error fetching movie:", err);
    }
  };

  fetchMovie();
}, [id]);

// useEffect(() => {
//   const fetchMovie = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/movies/${id}`
//       );

//       setMovie(res.data);

//       // ⭐ Load comments from movie
//       setComments(res.data.userReviews?.comments || []);

//     } catch (err) {
//       console.error("Error fetching movie:", err);
//     }
//   };

//   fetchMovie();
// }, [id]);

  if (!movie)
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading...</h2>;

  // Handle adding new comment
  const addComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      user: "You",
      text: newComment.trim(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const submitReview = async () => {
  if (!newComment.trim()) return;

  try {
    const res = await axios.post(
      `https://main-project-1-20ny.onrender.com/api/movies/${id}/comment`,
      {
        user: "Anonymous",
        text: newComment,
        rating
      }
    );

    setComments(res.data);
    setNewComment("");
    setRating(0);
    setShowReviewBox(false);

  } catch (error) {
    console.error("Error posting review:", error);
  }
};

  return (
    <div className="movie-details">
      {/* TOP SECTION */}
      <div className="top-section">
        <div className="poster-section">
          <img
            src={movie.poster || FALLBACK_IMAGE}
            alt={movie.title}
            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            loading="lazy"
          />

          <div className="rating">
            <span
              className="rating-link"
              onClick={() => navigate(`/reviews/${movie._id}`)}
            >
              ⭐ {movie.rating || "N/A"} ({movie.numReviews || 0} reviews)
            </span>
          </div>

            </div>

        <div className="info-section">
          <h1>{movie.title || "Untitled"}</h1>

          <div className="meta">
            <span>{movie.language || "N/A"}</span>
            <span>{movie.certificate || "N/A"}</span>
            <span>{movie.duration || "N/A"}</span>
            <span>
              {movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <div className="categories">
            {movie.categories?.map((cat) => (
              <span key={cat} className="badge">
                {cat}
              </span>
            ))}
          </div>

          {movie.inTheater && (
            <div className="theater-tag">🎬 Now in Theaters</div>
          )}
        </div>
      </div>

      {/* TRAILER */}
      {movie.trailer && (
        <div className="trailer-section">
          <iframe src={movie.trailer} title={movie.title} allowFullScreen></iframe>
        </div>
      )}

      {/* STORY */}
      {movie.description && (
        <div className="section">
          <h2>Storyline</h2>
          <p>{movie.description}</p>
        </div>
      )}

      {/* CAST */}
      {movie.cast?.length > 0 && (
        <div className="section">
          <h2>Top Cast</h2>

          <div className="people-row">
            {movie.cast.map((actor, i) => (
              <div className="cast-card" key={i}>
                <img
                  src={actor?.image || FALLBACK_IMAGE}
                  alt={actor?.name || "Actor"}
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  loading="lazy"
                />
                <h4>{actor?.name || "Unknown"}</h4>
                <p style={{ fontSize: "13px", color: "#aaa" }}>
                  {actor?.role || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREW */}
      <div className="section">
        <h2>Crew</h2>

        <div className="people-row">
          {movie.director && (
            <div className="crew-card">
              <img
                src={movie.director?.image || FALLBACK_IMAGE}
                alt={movie.director?.name}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                loading="lazy"
              />
              <h4>{movie.director?.name}</h4>
              <p>Director</p>
            </div>
          )}

          {movie.musicDirector && (
            <div className="crew-card">
              <img
                src={movie.musicDirector?.image || FALLBACK_IMAGE}
                alt={movie.musicDirector?.name}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                loading="lazy"
              />
              <h4>{movie.musicDirector?.name}</h4>
              <p>Music Director</p>
            </div>
          )}

          {movie.cinematographer && (
            <div className="crew-card">
              <img
                src={movie.cinematographer?.image || FALLBACK_IMAGE}
                alt={movie.cinematographer?.name}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                loading="lazy"
              />
              <h4>{movie.cinematographer?.name}</h4>
              <p>Cinematographer</p>
            </div>
          )}

          {movie.editor && (
            <div className="crew-card">
              <img
                src={movie.editor?.image || FALLBACK_IMAGE}
                alt={movie.editor?.name}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                loading="lazy"
              />
              <h4>{movie.editor?.name}</h4>
              <p>Editor</p>
            </div>
          )}

          {movie.productionDesigner && (
            <div className="crew-card">
              <img
                src={movie.productionDesigner?.image || FALLBACK_IMAGE}
                alt={movie.productionDesigner?.name}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                loading="lazy"
              />
              <h4>{movie.productionDesigner?.name}</h4>
              <p>Production Designer</p>
            </div>
          )}
        </div>
      </div>

      {/* PHOTOS */}
      {movie.photos?.length > 0 && (
        <div className="section">
          <h2>Photos</h2>

          <div className="photos-row">
            {movie.photos.map((photo, i) => (
              <img
                key={i}
                src={photo || FALLBACK_IMAGE}
                alt="Movie still"
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      {/* VIDEOS */}
      {movie.videos?.length > 0 && (
        <div className="section videos-section">
          <h2>Videos</h2>

          <div className="videos-container">
            {movie.videos.map((video, i) => (
              <iframe
                key={i}
                src={video?.url}
                title={video?.type || `Video ${i + 1}`}
                allowFullScreen
              ></iframe>
            ))}
          </div>
        </div>
      )}

      {/* STREAMING */}
      {movie.streaming?.available && (
        <div className="section">
          <h2>Available On</h2>

          <div className="streaming-list">
            {movie.streaming.platforms?.map((p, i) => (
              <div className="platform" key={i}>
                <img
                  src={p?.logo || FALLBACK_IMAGE}
                  alt={p?.name || "Platform"}
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  loading="lazy"
                />
                <p>{p?.name || "Unknown"}</p>
                <span>{p?.type || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTION */}
      {movie.production && (
        <div className="section">
          <h2>Production</h2>
          <p>Company: {movie.production?.company || "N/A"}</p>
          <p>Budget: {movie.production?.budget || "N/A"}</p>
        </div>
      )}

     
      {/* USER REVIEWS */}
{movie?.userReviews && (
  <div
    className="section"
    style={{ cursor: "pointer" }}
    onClick={() => navigate(`/reviews/${movie._id}`)}
  >
   <div className="review-header">
  <h2>User Reviews</h2>

  <button
    className="add-review-btn"
    onClick={() => setShowReviewBox(!showReviewBox)}
  >
    + Review
  </button>
</div>

{showReviewBox && (
  <div className="review-box">
    <textarea
      placeholder="Write your review..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />
    <div className="star-rating">
  {[1,2,3,4,5,6,7,8,9,10].map((star) => (
    <span
      key={star}
      className={star <= rating ? "star active" : "star"}
      onClick={() => setRating(star)}
    >
      ★
    </span>
  ))}
</div>

    <button onClick={submitReview} className="submit-review">
      Submit Review
    </button>
    <Link to={`/reviews/${id}`}>
  <button>View All Reviews</button>
</Link>
  </div>
)}

    {/* Average Rating */}
    <div style={{ marginBottom: "15px", color: "#fff" }}>
      ⭐ {movie.userReviews.average} / 10
      <span style={{ marginLeft: "10px", color: "#aaa" }}>
        ({movie.userReviews.total} ratings)
      </span>
    </div>

    {/* Rating Bars */}
    <div className="reviews-vertical-bars">
      {[...movie.userReviews.ratingBreakdown]
        .reverse()
        .map((count, index) => {
          const maxCount = Math.max(
            ...movie.userReviews.ratingBreakdown
          );

          const height =
            maxCount > 0 ? (count / maxCount) * 160 : 0;

          return (
            <div key={index} className="bar-wrapper">
              <div
                className="bar"
                style={{ height: `${height}px` }}
              ></div>

              <span className="star-number">
                {10 - index}
              </span>
            </div>
          );
        })}
    </div>
   
  </div>
)}
    </div>
  );
  
}

export default MovieDetails;