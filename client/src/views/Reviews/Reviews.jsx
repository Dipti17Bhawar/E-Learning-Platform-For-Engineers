import { Star } from "lucide-react";
import "./Reviews.css";

const reviews = [
  ["Aarav", "The branch-wise organization makes it easy to find my notes."],
  ["Priya", "I like having notes, videos and question papers in one place."],
  ["Rahul", "The simple dashboard is useful for semester preparation."]
];

export default function Reviews() {
  return (
    <div className="reviews-page">
      <section className="simple-hero">
        <span className="eyebrow">STUDENT REVIEWS</span>
        <h1>What learners say</h1>
        <p>Example review section for the e-learning portal.</p>
      </section>

      <section className="reviews-grid">
        {reviews.map(([name, text]) => (
          <article className="review-card" key={name}>
            <div className="stars">
              {[1,2,3,4,5].map((n) => <Star key={n} size={17} fill="currentColor" />)}
            </div>
            <p>"{text}"</p>
            <strong>{name}</strong>
          </article>
        ))}
      </section>
    </div>
  );
}
