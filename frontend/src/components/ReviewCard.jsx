function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <h4>{review.user?.name}</h4>
      <p>⭐ {review.rating}</p>
      <p>{review.comment}</p>
    </div>
  );
}

export default ReviewCard;
