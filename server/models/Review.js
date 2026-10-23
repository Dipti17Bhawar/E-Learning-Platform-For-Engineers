
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        reviewText: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
