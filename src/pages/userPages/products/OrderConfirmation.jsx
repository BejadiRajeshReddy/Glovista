import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { getOrderDetails } from "../../../services/paymentApiService";

export default function OrderConfirmation() {
  const { order } = useLocation().state || {};
  const orderId = order?.order_id;
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        if (orderId) {
          const details = await getOrderDetails(orderId);
          setOrderDetails(details);
        } else {
          throw new Error("Order ID not found in order details.");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
        <p>No order details were found. Please check your order history.</p>
        <Link to="/" className="text-blue-500 underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="mb-2">Your order has been successfully placed.</p>
      <div className="bg-white shadow rounded p-4 mb-8">
        <p className=" px-4 py-2 pt-2 rounded-t-md border border-b-0">
          <strong>Order ID : </strong> {orderDetails.order_id}
        </p>
        <p className=" px-4 py-2 border-x">
          <strong>Order Status :</strong> {orderDetails.order_status}
        </p>
        <p className=" px-4 py-2 border-x">
          <strong>Shipment ID :</strong> {orderDetails.shipment_id}
        </p>
        <p className=" px-4 py-2 border-x">
          <strong>AWB Number :</strong> {orderDetails.awb_number || "NIL"}
        </p>
        <p className=" px-4 py-2 pb-2 rounded-b-md border border-t-0">
          <strong>Total Amount :</strong> ₹{orderDetails.total_amount}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      {orderDetails.items && orderDetails.items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse ">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Product</th>
                <th className="border px-4 py-2 text-right">Quantity</th>
                <th className="border px-4 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {item.product.product_name}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {item.quantity}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    ₹{item.total_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No items found in this order.</p>
      )}

      <div className="mt-8">
        <Link
          to="/"
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
