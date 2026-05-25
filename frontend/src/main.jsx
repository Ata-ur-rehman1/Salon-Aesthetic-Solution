import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App.jsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import "./setupAxios";

import { GoogleOAuthProvider } from "@react-oauth/google";
import Loader from "./components/Loader";
import { lazy, Suspense } from "react";
import "./pages/AdvanceSetting/index2.css";
import BarStools from "./pages/ProductbyCategory/BarStools.jsx";
import SearchedInputPage from "./pages/AdvanceSetting/SearchedInputPage.jsx";
import Chairs from "./pages/ProductbyCategory/Chair.jsx";
import MassageBed from "./pages/ProductbyCategory/MassageBed.jsx";
import HeadWashUnit from "./pages/ProductbyCategory/HeadWashUnit.jsx";
import MenicureAndPedicure from "./pages/ProductbyCategory/MenicureAndPedicure.jsx";
import Trolleys from "./pages/ProductbyCategory/Trolleys.jsx";
import Steamer from "./pages/ProductbyCategory/Steamer.jsx";
import HydraMachines from "./pages/ProductbyCategory/HydraMachines.jsx";
import ElectronicEquipment from "./pages/ProductbyCategory/ElectronicEquipment.jsx";
import ContactUs from "./pages/ContactUs.jsx";
// Auth Pages (Critical - Load Early)
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));

// Core Pages (High Priority)
const ProductDetails = lazy(() => import("./pages/Products/ProductDetails.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));

// Orders (User Flow)
const Shipping = lazy(() => import("./pages/Orders/Shipping.jsx"));
const PlaceOrder = lazy(() => import("./pages/Orders/PlaceOrder.jsx"));
const Order = lazy(() => import("./pages/Orders/Order.jsx"));
const UserOrder = lazy(() => import("./pages/User/UserOrder.jsx"));
import CategoryProducts from "./pages/AdvanceSetting/CategoryProducts.jsx";
// Admin Pages (Low Priority - Admin Only)
const AdminRoute = lazy(() => import("./pages/Admin/AdminRoute"));
const Profile = lazy(() => import("./pages/User/Profile"));
const UserList = lazy(() => import("./pages/Admin/UserList"));
const CategoryList = lazy(() => import("./pages/Admin/CategoryList"));
const ProductList = lazy(() => import("./pages/Admin/ProductList"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/Admin/ProductUpdate"));
const OrderList = lazy(() => import("./pages/Admin/OrderList.jsx"));
// Advance Settings & Policies (Low Priority)
const PrivacyNotes = lazy(() => import("./pages/Policy/PrivacyNotes.jsx"));
import AboutUs from "./pages/AboutUs.jsx"
// Private Route (Load Early)
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/updateprofile" element={<UpdateProfile />} /> */}
      <Route index={true} path="/" element={<CategoryProducts />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      {/* Product by  Category */}
      <Route path="/chairs" element={<Chairs />} />
      <Route path="/massage-bed" element={<MassageBed />} />
      <Route path="/head-wash-unit" element={<HeadWashUnit />} />
      <Route path="/menicure-pedicure" element={<MenicureAndPedicure />} />
      <Route path="/trolleys" element={<Trolleys />} />
      <Route path="/steamer" element={<Steamer />} />
      <Route path="/hydra-machines" element={<HydraMachines />} />
      <Route path="/bar-stools" element={<BarStools />} />
      <Route path="/search-input-page" element={<SearchedInputPage />} />
      <Route path="/electronic-equipment" element={<ElectronicEquipment />} />
      <Route path="/category-products" element={<CategoryProducts />} />
      {/* Privacy Policy */}
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/privacy-policy" element={<PrivacyNotes />} />
      <Route
        path="/contact-us"
        element={<ContactUs />}
      />
      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/user-orders" element={<UserOrder />} />
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="user-list" element={<UserList />} />
        <Route path="category-list" element={<CategoryList />} />
        <Route path="product-list" element={<ProductList />} />
        <Route path="all-products-list" element={<AllProducts />} />
        <Route path="order-list" element={<OrderList />} />
        <Route path="product-list/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
      </Route>
    </Route>
  )
);

import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "206508273795-4sb3od1l9chnfpuqualrqovam9avfpt2.apps.googleusercontent.com"}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </Provider >
);
