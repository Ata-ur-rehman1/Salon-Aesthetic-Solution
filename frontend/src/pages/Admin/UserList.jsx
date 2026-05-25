import { useState, memo } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaRobot,
  FaVolumeUp,
  FaUserAstronaut,
} from "react-icons/fa";
import { GiBlackHoleBolas, GiSpaceship, GiGalaxy } from "react-icons/gi";
import { IoMdStar } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechSynthesis } from "react-speech-kit";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [updateUser] = useUpdateUserMutation();
  const [hoveredProfile, setHoveredProfile] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const { speak } = useSpeechSynthesis();

  // Sort users with admins first
  const sortedUsers = [...users].sort((a, b) => {
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;
    return 0;
  });

  // Delete handler
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        if (voiceMode) speak({ text: `Deleting user` });
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  // Update handler
  const updateHandler = async (id) => {
    try {
      if (voiceMode) speak({ text: `Updating user` });
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5">
          {[...Array(15)].map((_, i) => (
            <IoMdStar
              key={i}
              className="absolute text-blue-300"
              style={{
                fontSize: `${Math.random() * 2 + 0.5}rem`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-center py-8 relative z-10"
      >
        <div className="relative">
          <div className="mb-4">
            <div className="inline-block p-4 rounded-full bg-blue-50">
              <FaUserAstronaut className="text-4xl text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span 
              style={{
                background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              User Management
            </span>
          </h1>
          <p className="text-gray-600 mb-4">
            Manage all users in the system
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
              }}
            >
              <span className="text-white text-sm font-bold">{users.length}</span>
            </div>
            <span className="text-blue-700 font-medium">Total Users</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVoiceMode(!voiceMode)}
            className={`px-6 py-3 rounded-lg flex items-center mx-auto mt-6 shadow-sm transition-all duration-300 ${voiceMode
              ? "text-white"
              : "bg-white text-blue-700 border border-gray-200 hover:shadow-md"
              }`}
            style={voiceMode ? {
              background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
            } : {}}
          >
            <FaVolumeUp className="mr-2" />
            {voiceMode ? "Disable Voice" : "Enable Voice"}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          </div>
        ) : (
          <div className="relative">
            {/* Single Column User List */}
            <div className="max-w-3xl mx-auto space-y-4">
              {sortedUsers.map((user) => (
                <motion.div
                  key={user._id}
                  className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.005 }}
                  onMouseEnter={() => setHoveredProfile(user)}
                  onMouseLeave={() => setHoveredProfile(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
                          alt={user.username}
                          className="w-14 h-14 rounded-full border-4 border-white shadow-sm object-cover"
                        />
                        {user.isAdmin && (
                          <div className="absolute -bottom-1 -right-1 text-white rounded-full p-1 shadow-sm"
                            style={{
                              background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
                            }}
                          >
                            <FaRobot className="text-xs" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-800">
                            {editableUserId === user._id ? (
                              <input
                                type="text"
                                value={editableUserName}
                                onChange={(e) =>
                                  setEditableUserName(e.target.value)
                                }
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              />
                            ) : (
                              user.username
                            )}
                          </h3>
                          {user.isAdmin && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {editableUserId === user._id ? (
                            <input
                              type="email"
                              value={editableUserEmail}
                              onChange={(e) =>
                                setEditableUserEmail(e.target.value)
                              }
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 w-full"
                            />
                          ) : (
                            user.email
                          )}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-blue-500">
                            ID: {user._id.substring(0, 8)}...
                          </span>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <span className="text-xs text-gray-500">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {editableUserId === user._id ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateHandler(user._id)}
                          className="px-4 py-2 text-white rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
                          }}
                        >
                          <FaCheck className="mr-2" /> Save
                        </motion.button>
                      ) : (
                        <>
                          {!user.isAdmin && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setEditableUserId(user._id);
                                  setEditableUserName(user.username);
                                  setEditableUserEmail(user.email);
                                }}
                                className="p-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg flex items-center shadow-sm hover:border-blue-300 transition-all duration-300"
                                title="Edit user"
                              >
                                <FaEdit />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => deleteHandler(user._id)}
                                className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center shadow-sm hover:border-red-300 transition-all duration-300"
                                title="Delete user"
                              >
                                <FaTrash />
                              </motion.button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hover Profile Panel */}
            <AnimatePresence>
              {hoveredProfile && (
                <motion.div
                  key={hoveredProfile._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="fixed right-4 top-1/2 transform -translate-y-1/2 w-72 bg-white rounded-lg p-6 shadow-lg border border-gray-200 z-20"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <img
                        src={hoveredProfile.profileImage || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
                        alt={hoveredProfile.username}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover mx-auto"
                      />
                      <div className="absolute -bottom-2 -right-2 text-white rounded-full p-2 shadow-md"
                        style={{
                          background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
                        }}
                      >
                        <FaUserAstronaut className="text-lg" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {hoveredProfile.username}
                    </h3>
                    <p className="text-gray-600 mb-4">{hoveredProfile.email}</p>
                    
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-600">Role</span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${hoveredProfile.isAdmin
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                          }`}>
                          {hoveredProfile.isAdmin ? "Administrator" : "User"}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-600">Account Created</span>
                        <span className="text-sm text-blue-700 font-medium">
                          {new Date(hoveredProfile.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-600">User ID</span>
                        <span className="text-xs text-blue-500 font-mono">
                          {hoveredProfile._id.substring(0, 10)}...
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 w-full">
                      <div className="h-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(UserList);