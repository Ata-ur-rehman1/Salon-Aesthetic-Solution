import mongoose from "mongoose";
// Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  filename: String, // Store filename for serving the video
  path: String, // Store the full path for deletion
  uploadDate: { type: Date, default: Date.now },
  // image: {type: String, required: true},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
