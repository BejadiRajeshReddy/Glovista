import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { UserProtectedRoute } from "./protectedRoutes/UserProtectedRoute";
import UserLogin from "../pages/userPages/UserLogin";
import MyOrders from "../pages/userPages/MyOrders";
import UserOtp from "../pages/userPages/UserOtp";
import UserProfile from "../pages/userPages/UserProfile";
import CheckOut from "../pages/userPages/products/CheckOut";
import Home from "../pages/userPages/Home";
import UserSignup from "../pages/userPages/UserSignup";
import Why_Us from "../pages/userPages/Why_Us";
import ProductDetailsPage from "../pages/userPages/products/ProductDetailsPage";
import ErrorPage from "../components/ErrorPage";
import Layout from "../components/userSide/layouts/Layout";
import Products from "../pages/userPages/products/Products";
import Kits_Compo from "../pages/userPages/Kits_Compo";
import Contact from "../pages/userPages/Contact";
import Blogs from "../pages/userPages/Blogs";
import { UnProtectedRoute } from "./protectedRoutes/UnProtectedRoute";
import { setupAxiosInterceptors } from "../services/axiosInstance";
import CartPage from "../pages/userPages/products/CartPage";
import PrivacyPolicy from "../pages/userPages/PrivacyPolicy";
import ReturnPolicy from "../pages/userPages/ReturnPolicy";
import ShippingPolicy from "../pages/userPages/ShippingPolicy";
import { useDispatch } from "react-redux";
import OrderConfirmation from "../pages/userPages/products/OrderConfirmation";
import OrderDetailsAndTracking from "../pages/userPages/OrderDetailsAndTracking";
import KitDetailsPage from "../pages/userPages/KitDetailsPage";

function UserRoutes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setupAxiosInterceptors(navigate, dispatch);
  }, [navigate, dispatch]);

  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <UnProtectedRoute>
            <UserSignup />
          </UnProtectedRoute>
        }
      />
      <Route
        path="/otp"
        element={
          <UnProtectedRoute>
            <UserOtp />
          </UnProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <UnProtectedRoute>
            <UserLogin />
          </UnProtectedRoute>
        }
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/why_us" element={<Why_Us />} />
        <Route path="/kits-combo" element={<Kits_Compo />} />
        <Route path="/kitDetails" element={<KitDetailsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/productDetails" element={<ProductDetailsPage />} />
        <Route path="/privacy_policy" element={<PrivacyPolicy />} />
        <Route path="/return_policy" element={<ReturnPolicy />} />
        <Route path="/shipping_policy" element={<ShippingPolicy />} />

        <Route
          path="/cart"
          element={
            <UserProtectedRoute>
              <CartPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/my_orders"
          element={
            <UserProtectedRoute>
              <MyOrders />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user_profile"
          element={
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserProtectedRoute>
              <CheckOut />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/order_confirmation"
          element={
            <UserProtectedRoute>
              <OrderConfirmation />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/order_details/:orderId"
          element={
            <UserProtectedRoute>
              <OrderDetailsAndTracking />
            </UserProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default UserRoutes;
