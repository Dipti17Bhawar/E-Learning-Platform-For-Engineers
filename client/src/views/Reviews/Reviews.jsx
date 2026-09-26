import { useEffect, useState } from "react";
import {
  Star,
  MessageSquarePlus,
} from "lucide-react";

import "./Reviews.css";

const defaultReviews = [
  [
    "Aarav",
    "The branch-wise organization makes it easy to find my notes.",
    5,
  ],
  [
    "Priya",
    "I like having notes and question papers in one place.",
    5,
  ],
  [
    "Rahul",
    "The simple dashboard is useful for semester preparation.",
    4,
  ],
];

export default function Reviews() {
  const [reviews, setReviews] = useState(() => {
    try {
      const savedReviews =
        localStorage.getItem("techsutraReviews");

      return savedReviews
        ? JSON.parse(savedReviews)
        : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    localStorage.setItem(
      "techsutraReviews",
      JSON.stringify(reviews)
    );
  }, [reviews]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedReview = reviewText.trim();

    if (!trimmedName || !trimmedReview) {
      return;
    }

    const newReview = [
      trimmedName,
      trimmedReview,
      rating,
    ];

    setReviews((currentReviews) => [
      ...currentReviews,
      newReview,
    ]);

    setName("");
    setReviewText("");
    setRating(5);
  };

  return (
    <div className="reviews-page">

      {/* --------------------------------
          HERO
      -------------------------------- */}
      <section className="simple-hero">

        <span className="eyebrow">
          STUDENT REVIEWS
        </span>

        <h1>
          What learners say
        </h1>

        <p>
          See what students think about
          their learning experience.
        </p>

      </section>


      {/* --------------------------------
          ADD REVIEW
      -------------------------------- */}
      <section className="review-form-section">

        <div className="review-form-header">

          <div className="review-form-icon">
            <MessageSquarePlus size={25} />
          </div>

          <div>
            <h2>
              Share Your Experience
            </h2>

            <p>
              Tell other learners about your
              experience with TechSutra.
            </p>
          </div>

        </div>


        <form
          className="review-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div className="form-group">

            <label htmlFor="review-name">
              Your Name
            </label>

            <input
              id="review-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

          </div>


          {/* RATING */}
          <div className="form-group">

            <label>
              Your Rating
            </label>

            <div className="rating-selector">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    className={
                      star <= rating
                        ? "rating-star active"
                        : "rating-star"
                    }
                    onClick={() =>
                      setRating(star)
                    }
                    aria-label={`Give ${star} stars`}
                  >
                    <Star
                      size={24}
                      fill={
                        star <= rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                )
              )}

            </div>

          </div>


          {/* REVIEW */}
          <div className="form-group">

            <label htmlFor="review-text">
              Your Review
            </label>

            <textarea
              id="review-text"
              rows="4"
              placeholder="Write your experience..."
              value={reviewText}
              onChange={(event) =>
                setReviewText(event.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            className="submit-review-button"
          >
            <MessageSquarePlus size={18} />
            Add Review
          </button>

        </form>

      </section>


      {/* --------------------------------
          REVIEWS
      -------------------------------- */}
      <section className="reviews-section">

        <div className="reviews-grid">

          {reviews.map(
            ([reviewName, text, reviewRating], index) => (

              <article
                className="review-card"
                key={`${reviewName}-${index}`}
              >

                <div className="stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={17}
                        fill={
                          star <= reviewRating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    )
                  )}

                </div>

                <p>
                  "{text}"
                </p>

                <strong>
                  {reviewName}
                </strong>

              </article>

            )
          )}

        </div>

      </section>

    </div>
  );
}