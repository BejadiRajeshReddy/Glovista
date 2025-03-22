"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getOrderDetails,
  updateOrderStatus,
} from "../../services/paymentApiService";
import {
  calculateShippingRates,
  cancelPickup,
  checkServiceability,
  requestPickup,
} from "../../services/trackingApiService";
import { useParams } from "react-router-dom";
import {
  Package,
  Truck,
  MapPin,
  Calculator,
  Calendar,
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Loader from "../../components/common/Loader";
import { cancelOrderAdmin } from "../../services/adminApiService";

// Status badge component for better visual representation
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} border capitalize`}
    >
      {status}
    </span>
  );
};

const OrderDetailsManagement = () => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [shiprocketRates, setShiprocketRates] = useState(null);
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: null });
  const { id: orderId } = useParams();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: null });
    }, 5000);
  };

  const fetchOrderDetails = async () => {
    try {
      if (!orderId) return;
      setLoading(true);
      const response = await getOrderDetails(orderId);

      setOrder(response);
      setAddress(response.address || {});
      setStatus(response.status || "Pending");
    } catch (error) {
      console.error("Error fetching order details:", error);
      showNotification("Failed to load order details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    setActionLoading(true);

    try {
      AlertCircle;
      const response = await cancelOrderAdmin(order.shiprocket_order_id);

      if (response) {
        showNotification("Order cancelled successfully", "success");
        fetchOrderDetails();
      } else {
        throw new Error("Error while cancelling order");
      }
    } catch (error) {
      console.error("Error Cancelling order:", error);
      showNotification("Failed to cancel order", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const fetchShiprocketServiceAvailability = useCallback(async () => {
    try {
      setActionLoading("serviceability");
      if (!address.zip_code) {
        showNotification(
          "No zip code available for serviceability check",
          "error"
        );
        return;
      }
      const response = await checkServiceability(address.zip_code);
      console.log("Service availability:", response);
      showNotification("Service availability checked successfully", "success");
    } catch (error) {
      console.error("Error fetching service availability:", error);
      showNotification("Failed to check service availability", "error");
    } finally {
      setActionLoading(null);
    }
  }, [address.zip_code]);

  const calculateShiprocketServiceRates = useCallback(async () => {
    try {
      setActionLoading("rates");
      if (!order) return;
      const shipmentData = {};
      const response = await calculateShippingRates(shipmentData);
      setShiprocketRates(response);
      showNotification("Shipping rates calculated successfully", "success");
    } catch (error) {
      console.error("Error calculating service rates:", error);
      showNotification("Failed to calculate shipping rates", "error");
    } finally {
      setActionLoading(null);
    }
  }, [order]);

  const requestPackagePickup = useCallback(async () => {
    try {
      setActionLoading("requestPickup");
      if (!order) return;
      const pickupData = {};
      const response = await requestPickup(pickupData);
      console.log("Pickup requested:", response);
      showNotification("Pickup requested successfully", "success");
    } catch (error) {
      console.error("Error requesting pickup:", error);
      showNotification("Failed to request pickup", "error");
    } finally {
      setActionLoading(null);
    }
  }, [order]);

  const cancelPackagePickup = useCallback(async () => {
    try {
      setActionLoading("cancelPickup");
      if (!order) return;
      const pickupId = order.pickup_id;
      if (!pickupId) {
        showNotification("No pickup ID found for cancellation", "error");
        return;
      }
      const response = await cancelPickup(pickupId);
      console.log("Pickup cancelled:", response);
      showNotification("Pickup cancelled successfully", "success");
    } catch (error) {
      console.error("Error cancelling pickup:", error);
      showNotification("Failed to cancel pickup", "error");
    } finally {
      setActionLoading(null);
    }
  }, [order]);

  const handleUpdateOrderStatus = async () => {
    try {
      setActionLoading("updateStatus");
      if (!order || !status || order.status === status) return;
      const response = await updateOrderStatus({ id: order.id, status });
      console.log("Order status updated:", response);
      setOrder((prev) => ({ ...prev, status }));
      showNotification("Order status updated successfully", "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      showNotification("Failed to update order status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-600 mt-2">
          The requested order could not be found or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Notification */}
      {notification.type && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-500 transform translate-y-0 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          <span
            className={
              notification.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }
          >
            {notification.message}
          </span>
          <button
            onClick={() => setNotification({ message: "", type: null })}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Details
          </h1>
          <p className="text-gray-600">Manage order #{order.order_id}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <StatusBadge status={order.order_status || "Pending"} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Customer Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{address.name || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{address.email || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{address.primary_number || "N/A"}</p>
              </div>
            </div>

            {address.secondary_number && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Secondary Phone</p>
                  <p className="font-medium">{address.secondary_number}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="font-medium">
                  {[
                    address.area_address,
                    address.city,
                    address.state,
                    address.zip_code,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Order Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal || "0.00"}</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  -${order.discount || "0.00"}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  ${order.delivery_fee || "0.00"}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-xl font-bold">
                  ${order.total_amount || "0.00"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{order.payment_method || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <StatusBadge status={order.payment_status || "Pending"} />
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{order.created_at || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Truck className="h-5 w-5 mr-2 text-primary" />
          Order Status Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Order Status
            </label>
            <div className="flex space-x-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200"
              >
                {[
                  "Pending",
                  "Processing",
                  "Confirmed",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={handleUpdateOrderStatus}
                disabled={actionLoading === "updateStatus"}
                className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center min-w-[120px]"
              >
                {actionLoading === "updateStatus" ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Truck className="h-5 w-5 mr-2 text-primary" />
          Shipping Management
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={handleCancelOrder}
            disabled={actionLoading === "serviceability"}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 h-32"
          >
            {actionLoading === "serviceability" ? (
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            ) : (
              <X className="h-6 w-6 text-red-500 mb-3" />
            )}
            <span className="text-sm font-medium text-center">
              Cancel Order
            </span>
          </button>

          <button
            onClick={fetchShiprocketServiceAvailability}
            disabled={actionLoading === "serviceability"}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 h-32"
          >
            {actionLoading === "serviceability" ? (
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            ) : (
              <MapPin className="h-6 w-6 text-primary mb-3" />
            )}
            <span className="text-sm font-medium text-center">
              Check Service Availability
            </span>
          </button>

          <button
            onClick={calculateShiprocketServiceRates}
            disabled={actionLoading === "rates"}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 h-32"
          >
            {actionLoading === "rates" ? (
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            ) : (
              <Calculator className="h-6 w-6 text-primary mb-3" />
            )}
            <span className="text-sm font-medium text-center">
              Calculate Shipping Rates
            </span>
          </button>

          <button
            onClick={requestPackagePickup}
            disabled={actionLoading === "requestPickup"}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 h-32"
          >
            {actionLoading === "requestPickup" ? (
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            ) : (
              <Truck className="h-6 w-6 text-primary mb-3" />
            )}
            <span className="text-sm font-medium text-center">
              Request Pickup
            </span>
          </button>

          <button
            onClick={cancelPackagePickup}
            disabled={actionLoading === "cancelPickup"}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 h-32"
          >
            {actionLoading === "cancelPickup" ? (
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            ) : (
              <X className="h-6 w-6 text-red-500 mb-3" />
            )}
            <span className="text-sm font-medium text-center">
              Cancel Pickup
            </span>
          </button>
        </div>

        {/* {shiprocketRates && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Available Shipping Rates</h3>
            <p className="text-sm text-gray-600">
              Shipping rates information would be displayed here
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default OrderDetailsManagement;
