// src/components/VideoList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/videos").then((res) => setVideos(res.data));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/videos/${id}`);
      setVideos(videos.filter(video => video._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Link to="/upload" className="btn btn-primary mb-3">Upload Video</Link>
      {videos.map((video) => (
        <div key={video._id} className="card mb-3">
          <video controls width="100%">
            <source src={`http://localhost:5000/${video.filePath}`} type="video/mp4" />
          </video>
          <div className="card-body">
            <p className="card-text">Comments: {video.comments.join(", ")}</p>
            <p className="card-text">Likes: {video.likes}</p>
            <button className="btn btn-danger" onClick={() => handleDelete(video._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoList;