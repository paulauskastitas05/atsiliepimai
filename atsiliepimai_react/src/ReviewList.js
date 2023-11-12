import React from "react";

const ReviewList = ({ userReviews }) => {
  return (
    <div>
      {userReviews.map((review) => (
        <div key={review.id} className="user-review card mb-3">
          <div className="card-header">
            {review.reviewerName} ({review.reviewDate}, {review.reviewTime})
            <span>{<StarRating rating={review.reviewRating} />}</span>
          </div>
          <div className="card-body">
            <p className="card-text">{review.reviewText}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const StarRating = ({ rating }) => {
  const fullStars = "★".repeat(Math.floor(rating));
  const emptyStars = "☆".repeat(5 - Math.ceil(rating));
  return (
    <span>
      {fullStars}
      {emptyStars}
    </span>
  );
};

export default ReviewList;
