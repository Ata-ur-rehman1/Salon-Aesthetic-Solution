import React from "react";
import { useSelector } from "react-redux";
import { useGetCurrentUserProfileQuery } from "../redux/api/usersApiSlice";
import { Link } from "react-router-dom";

/**
 * UserInfo Component - Displays current logged-in user's profile info
 * Can be placed in header, sidebar, or anywhere to show current user details
 * Shows user info from either Redux state or fetched profile
 */
const UserInfo = ({ showDetails = false, className = "" }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const token = localStorage.getItem("jwt");

  // Fetch fresh profile data if available
  const { data: profileData, isLoading } = useGetCurrentUserProfileQuery(
    undefined,
    {
      skip: !token, // Skip if no token
    }
  );

  // Use fetched data if available, fallback to Redux userInfo
  const user = profileData || userInfo;

  if (!user && !token) {
    return null; // User not logged in
  }

  if (isLoading) {
    return <div className={`text-sm text-gray-400 ${className}`}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      title={`Logged in as ${user.email}`}
    >
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.username}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
          {user.username?.charAt(0).toUpperCase() || "U"}
        </div>
      )}

      <div className="text-xs text-gray-300">
        <div className="font-semibold truncate max-w-[150px]">
          {user.username || "User"}
        </div>
        {showDetails && (
          <>
            <div className="text-gray-400 truncate max-w-[150px]">
              {user.email}
            </div>
            {user.city && (
              <div className="text-gray-400 text-xs">
                {user.city}
                {user.country && `, ${user.country}`}
              </div>
            )}
          </>
        )}
      </div>

      {showDetails && (
        <Link
          to="/profile"
          className="text-blue-400 hover:text-blue-300 text-xs ml-auto"
        >
          Edit
        </Link>
      )}
    </div>
  );
};

export default UserInfo;
