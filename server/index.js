import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import subjectRoutes from "./routes/subject.js";
import resourceRoutes from "./routes/resourceRoutes.js";

dotenv.config();

const app = express();

// --------------------------------------------------
// ES MODULE PATH
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// --------------------------------------------------
// PDF UPLOADS
// --------------------------------------------------

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// --------------------------------------------------
// ROOT
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "E-Learning Platform API is running",
  });
});

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/branches",
  branchRoutes
);

app.use(
  "/api/subjects",
  subjectRoutes
);

app.use(
  "/api/resources",
  resourceRoutes
);

// --------------------------------------------------
// 404
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
    path: req.originalUrl,
  });
});

// --------------------------------------------------
// SERVER
// --------------------------------------------------

const PORT =
  process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in .env"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing in .env"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "Server startup error:",
      error.message
    );

    process.exit(1);
  }
}

startServer();