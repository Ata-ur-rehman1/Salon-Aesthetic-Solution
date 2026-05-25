import { createSlice } from "@reduxjs/toolkit";

// Initialize userInfo from localStorage if available, otherwise null
const getUserInfoFromStorage = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to parse userInfo from localStorage:", err);
    return null;
  }
};

const initialState = {
  userInfo: getUserInfoFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
