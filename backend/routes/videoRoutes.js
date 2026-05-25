import express from "express";
import multer from "multer";
import os from "os";
import path from "path";
import {
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
} from "../controllers/videoController.js";

const router = express.Router();

// Multer config for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 * 1024 } // 4GB limit for videos
});


router.route("/all-videos").get(getAllVideos);
router.route("/get-video/:id").get(getVideoById);
router.route("/create").post(upload.single("video"), uploadVideo);
router.route("/delete/:id").delete(deleteVideo);
// Use upload.none() for handling FormData text fields without files
router.route("/update-videos/:id").put(upload.none(), updateVideo);
router.route("/search").get(searchVideo);
router.route("/like/:videoId").put(likeVideo);
router.route("/unlike/:videoId").put(unlikeVideo);
router.route("/comment/:videoId").post(addComment);

// New routes for direct Cloudinary upload
router.route("/cloudinary-signature").get(getCloudinarySignature);
router.route("/save-metadata").post(saveVideoMetadata);

export default router;

