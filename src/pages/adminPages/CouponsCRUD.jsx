import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import Loader from "../../components/common/Loader";
import {
  createCoupon,
  getCouponById,
  updateCoupon,
} from "../../services/adminApiService";
import { showToast } from "../../components/utils/toast";

export default function CouponsCRUD() {
  const [formData, setFormData] = useState({
    coupon_code: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase_amount: "",
    max_discount_amount: "",
    start_date: "",
    expiry_date: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const couponId = location.state;

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().slice(0, 10);

    if (!formData.coupon_code) {
      newErrors.coupon_code = "Coupon code is required.";
    }

    if (!formData.discount_value || isNaN(formData.discount_value)) {
      newErrors.discount_value = "Valid discount value is required.";
    }

    if (!formData.min_purchase_amount || isNaN(formData.min_purchase_amount)) {
      newErrors.min_purchase_amount =
        "Valid minimum purchase amount is required.";
    }

    if (!formData.max_discount_amount || isNaN(formData.max_discount_amount)) {
      newErrors.max_discount_amount =
        "Valid maximum discount amount is required.";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required.";
    } else if (formData.start_date < today) {
      newErrors.start_date = "Start date cannot be in the past.";
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = "Expiry date is required.";
    } else if (formData.expiry_date <= formData.start_date) {
      newErrors.expiry_date = "Expiry date must be after the start date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (couponId) {
        await updateCoupon(couponId, formData);
        showToast("success", "Coupon updated successfully!");
      } else {
        await createCoupon(formData);
        showToast("success", "Coupon created successfully!");
      }
      navigate("/admin/coupons");
    } catch (error) {
      showToast("error", "Error saving coupon!");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCouponById = async () => {
      setIsSubmitting(true);
      try {
        const response = await getCouponById(couponId);
        setFormData(response);
      } catch (error) {
        setIsSubmitting(false);
        console.error("An error occurred while fetching data", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (couponId) {
      fetchCouponById();
    }
  }, [couponId]);

  {
    isSubmitting && <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-800">
            {couponId ? "Edit Coupon" : "Add New Coupon"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/coupons")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 flex items-center gap-2"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Check size={20} />
                  {couponId ? "Update Coupon" : "Add Coupon"}
                </>
              )}
            </button>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code
            </label>
            <input
              type="text"
              name="coupon_code"
              value={formData.coupon_code}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.coupon_code && (
              <p className="text-red-500 text-sm mt-1">{errors.coupon_code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value
            </label>
            <input
              type="number"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.discount_value && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount_value}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Purchase Amount
            </label>
            <input
              type="number"
              name="min_purchase_amount"
              value={formData.min_purchase_amount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.min_purchase_amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.min_purchase_amount}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Discout Amount
            </label>
            <input
              type="number"
              name="max_discount_amount"
              value={formData.max_discount_amount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.max_discount_amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.max_discount_amount}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={
                formData.start_date
                  ? new Date(formData.start_date).toISOString().slice(0, 10)
                  : new Date().toISOString().slice(0, 10)
              }
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={
                formData.expiry_date
                  ? new Date(formData.expiry_date).toISOString().slice(0, 10)
                  : new Date().toISOString().slice(0, 10)
              }
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.expiry_date && (
              <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>
        </form>
      </div>
    </div>
  );
}
