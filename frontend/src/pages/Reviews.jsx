import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Reviews.css";

export default function ReviewsPage() {
  const { id } = useParams();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  // ✅ Fetch comments (CORRECT API)
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://main-project-1-20ny.onrender.com/api/movies/${id}/reviews`
      );
      setComments(res.data.comments || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // ✅ Run on page load
  useEffect(() => {
    fetchComments();
  }, [id]);

  // ✅ Submit review
  const submitReview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));

      await axios.post(
        `https://main-project-1-20ny.onrender.com/api/movies/${id}/comment`,
        {
          text: newComment,
          user: user?.name || "Anonymous" // ✅ match backend
        }
      );

      // ✅ Clear input
      setNewComment("");
      setRating(0);

      // ✅ Refresh comments (FIXED)
      fetchComments();

    } catch (error) {
      console.error("Submit Review Error:", error);
    }
  };

  // Like review (frontend only for now)
  const likeReview = (index) => {
    const updated = [...comments];
    updated[index].likes = (updated[index].likes || 0) + 1;
    setComments(updated);
  };

  // Dislike review
  const dislikeReview = (index) => {
    const updated = [...comments];
    updated[index].dislikes = (updated[index].dislikes || 0) + 1;
    setComments(updated);
  };

  return (
    <div className="reviews-page">
      <h1>User Reviews</h1>

      {/* Add Review */}
      <div className="add-review">
        <h2>Add Review</h2>

        <textarea
          placeholder="Write your review..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button onClick={submitReview}>
          Submit Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {comments.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="review-card">
              
              {/* ✅ FIXED field name */}
              <strong>{c.user || "Anonymous"}</strong>

              {/* ❌ rating removed (not in backend) */}
              
              <p className="review-text">{c.text}</p>

              <div className="review-actions">
                <button onClick={() => likeReview(i)}>
                  👍 {c.likes || 0}
                </button>

                <button onClick={() => dislikeReview(i)}>
                  👎 {c.dislikes || 0}
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}