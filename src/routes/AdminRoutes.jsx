import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Category from "../pages/adminPages/Category";
import UserManagement from "../pages/adminPages/UserManagement";
import OrderManagement from "../pages/adminPages/OrderManagement";
import EnquiryManagement from "../pages/adminPages/EnquiryManagement";
import SalesReport from "../pages/adminPages/SalesReport";
import DashBoard from "../pages/adminPages/DashBoard";
import ErrorPage from "../components/ErrorPage";
import Layout from "../components/adminSide/layouts/Layout";
import { AdminProtectedRoute } from "./protectedRoutes/AdminProtectedRoute";
import AddProducts from "../pages/adminPages/AddProducts";
import Product from "../pages/adminPages/Product";
import { setupAxiosInterceptors } from "../services/axiosInstance";
import CouponsCRUD from "../pages/adminPages/CouponsCRUD";
import OffersCRUD from "../pages/adminPages/OffersCRUD";
import CouponsListing from "../pages/adminPages/CouponsListing";
import OffersListing from "../pages/adminPages/OffersListing";
import AdminLogin from "../pages/adminPages/AdminLogin";
import { UnProtectedRoute } from "./protectedRoutes/UnProtectedRoute";
import Ingredient from "../pages/adminPages/Ingredient";
import Concern from "../pages/adminPages/Concerns";
import OrderDetailsManagement from "../pages/adminPages/OrderDetailsManagement";
import AddKitsCompo from "../pages/adminPages/AddKitsCompo";
import KitsCompo from "../pages/adminPages/KitsCompo";
import BlogManagementPage from "../pages/adminPages/BlogManagementPage";
// import BlogListPage from "../pages/adminPages/BlogListPage";

function AdminRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/glovista_login"
        element={
          <UnProtectedRoute>
            <AdminLogin />{" "}
          </UnProtectedRoute>
        }
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={"/admin/dashboard"} />} />
        <Route
          path="dashboard"
          element={
            <AdminProtectedRoute>
              <DashBoard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="category"
          element={
            <AdminProtectedRoute>
              <Category />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="ingredients"
          element={
            <AdminProtectedRoute>
              <Ingredient />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="concerns"
          element={
            <AdminProtectedRoute>
              <Concern />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <AdminProtectedRoute>
              <Product />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="userlist"
          element={
            <AdminProtectedRoute>
              <UserManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <AdminProtectedRoute>
              <OrderManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="order-details/:id"
          element={
            <AdminProtectedRoute>
              <OrderDetailsManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="enquiry"
          element={
            <AdminProtectedRoute>
              <EnquiryManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="salesreport"
          element={
            <AdminProtectedRoute>
              <SalesReport />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="addProducts"
          element={
            <AdminProtectedRoute>
              <AddProducts />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="coupons"
          element={
            <AdminProtectedRoute>
              <CouponsListing />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="offers"
          element={
            <AdminProtectedRoute>
              <OffersListing />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/coupons/add"
          element={
            <AdminProtectedRoute>
              <CouponsCRUD />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/offers/add"
          element={
            <AdminProtectedRoute>
              <OffersCRUD />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="kitsCompo"
          element={
            <AdminProtectedRoute>
              <KitsCompo />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/kitsCompo/add"
          element={
            <AdminProtectedRoute>
              <AddKitsCompo />
            </AdminProtectedRoute>
          }
        />
        {/* <Route
          path="/blogs"
          element={
            <AdminProtectedRoute>
              <BlogListPage />
            </AdminProtectedRoute>
          }
        /> */}
        <Route
          path="/blogs/new"
          element={
            <AdminProtectedRoute>
              <BlogManagementPage />
            </AdminProtectedRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
