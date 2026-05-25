// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const CATEGORY_URL = 'http://localhost:5000/api/category/ies'; // Or your actual URL
// // http://localhost:5000/api/category/ies/676c37c3563b7ab5fe274981/products
// export const productApi = createApi({
//     reducerPath: 'productApi',
//     baseQuery: fetchBaseQuery({ baseUrl: '' }), // If your API is on the same domain
//     endpoints: (builder) => ({
//         selectProductByCategory: builder.query({
//             query: () => `${CATEGORY_URL}/categories`,
//         }),
//         // Other endpoints if needed (e.g., fetching products within a category)
//         getProductsByCategory: builder.query({
//             query: (category) => `${CATEGORY_URL}?category=${category}`, // Example
//         }),
//         getProductById: builder.query({
//             query: (id) => `${CATEGORY_URL}/${id}/products`,
//         })
//     }),
// });

// export const
//     { 
//     useSelectProductByCategoryQuery,
//      useGetProductsByCategoryQuery,
//      useGetProductByIdQuery 
//     } = productApi;
