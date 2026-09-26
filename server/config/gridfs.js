import mongoose from "mongoose";

export const getGridFSBucket = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection is not ready");
  }

  const { GridFSBucket } = mongoose.mongo;

  return new GridFSBucket(db, {
    bucketName: "resources",
  });
};