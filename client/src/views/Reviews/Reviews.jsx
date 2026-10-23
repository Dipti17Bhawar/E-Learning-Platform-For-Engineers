
import { useEffect, useState } from "react";
import {
  Star,
  MessageSquarePlus,
} from "lucide-react";

import api from "../../api/axios.js";
import "./Reviews.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/reviews");
        setReviews(response.data.reviews || []);
      } catch (err) {
        console.error("Fetch reviews error:", err);
        setError("Unable to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Save review in MongoDB
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedReview = reviewText.trim();

    if (!trimmedName || !trimmedReview) {
      setError("Please enter your name and review.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/reviews", {
        name: trimmedName,
        reviewText: trimmedReview,
        rating,
      });

      // Display the review returned by the backend
      setReviews((currentReviews) => [
        response.data.review,
        ...currentReviews,
      ]);

      setName("");
      setReviewText("");
      setRating(5);

      setSuccess("Your review has been submitted successfully!");
    } catch (err) {
      console.error("Submit review error:", err);

      setError(
        err.response?.status === 401
          ? "Please log in to submit a review."
          : err.response?.data?.message ||
              "Unable to save your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-page">
      <section className="simple-hero">
        <span className="eyebrow">STUDENT REVIEWS</span>

        <h1>What learners say</h1>

        <p>
          See what students think about their learning
          experience.
        </p>
      </section>

      <section className="review-form-section">
        <div className="review-form-header">
          <div className="review-form-icon">
            <MessageSquarePlus size={25} />
          </div>

          <div>
            <h2>Share Your Experience</h2>
            <p>
              Tell other learners about your experience
              with TechSutra.
            </p>
          </div>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="review-name">Your Name</label>

            <input
              id="review-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label>Your Rating</label>

            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={
                    star <= rating
                      ? "rating-star active"
                      : "rating-star"
                  }
                  onClick={() => setRating(star)}
                  aria-label={`Give ${star} stars`}
                >
                  <Star
                    size={24}
                    fill={
                      star <= rating ? "currentColor" : "none"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review-text">Your Review</label>

            <textarea
              id="review-text"
              rows={4}
              placeholder="Write your experience..."
              value={reviewText}
              onChange={(event) =>
                setReviewText(event.target.value)
              }
              maxLength={1000}
              required
            />
          </div>

          {error && (
            <p className="review-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="review-success" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="submit-review-button"
            disabled={submitting}
          >
            <MessageSquarePlus size={18} />
            {submitting ? "Submitting..." : "Add Review"}
          </button>
        </form>
      </section>

      <section className="reviews-section">
        <h2>Student Feedback</h2>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>
            No reviews yet. Be the first to share your
            experience!
          </p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <article
                className="review-card"
                key={review._id}
              >
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={17}
                      fill={
                        star <= review.rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                <p>"{review.reviewText}"</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
