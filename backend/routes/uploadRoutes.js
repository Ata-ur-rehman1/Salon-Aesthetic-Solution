import path from "path";
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";

const router = express.Router();

// Use memory storage — Vercel's serverless filesystem is read-only/unreliable
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only: JPG, PNG, or WEBP required"), false);
  }
};

// Limit to 10MB
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadMultipleImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]);

router.post("/", (req, res) => {
  uploadMultipleImages(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    const allFiles = [];
    if (req.files) {
      if (req.files.image) allFiles.push(req.files.image[0]);
      if (req.files.image2) allFiles.push(req.files.image2[0]);
      if (req.files.image3) allFiles.push(req.files.image3[0]);
    }

    if (allFiles.length === 0) {
      return res.status(400).send({ message: "No image files provided" });
    }

    try {
      const uploadPromises = allFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: process.env.CLOUDINARY_IMAGE_FOLDER || "salon-interior/images",
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);

      return res.status(200).send({
        message: "Images uploaded successfully",
        image: imageUrls[0],
        images: imageUrls,
      });
    } catch (uploadErr) {
      console.error("Cloudinary upload error:", uploadErr);
      return res.status(500).send({
        message: uploadErr?.message || "Error uploading images to Cloudinary",
      });
    }
  });
});

export default router;
