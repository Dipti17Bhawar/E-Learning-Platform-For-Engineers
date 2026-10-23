
import Review from "../models/Review.js";

// GET: Fetch all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reviews.",
    });
  }
};

// POST: Add a new review
export const createReview = async (req, res) => {
  try {
    const { name, reviewText, rating } = req.body;

    if (
      typeof name !== "string" ||
      typeof reviewText !== "string" ||
      !name.trim() ||
      !reviewText.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name and review are required.",
      });
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (name.trim().length > 50 ||
        reviewText.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Name or review exceeds the allowed length.",
      });
    }

    const review = await Review.create({
      name: name.trim(),
      reviewText: reviewText.trim(),
      rating,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add review.",
    });
  }
};
