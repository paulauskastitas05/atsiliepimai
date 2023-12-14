import React from "react";

const ReviewList = ({ userReviews }) => {
  return (
    <div>
      {userReviews.map((review) => (
        <div key={review.id} className="user-review card mb-3">
          <div className="card-header">
            {review.vardas} ({review.pastas}, {review.laikas})
            <span>{<StarRating rating={review.vertinimas} />}</span>
          </div>
          <div className="card-body">
            <p className="card-text">{review.tekstas}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const StarRating = ({ rating }) => {
  const fivestars = "★".repeat(Math.floor(rating));
  const zerostars = "☆".repeat(5 - Math.ceil(rating));
  return (
    <span>
      {fivestars}
      {zerostars}
    </span>
  );
};

export default ReviewList;