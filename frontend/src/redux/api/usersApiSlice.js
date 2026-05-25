import { apiSlice } from "./apiSlice";
import { USERS_URL, UPLOAD_URL } from "../constants";
import { setCredentials } from "../features/auth/authSlice.js";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // Store token in localStorage for future requests
          if (data?.token) {
            localStorage.setItem("jwt", data.token);
          }
          // Dispatch setCredentials to update Redux state and persist to localStorage
          dispatch(setCredentials(data));
        } catch (err) {
          console.error("Login error:", err);
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    googleLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/google`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("jwt", data.token);
          }
          dispatch(setCredentials(data));
        } catch (err) {
          console.error("Google Login error:", err);
        }
      },
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-email`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("jwt", data.token);
          }
          dispatch(setCredentials(data));
        } catch (err) {
          console.error("Verification error:", err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem("jwt");
        }
      },
    }),
    uploadUserImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: `${USERS_URL}/profile/image`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteProfileImage: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/profile/image`,
        method: "DELETE",
      }),
    }),
    getCurrentUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUploadUserImageMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
  useGetCurrentUserProfileQuery,
  useGoogleLoginMutation,
  useVerifyEmailMutation,
} = userApiSlice;
