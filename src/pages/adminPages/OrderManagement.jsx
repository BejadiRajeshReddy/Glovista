import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Filter, Package } from "lucide-react";
import { getOrders } from "../../services/paymentApiService";
import Loader from "../../components/common/Loader";
import OrderImage from "../../components/adminSide/OrderImage";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (searchQuery) {
      result = result.filter(
        (order) =>
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(result);
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();

      setOrders(response);
      setFilteredOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "packed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-teal-800 text-transparent bg-clip-text">
              Order Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search orders..."
                className="w-full sm:w-64 px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <button
                type="button"
                className="flex items-center justify-between w-full sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                aria-haspopup="listbox"
                aria-expanded={isSelectOpen}
              >
                <span>
                  {statusFilter === "all" ? "All Orders" : statusFilter}
                </span>
                <Filter className="h-4 w-4 text-gray-400" />
              </button>

              {isSelectOpen && (
                <div
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                  role="listbox"
                >
                  <ul className="py-1 max-h-60 overflow-auto">
                    {[
                      "all",
                      "pending",
                      "packed",
                      "shipped",
                      "delivered",
                      "cancelled",
                      "returned",
                    ].map((status) => (
                      <li
                        key={status}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                          statusFilter === status
                            ? "bg-gray-50 text-teal-600"
                            : ""
                        }`}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsSelectOpen(false);
                        }}
                        role="option"
                        aria-selected={statusFilter === status}
                      >
                        {status === "all"
                          ? "All Orders"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            <div className="h-8 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Orders will appear here once customers place them"}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <button
                className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium w-[100px]">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-left font-medium hidden md:table-cell">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">
                      Purchase Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">
                      Delivery Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.order_id} className="group hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {order.order_id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-3">
                          <OrderImage order={order} />
                          <span className="font-medium line-clamp-1">
                            {order.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 hidden md:table-cell">
                        {Array.isArray(order.items)
                          ? order.items.reduce(
                              (acc, item) => acc + item.quantity,
                              0
                            )
                          : 0}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        ₹{order.toatal_amount}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-right">
                        <a
                          href={`/admin/order-details/${order.order_id}`}
                          className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
