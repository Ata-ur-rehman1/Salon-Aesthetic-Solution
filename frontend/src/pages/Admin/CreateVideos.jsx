import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUpload,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSun,
  FiMoon,
  FiPlay,
  FiPause,
  FiCloud,
  FiZap,
  FiDatabase,
  FiWifi,
  FiCheck,
  FiCpu,
  FiClock,
  FiServer,
  FiHardDrive,
} from "react-icons/fi";

const CreateVideos = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode (white/blue)
  const [isLoading, setIsLoading] = useState(false);
  const [hoverStates, setHoverStates] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [videoErrors, setVideoErrors] = useState({});

  const blueGradient = {
    background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
    backgroundSize: "300% 300%",
    animation: "blueFlow 4s ease infinite",
  };

  const blueNebula = {
    background: "linear-gradient(135deg, rgb(191, 219, 254) 0%, rgb(186, 230, 253) 25%, rgb(195, 250, 232) 50%, rgb(224, 231, 255) 75%, rgb(237, 233, 254) 100%)",
  };

  const blueGlow = {
    filter: "drop-shadow(0 0 15px rgba(18, 94, 138, 0.4))",
  };

  useEffect(() => {
    fetchVideos();

    const style = document.createElement("style");
    style.textContent = `
      @keyframes blueFlow {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-10px) scale(1.05); }
      }
      @keyframes particleSpin {
        0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
        100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
      }
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      @keyframes hologram {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.4; }
      }
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/videos/all-videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else if (response.data.videos && Array.isArray(response.data.videos)) {
        setVideos(response.data.videos);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch videos!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/videos/delete/${id}`);
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== id));
      toast.success("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);

      const response = await axios.put(
        `/api/videos/update-videos/${editing}`,
        formData
      );

      const updatedVideo = response.data.video || response.data;

      setVideos((prev) =>
        prev.map((video) =>
          video._id === editing ? { ...video, ...updatedVideo } : video
        )
      );
      toast.success("Video title updated successfully!");
      setEditing(null);
      setTitle("");
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Update failed");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    const titleExists = videos.some((video) => video.title === title);
    if (titleExists) {
      toast.error("This video title already exists!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage("Initializing upload...");

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("title", title);

    try {
      const response = await axios.post("/api/videos/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);

            if (progress < 25) setUploadStage("Compressing data...");
            else if (progress < 50) setUploadStage("Processing file...");
            else if (progress < 75) setUploadStage("Uploading to server...");
            else setUploadStage("Finalizing upload...");
          }
        },
      });

      if (response.data && response.data.video) {
        setVideos([...videos, response.data.video]);
        toast.success("Video uploaded successfully!");
        setTitle("");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage("");
    }
  };

  const toggleHover = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlay = (id) => {
    const videoElement = document.getElementById(`video-${id}`);
    if (playingVideo === id) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      videoElement.play();
      setPlayingVideo(id);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setTitle("");
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(18, 94, 138, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(18, 94, 138, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Blue Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-blue-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.2 + Math.random() * 0.3,
              boxShadow: `0 0 ${10 + Math.random() * 20}px rgba(18, 94, 138, 0.3)`,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-8 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
        >
          <div className="relative">
            {/* Gradient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 blur-xl opacity-20"></div>

            <h1
              className="text-4xl lg:text-5xl font-black tracking-tighter mb-3 relative"
              style={blueGradient}
            >
              Video Management
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-mono text-blue-700">
                  STATUS: ONLINE
                </span>
              </div>
              <div className="h-4 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
              <div className="flex items-center space-x-2">
                <FiCpu className="text-blue-500" />
                <span className="text-sm font-mono text-blue-600">
                  SERVER ACTIVE
                </span>
              </div>
              <div className="h-4 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
              <div className="flex items-center space-x-2">
                <FiServer className="text-blue-500" />
                <span className="text-sm font-mono text-blue-600">
                  STORAGE: {videos.length} videos
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload/Edit Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-white rounded-2xl border border-gray-200 shadow-md p-6 mb-16"
        >
          <h2
            className="text-2xl lg:text-3xl font-black mb-8 tracking-wider text-center"
            style={blueGradient}
          >
            {editing ? "Edit Video" : "Upload New Video"}
          </h2>

          <form onSubmit={editing ? handleUpdate : handleUpload} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Title Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FiDatabase />
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
                      Video Title
                    </label>
                    <p className="text-xs text-blue-600/70">
                      Enter a descriptive title for your video
                    </p>
                  </div>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-gray-800 placeholder-blue-400/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Enter video title..."
                    required
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* File Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FiHardDrive />
                  </div>
                  <div>
                    <label htmlFor="file" className="block text-sm font-semibold text-gray-800">
                      Video File
                    </label>
                    <p className="text-xs text-blue-600/70">
                      Select your video file for upload
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    accept="video/*"
                    required={!editing}
                    disabled={isUploading}
                  />
                  <label htmlFor="file" className="cursor-pointer block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${selectedFile
                        ? "border-blue-500 bg-blue-50"
                        : "border-blue-200 bg-blue-50/50 hover:border-blue-300"
                        }`}
                    >
                      <div className="relative flex flex-col items-center justify-center space-y-4">
                        <motion.div
                          animate={{ rotate: selectedFile ? 360 : 0 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="p-4 rounded-full text-white shadow-md"
                          style={{
                            background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
                          }}
                        >
                          <FiUpload size={24} />
                        </motion.div>

                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-gray-800">
                            {selectedFile
                              ? selectedFile.name
                              : "Click to select video file"}
                          </p>

                          {selectedFile ? (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200">
                                {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm bg-cyan-100 text-cyan-700 border border-cyan-200">
                                {selectedFile.type.split('/')[1].toUpperCase()}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm text-blue-600/70">
                              Supports MP4, MOV, AVI, WMV formats
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </label>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -30 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -30 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="overflow-hidden"
                >
                  <div className="relative bg-blue-50 rounded-xl border border-blue-200 p-6 mt-6">
                    <div className="relative z-10">
                      {/* Progress Header */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="p-2 rounded-full bg-white border border-blue-200"
                          >
                            <FiZap className="text-blue-500" size={20} />
                          </motion.div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              Upload in Progress
                            </h3>
                            <p className="text-sm text-blue-600">
                              {uploadStage}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-3xl font-black text-blue-700">
                              {uploadProgress}%
                            </div>
                            <div className="text-xs text-blue-600/70">
                              Upload Complete
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Progress Bar */}
                      <div className="relative mb-6">
                        <div className="w-full h-3 rounded-full overflow-hidden bg-blue-100 border border-blue-200">
                          <motion.div
                            className="h-full relative"
                            initial={{ width: "0%" }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ type: "spring", damping: 25, stiffness: 100 }}
                          >
                            <div 
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>

                      {/* Process Stages */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          {
                            icon: FiDatabase,
                            label: "COMPRESSION",
                            color: "#0A2C3F",
                          },
                          {
                            icon: FiZap,
                            label: "PROCESSING",
                            color: "#125E8A",
                          },
                          {
                            icon: FiWifi,
                            label: "UPLOADING",
                            color: "#030A14",
                          },
                          {
                            icon: FiCheck,
                            label: "FINALIZING",
                            color: "#0A2C3F",
                          },
                        ].map((stage, index) => {
                          const isActive = uploadProgress >= (index + 1) * 25 - 12.5;
                          return (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className={`relative p-3 rounded-lg transition-all duration-300 ${isActive
                                ? "bg-white border border-blue-200 shadow-sm"
                                : "bg-blue-50/50 border border-blue-100"
                                }`}
                            >
                              <div className="mb-2">
                                <div className={`p-2 rounded-full inline-block ${isActive ? "bg-blue-100" : "bg-blue-50"}`}>
                                  <stage.icon
                                    size={16}
                                    className={isActive ? "text-blue-600" : "text-blue-400"}
                                  />
                                </div>
                              </div>
                              <h4 className={`text-xs font-semibold ${isActive ? "text-gray-800" : "text-gray-600"}`}>
                                {stage.label}
                              </h4>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiX />
                    Cancel
                  </span>
                </button>
              )}

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 disabled:opacity-50"
                >
                  Clear Form
                </button>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-white shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      Uploading...
                    </>
                  ) : editing ? (
                    <>
                      <FiEdit2 />
                      Update Video
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      Upload Video
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Video Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 
                className="text-3xl lg:text-4xl font-black mb-2"
                style={blueGradient}
              >
                Video Library
              </h2>
              <p className="text-blue-600/80">
                Your stored video collection
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="flex items-center gap-2">
                  <FiClock />
                  {videos.length} Video{videos.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative">
                <div 
                  className="w-16 h-16 border-4 border-transparent rounded-full animate-spin"
                  style={{
                    borderTopColor: "rgb(18, 94, 138)",
                    borderRightColor: "rgb(10, 44, 63)",
                  }}
                ></div>
              </div>
              <p className="mt-6 text-lg text-blue-600">
                Loading videos...
              </p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="max-w-md mx-auto">
                <div className="p-6 rounded-full inline-block mb-6 bg-blue-100">
                  <FiCloud size={48} className="text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Videos Found</h3>
                <p className="text-blue-600/80 mb-8">
                  Upload your first video to get started
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-white hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
                  }}
                >
                  Upload First Video
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8 }}
                  className="relative bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                  onMouseEnter={() => toggleHover(video._id)}
                  onMouseLeave={() => toggleHover(video._id)}
                >
                  {/* Video Container */}
                  <div className="relative aspect-video overflow-hidden">
                    {videoErrors[video._id] ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50">
                        <FiCloud size={40} className="mb-3 text-blue-400" />
                        <p className="text-sm text-blue-600">
                          Video failed to load
                        </p>
                      </div>
                    ) : (
                      <video
                        id={`video-${video._id}`}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        src={video.filename}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(video._id);
                        }}
                        onError={() => setVideoErrors(prev => ({ ...prev, [video._id]: true }))}
                        crossOrigin="anonymous"
                      />
                    )}

                    {/* Play Control Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ${playingVideo === video._id ? "opacity-100" : ""}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(video._id);
                        }}
                        className="p-3 rounded-full bg-white/90 text-gray-800 transition-transform duration-300 hover:scale-110"
                      >
                        {playingVideo === video._id ? (
                          <FiPause size={20} />
                        ) : (
                          <FiPlay size={20} />
                        )}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(video._id);
                          setTitle(video.title);
                        }}
                        className="p-2 rounded-full bg-white/90 text-blue-600 hover:bg-blue-100 transition-all hover:scale-110"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(video._id);
                        }}
                        className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-100 transition-all hover:scale-110"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 truncate">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-600/80">
                        {new Date(video.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        ID: {video._id.slice(-4).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreateVideos;