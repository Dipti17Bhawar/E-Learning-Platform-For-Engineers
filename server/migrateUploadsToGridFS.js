import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Resource from "./models/Resource.js";
import { getGridFSBucket } from "./config/gridfs.js";

dotenv.config();

async function migrateUploads() {
  try {
    console.log("======================================");
    console.log("Starting GridFS migration...");
    console.log("======================================");

    // --------------------------------------
    // 1. Check MongoDB connection variable
    // --------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    // --------------------------------------
    // 2. Connect to MongoDB
    // --------------------------------------

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    // --------------------------------------
    // 3. Find uploads folder
    // --------------------------------------

    const uploadFolder = path.join(
      process.cwd(),
      "uploads"
    );

    console.log(
      "Uploads folder:",
      uploadFolder
    );

    if (!fs.existsSync(uploadFolder)) {
      throw new Error(
        `Uploads folder not found: ${uploadFolder}`
      );
    }

    // --------------------------------------
    // 4. Find all PDF files
    // --------------------------------------

    const files = fs
      .readdirSync(uploadFolder)
      .filter((file) =>
        file.toLowerCase().endsWith(".pdf")
      );

    console.log(
      `Found ${files.length} PDF files`
    );

    if (files.length === 0) {
      console.log(
        "No PDF files found in uploads folder."
      );

      await mongoose.disconnect();

      return;
    }

    // --------------------------------------
    // 5. Get GridFS bucket
    // --------------------------------------

    const bucket = getGridFSBucket();

    // --------------------------------------
    // 6. Counters
    // --------------------------------------

    let migrated = 0;
    let skipped = 0;
    let notFound = 0;
    let failed = 0;

    // --------------------------------------
    // 7. Process every PDF
    // --------------------------------------

    for (const fileName of files) {
      console.log("");
      console.log("--------------------------------------");
      console.log(`Processing: ${fileName}`);

      try {
        // --------------------------------------
        // Find existing Resource
        //
        // Old database examples:
        //
        // fileName:
        // "unit-2.pdf"
        //
        // fileUrl:
        // "/uploads/1790397383911-unit-2.pdf"
        //
        // Actual file:
        // "1790397383911-unit-2.pdf"
        // --------------------------------------

        const resource = await Resource.findOne({
          $or: [
            {
              fileName: fileName,
            },
            {
              fileUrl: `/uploads/${fileName}`,
            },
          ],
        });

        // --------------------------------------
        // Resource doesn't exist
        // --------------------------------------

        if (!resource) {
          console.log(
            `No Resource found for: ${fileName}`
          );

          notFound++;
          continue;
        }

        console.log(
          "Resource found:",
          resource.title
        );

        // --------------------------------------
        // Already migrated
        // --------------------------------------

        if (resource.fileId) {
          console.log(
            "Already migrated. Skipping."
          );

          skipped++;
          continue;
        }

        // --------------------------------------
        // Physical file path
        // --------------------------------------

        const filePath = path.join(
          uploadFolder,
          fileName
        );

        if (!fs.existsSync(filePath)) {
          console.log(
            `Physical file not found: ${filePath}`
          );

          failed++;
          continue;
        }

        // --------------------------------------
        // Read PDF
        // --------------------------------------

        const fileBuffer = fs.readFileSync(
          filePath
        );

        console.log(
          "File size:",
          (
            fileBuffer.length /
            (1024 * 1024)
          ).toFixed(2),
          "MB"
        );

        // --------------------------------------
        // Upload PDF to GridFS
        // --------------------------------------

        const uploadStream =
          bucket.openUploadStream(
            fileName,
            {
              metadata: {
                contentType:
                  "application/pdf",

                originalFileName:
                  fileName,

                resourceId:
                  resource._id.toString(),
              },
            }
          );

        const fileId = await new Promise(
          (resolve, reject) => {
            uploadStream.on(
              "finish",
              () => {
                resolve(
                  uploadStream.id
                );
              }
            );

            uploadStream.on(
              "error",
              reject
            );

            uploadStream.end(
              fileBuffer
            );
          }
        );

        console.log(
          "Uploaded to GridFS:",
          fileId.toString()
        );

        // --------------------------------------
        // Update Resource document
        // --------------------------------------

        resource.fileId = fileId;

        resource.fileUrl =
          `/api/resources/file/${fileId}`;

        // Store actual physical filename
        resource.fileName = fileName;

        await resource.save();

        console.log(
          "Resource updated successfully"
        );

        console.log(
          "New fileUrl:",
          resource.fileUrl
        );

        migrated++;
      } catch (error) {
        console.error(
          `Failed to migrate ${fileName}:`,
          error.message
        );

        failed++;
      }
    }

    // --------------------------------------
    // 8. Migration summary
    // --------------------------------------

    console.log("");
    console.log("======================================");
    console.log("MIGRATION COMPLETE");
    console.log("======================================");

    console.log(
      "Total PDFs:",
      files.length
    );

    console.log(
      "Migrated:",
      migrated
    );

    console.log(
      "Skipped:",
      skipped
    );

    console.log(
      "Resource not found:",
      notFound
    );

    console.log(
      "Failed:",
      failed
    );

    console.log("======================================");

    // --------------------------------------
    // 9. Close MongoDB connection
    // --------------------------------------

    await mongoose.disconnect();

    console.log(
      "MongoDB connection closed"
    );

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error(
      "Migration failed:",
      error.message
    );

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

// --------------------------------------
// Start migration
// --------------------------------------

migrateUploads();