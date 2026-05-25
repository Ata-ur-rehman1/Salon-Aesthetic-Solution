import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserProfileQuery } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";

/**
 * Custom hook to initialize current user on app load
 * Fetches user profile from backend if JWT token exists in localStorage
 */
export const useInitializeUser = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const token = localStorage.getItem("jwt");

  // Only fetch if user is not already in Redux state and token exists
  const { data: profileData, isLoading } = useGetCurrentUserProfileQuery(
    undefined,
    {
      skip: !!userInfo || !token, // Skip if userInfo exists or no token
    }
  );

  useEffect(() => {
    // If we just fetched the profile and it succeeded, update Redux state
    if (profileData && !userInfo && token) {
      dispatch(
        setCredentials({
          ...profileData,
          token: token, // Include the token in the credentials
        })
      );
    }
  }, [profileData, userInfo, token, dispatch]);

  return { isLoading };
};
