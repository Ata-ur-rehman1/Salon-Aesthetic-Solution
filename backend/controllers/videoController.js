import express from "express"
import Video from "../models/videoModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    console.log("=== VIDEO UPLOAD STARTED ===");
    console.log("File path:", req.file.path);
    console.log("File size:", req.file.size, "bytes");
    console.log("File mimetype:", req.file.mimetype);
    console.log("Cloudinary config check:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing"
    });

    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      throw new Error("Uploaded file not found on server");
    }

    console.log("Uploading video to Cloudinary...");

    const fileSizeMB = req.file.size / (1024 * 1024);
    const fileSizeGB = fileSizeMB / 1024;
    console.log(`File size: ${fileSizeMB.toFixed(2)} MB (${fileSizeGB.toFixed(3)} GB)`);

    // Note: Cloudinary free tier has a 100MB limit
    // For files > 100MB, you need a paid plan
    if (fileSizeMB > 100) {
      console.warn(`⚠️  WARNING: File is ${fileSizeMB.toFixed(2)}MB. Cloudinary free tier limit is 100MB.`);
      console.warn(`⚠️  This upload may fail unless you have a paid Cloudinary plan.`);
    }

    console.log("Uploading to Cloudinary with optimized settings...");

    // Use regular upload with resource_type: auto for better compatibility
    // This works better than upload_large for most cases
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // Auto-detect resource type
      folder: "dot-nk/videos",
      chunk_size: 6000000, // 6MB chunks
      timeout: 1800000, // 30 minutes timeout
      use_filename: true,
      unique_filename: true,
    });

    console.log("=== CLOUDINARY UPLOAD RESULT ===");
    console.log("Full result:", JSON.stringify(result, null, 2));
    console.log("Secure URL:", result.secure_url);
    console.log("Public ID:", result.public_id);
    console.log("Format:", result.format);
    console.log("Duration:", result.duration);

    // Validate upload result
    if (!result || !result.secure_url) {
      throw new Error("Cloudinary upload failed - no secure_url returned. Result: " + JSON.stringify(result));
    }

    // Clean up temp file
    try {
      fs.unlinkSync(req.file.path);
      console.log("Temp file deleted successfully");
    } catch (e) {
      console.warn("Failed to delete temp file:", e);
    }

    const video = new Video({
      title: req.body.title || result.original_filename,
      filename: result.secure_url,
      path: result.public_id,
    });

    await video.save();
    console.log("=== VIDEO SAVED TO DB ===");
    console.log("Video document:", JSON.stringify(video, null, 2));

    res.status(201).json({ video });
  } catch (error) {
    console.error("=== ERROR UPLOADING VIDEO ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Check if it's a Cloudinary 413 error (file too large)
    if (error.message && error.message.includes("413")) {
      const fileSizeMB = req.file ? (req.file.size / (1024 * 1024)).toFixed(2) : "unknown";
      console.error(`File size: ${fileSizeMB}MB exceeded Cloudinary limits`);

      // Clean up temp file
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
          console.log("Temp file cleaned up after error");
        } catch (e) {
          console.error("Failed to clean up temp file:", e);
        }
      }

      return res.status(413).json({
        message: `Video file too large for Cloudinary. Your file is ${fileSizeMB}MB. Try a smaller file (< 100MB recommended) or upgrade your Cloudinary plan.`,
        error: "File size exceeds Cloudinary limits",
        fileSize: fileSizeMB,
        suggestion: "Compress your video or use a smaller file"
      });
    }

    // Clean up temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Temp file cleaned up after error");
      } catch (e) {
        console.error("Failed to clean up temp file:", e);
      }
    }
    res.status(500).json({ message: "Error uploading video", error: error.message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};


const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    console.log("Delete request for:", req.params.id);
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Try to delete from Cloudinary but don't fail properly if it errors
    if (video.path) {
      try {
        console.log("Deleting from Cloudinary:", video.path);
        await cloudinary.uploader.destroy(video.path, { resource_type: "video" });
      } catch (cloudErr) {
        console.error("Cloudinary delete warning:", cloudErr);
        // Continue to delete from DB even if Cloudinary fails
      }
    }

    await video.deleteOne();
    console.log("Video deleted from DB");
    res.json({ message: "Video removed" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Error deleting video", error: error.message });
  }
};


const updateVideo = async (req, res) => {
  try {
    const { title } = req.body;
    const video = await Video.findById(req.params.id);

    if (video) {
      video.title = title || video.title;
      const updatedVideo = await video.save();
      res.json({ video: updatedVideo });
    } else {
      res.status(404).json({ message: "Video not found" });
    }
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Error updating video", error: error.message });
  }
};


const searchVideo = asyncHandler(async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "title parameter is required." });
    }

    const videos = await Video.find({
      title: { $regex: new RegExp(title, 'i') }, // Case-insensitive search
    });

    res.json(videos);
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).json({ message: "Error searching videos." });
  }
})

const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.body; // Assume userId is sent in the body

  try {
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }
    video.likes.push(userId);
    await video.save();

    res.json({ message: "Liked successfully", video });
  } catch (error) {
    res.status(500).json({ message: "Error liking the video" });
  }
});

// Unlike a video
const unlikeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.body; // Assume userId is sent in the body
  try {
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.likes = video.likes.filter(id => id.toString() !== userId);
    await video.save();

    res.json({ message: "Unliked successfully", video });
  } catch (error) {
    res.status(500).json({ message: "Error unliking the video" });
  }
});

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { userId, text } = req.body; // userId and text from the body
  try {
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = {
      user: userId,
      text,
    };

    video.comments.push(comment);
    await video.save();

    res.json({ message: "Comment added", video });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
});

// Generate Cloudinary signature for direct frontend uploads
const getCloudinarySignature = asyncHandler(async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = process.env.CLOUDINARY_VIDEO_FOLDER || "dot-nk/videos";

    // Create the signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    res.status(500).json({ message: "Error generating upload signature", error: error.message });
  }
});

// Save video metadata after direct upload to Cloudinary
const saveVideoMetadata = asyncHandler(async (req, res) => {
  try {
    const { title, filename, path } = req.body;

    if (!filename || !path) {
      return res.status(400).json({ message: "Missing required fields: filename and path" });
    }

    const video = new Video({
      title: title || "Untitled Video",
      filename: filename, // This will be the secure_url from Cloudinary
      path: path, // This will be the public_id from Cloudinary
    });

    await video.save();
    console.log("=== VIDEO METADATA SAVED TO DB ===");
    console.log("Video document:", JSON.stringify(video, null, 2));

    res.status(201).json({ video });
  } catch (error) {
    console.error("=== ERROR SAVING VIDEO METADATA ===");
    console.error("Error message:", error.message);
    res.status(500).json({ message: "Error saving video metadata", error: error.message });
  }
});

export {
  uploadVideo,
  getVideoById,
  getAllVideos,
  deleteVideo,
  updateVideo,
  searchVideo,
  likeVideo,
  unlikeVideo,
  addComment,
  getCloudinarySignature,
  saveVideoMetadata
};
