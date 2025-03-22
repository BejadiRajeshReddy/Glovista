import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus } from "lucide-react";
import Loader from "../../components/common/Loader";
import { deleteCoupon, getCoupon } from "../../services/adminApiService";
import { showToast } from "../../components/utils/toast";

export default function CouponsListing() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await getCoupon();
      setCoupons(response);
    } catch (error) {
      showToast("error", "Failed to fetch coupons");
      console.error("Error fetching coupons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (couponId) => {
    navigate(`/admin/coupons/add`, { state: couponId });
  };

  const handleDelete = async (couponId) => {
    const confirmDelete = toast(
      <div className="">
        <p>Are you sure you want to delete this Coupon?</p>
        <div className="flex space-x-2">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={async () => {
              toast.dismiss(confirmDelete);
              try {
                await deleteCoupon(couponId);
                showToast("success", "Coupon deleted successfully");
                fetchCoupons();
              } catch (error) {
                showToast("error", "Failed to delete coupon");
                console.error("Error deleting coupon:", error);
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={() => toast.dismiss(confirmDelete)}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleAddNew = () => {
    navigate("/admin/coupons/add");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Coupons</h1>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Coupon
          </button>
        </header>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupon Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Purchase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.coupon_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : `$${coupon.discount_value}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${coupon.min_purchase_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(coupon.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          coupon.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(coupon.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
