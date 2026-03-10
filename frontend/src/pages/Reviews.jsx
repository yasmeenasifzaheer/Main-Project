import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Reviews.css";

export default function ReviewsPage() {

  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setComments(res.data.userReviews?.comments || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  // Submit review
const submitReview = async () => {
  try {

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    await axios.post(
      `http://localhost:5000/api/movies/${id}/comment`,
      {
        text : newComment,
        rating
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setNewComment("");
    setRating(0);

    const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
    setComments(res.data.userReviews?.comments || []);

  } catch (error) {
    console.error("Submit Review Error:", error);
  }
};
  // Like review
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

      {/* Add Review Section */}
      <div className="add-review">
        <h2>Add Review</h2>

        <input
          type="number"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

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

              {/* Display proper user name from backend */}
              <strong>{c.userName || "Anonymous"}</strong>

              <div className="rating">⭐ {c.rating}</div>

              <p className="review-text">{c.text || c.comment}</p>

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