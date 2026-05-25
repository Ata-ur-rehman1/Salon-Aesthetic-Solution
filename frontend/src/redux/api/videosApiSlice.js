import { apiSlice } from "./apiSlice";
import { VIDEO_URL } from "../constants";

export const videosApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        allVideos: builder.query({
            query: () => `${VIDEO_URL}/all-videos`,
            providesTags: ["Videos"],
        }),
        createVideo: builder.mutation({
            query: (data) => ({
                url: `${VIDEO_URL}/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Videos"],
        }),
        deleteVideo: builder.mutation({
            query: (id) => ({
                url: `${VIDEO_URL}/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Videos"],
        }),
        updateVideo: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${VIDEO_URL}/update-videos/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Videos"],
        }),
        getVideoById: builder.query({
            query: (id) => `${VIDEO_URL}/get-video/${id}`,
            providesTags: (result, error, id) => [{ type: "Videos", id }],
        }),
        searchVideoByTitle: builder.query({
            query: (title) => `${VIDEO_URL}/search?title=${title}`,
            providesTags: ["Videos"],
        }),
        getCloudinarySignature: builder.query({
            query: () => `${VIDEO_URL}/cloudinary-signature`,
            keepUnusedDataFor: 0,
        }),
        saveVideoMetadata: builder.mutation({
            query: (data) => ({
                url: `${VIDEO_URL}/save-metadata`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Videos"],
        }),
    }),
});

export const {
    useAllVideosQuery,
    useCreateVideoMutation,
    useDeleteVideoMutation,
    useUpdateVideoMutation,
    useGetVideoByIdQuery,
    useSearchVideoByTitleQuery,
    useLazyGetCloudinarySignatureQuery,
    useSaveVideoMetadataMutation,
} = videosApiSlice;
