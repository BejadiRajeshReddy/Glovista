import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { getOrderDetails } from "../../services/paymentApiService";
import { generateAWB, trackShipment } from "../../services/trackingApiService";
import ShipmentTracking from "../../components/userSide/ShipmentTracking";

export default function OrderDetailsAndTracking() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [awbGenerated, setAwbGenerated] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(null);
  const [orderedAddress, setOrderedAddress] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getOrderDetails(orderId);

        if (!details) {
          console.error("No order details found.");
          return;
        }

        setOrderDetails(details);
        setOrderedAddress(details.address || null);

        let trackingNum = details.trackingNumber;

        // Generate AWB if tracking number is missing
        if (!trackingNum) {
          const awbResponse = await generateAWB(orderId);

          if (awbResponse?.awb_assign_status === 1) {
            trackingNum = awbResponse.response.data.awb_code;
            setTrackingNumber(trackingNum);
            setOrderDetails((prevDetails) => ({
              ...prevDetails,
              trackingNumber: trackingNum,
            }));
            setAwbGenerated(true);
          }
        }

        // Fetch tracking info if tracking number is available
        if (trackingNum) {
          const trackingResponse = await trackShipment(trackingNum);
          if (trackingResponse?.tracking_data?.track_status === 1) {
            setTrackingInfo(trackingResponse.tracking_data);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) return <Loader />;
  if (!orderDetails)
    return (
      <p className="text-center text-gray-600">Order details not found.</p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span>
        <Link to="/user_profile" className="hover:text-gray-700">
          Orders
        </Link>
        <span>/</span>
        <span>Order Details</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light">ORDER DETAILS</h1>
        <Link to="/user_profile">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Orders
          </button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Order Summary Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="overflow-x-auto rounded-md border border-gray-300">
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    {
                      label: "Order ID",
                      value: orderDetails.order_id || "N/A",
                    },
                    {
                      label: "Shipment ID",
                      value: orderDetails.shipment_id || "N/A",
                    },
                    {
                      label: "Tracking Order ID",
                      value: orderDetails.shiprocket_order_id || "N/A",
                    },
                    {
                      label: "AWB Number",
                      value: orderDetails.awb_number || "N/A",
                    },
                    {
                      label: "Status",
                      value: orderDetails.order_status || "N/A",
                    },
                    {
                      label: "Payment Status",
                      value: orderDetails.payment_status || "N/A",
                    },
                    {
                      label: "Payment Method",
                      value: orderDetails.payment_method || "N/A",
                    },
                    {
                      label: "Subtotal",
                      value: `₹${parseFloat(orderDetails.subtotal || 0).toFixed(
                        2
                      )}`,
                    },
                    {
                      label: "Delivery Fee",
                      value: `₹${parseFloat(
                        orderDetails.delivery_fee || 0
                      ).toFixed(2)}`,
                    },
                    {
                      label: "Discount",
                      value: `₹${parseFloat(orderDetails.discount || 0).toFixed(
                        2
                      )}`,
                    },
                    {
                      label: "Total Amount",
                      value: `₹${parseFloat(
                        orderDetails.total_amount || 0
                      ).toFixed(2)}`,
                      bold: true,
                    },
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="px-4 py-3 border-r text-gray-600 font-medium">
                        {item.label}
                      </td>
                      <td
                        className={`px-4 py-3 ${
                          item.bold ? "text-lg font-semibold" : "text-gray-700"
                        }`}
                      >
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Shipping Address
            </h3>
            {orderedAddress ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {orderedAddress.name || "N/A"}
                </p>
                <p>
                  <strong>Street:</strong>{" "}
                  {orderedAddress.area_address || "N/A"}
                </p>
                <p>
                  <strong>City:</strong> {orderedAddress.city || "N/A"}
                </p>
                <p>
                  <strong>State:</strong> {orderedAddress.state || "N/A"}
                </p>
                <p>
                  <strong>ZIP Code:</strong> {orderedAddress.zip_code || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {orderDetails.user_phone || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Address not provided.</p>
            )}
          </div>

          {trackingInfo ? (
            <ShipmentTracking sampleTrackingData={trackingInfo} />
          ) : (
            <p className="text-gray-500">Tracking details not available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
