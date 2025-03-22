import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, XCircle } from "lucide-react";
import Loader from "../../components/common/Loader";
import { showToast } from "../../components/utils/toast";
import { toast } from "react-toastify";
import {
  createOffer,
  deleteOffer,
  editOffer,
  getCategory,
  getOfferById,
} from "../../services/adminApiService";

export default function OffersCRUD() {
  const [formData, setFormData] = useState({
    offer_name: "",
    offer_code: "",
    offer_type: "percentage",
    offer_value: 0,
    min_purchase_amount: 0,
    max_discount_amount: 0,
    start_date: "",
    expiry_date: "",
    applicable_categories: [],
    is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setisLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const offerId = location.state;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategory();
        setCategories(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error Fetching Categories: ", error);
        showToast("error", "Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (formData.offer_name.trim() === "") {
      newErrors.offer_name = "Offer name is required.";
    }

    if (formData.offer_code.trim() === "") {
      newErrors.offer_code = "Offer code is required.";
    }

    if (formData.offer_type.trim() === "") {
      newErrors.offer_type = "Offer type is required.";
    }

    if (isNaN(formData.offer_value) || formData.offer_value <= 0) {
      newErrors.offer_value = "Valid offer value is required.";
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

    if (formData.applicable_categories.length < 1) {
      newErrors.applicable_categories =
        "At least one category must be selected.";
    }

    if (
      isNaN(formData.min_purchase_amount) ||
      formData.min_purchase_amount <= 0
    ) {
      newErrors.min_purchase_amount =
        "Valid minimum purchase amount is required.";
    }

    if (
      formData.offer_type === "percentage" &&
      (isNaN(formData.max_discount_amount) || formData.max_discount_amount <= 0)
    ) {
      newErrors.max_discount_amount = "Valid max discount amount is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  }, []);

  const handleCategoryChange = (categoryId) => {
    setFormData((prevData) => {
      const updatedCategories = prevData.applicable_categories.includes(
        categoryId
      )
        ? prevData.applicable_categories.filter((id) => id !== categoryId)
        : [...prevData.applicable_categories, categoryId];
      return {
        ...prevData,
        applicable_categories: updatedCategories,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return showToast("error", "Fill All the fields correctly");
    }

    setisLoading(true);

    try {
      if (offerId) {
        await editOffer(offerId, formData);
        showToast("success", "Offer updated successfully!");
      } else {
        await createOffer(formData);
        showToast("success", "Offer created successfully!");
      }
      navigate("/admin/offers");
    } catch (error) {
      showToast("error", "Error saving offer!");
      console.error("Error:", error);
    } finally {
      setisLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    const confirmDelete = toast(
      <div className="">
        <p>Are you sure you want to delete this offer?</p>
        <div className="flex space-x-2">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={async () => {
              toast.dismiss(confirmDelete);
              setisLoading(true);
              try {
                await deleteOffer(offerId);
                navigate("/admin/offers");
                showToast("success", "offer deleted successfully");
              } catch (error) {
                showToast("error", "Failed to delete offer");
                console.error("Error deleting offer:", error);
              } finally {
                setisLoading(false);
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

  useEffect(() => {
    const fetchOfferById = async () => {
      try {
        const response = await getOfferById(offerId);
        setFormData(response);
      } catch (error) {
        console.error("An error occurred while fetching offer data", error);
      }
    };

    if (offerId) {
      fetchOfferById();
    }
  }, [offerId]);

  {
    isLoading && <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-800">
            {offerId ? "Edit Offer" : "Add New Offer"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/offers")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 flex items-center gap-2"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Check size={20} />
                  {offerId ? "Update Offer" : "Add Offer"}
                </>
              )}
            </button>
            {offerId && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 flex items-center gap-2"
              >
                <XCircle size={20} />
                Delete
              </button>
            )}
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Name
            </label>
            <input
              type="text"
              name="offer_name"
              value={formData.offer_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.offer_name && (
              <p className="text-red-500 text-sm mt-1">{errors.offer_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Code
            </label>
            <input
              type="text"
              name="offer_code"
              value={formData.offer_code}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.offer_code && (
              <p className="text-red-500 text-sm mt-1">{errors.offer_code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Type
            </label>
            <select
              name="offer_type"
              value={formData.offer_type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Value
            </label>
            <input
              type="number"
              name="offer_value"
              value={formData.offer_value}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.offer_value && (
              <p className="text-red-500 text-sm mt-1">{errors.offer_value}</p>
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

          {formData.offer_type === "percentage" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount Amount
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
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
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
              type="datetime-local"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            {errors.expiry_date && (
              <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applicable Categories
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={formData.applicable_categories.includes(
                      category.id
                    )}
                    onChange={() => handleCategoryChange(category.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm text-gray-700"
                  >
                    {category.category_name}
                  </label>
                </div>
              ))}
            </div>
            {errors.applicable_categories && (
              <p className="text-red-500 text-sm mt-1">
                {errors.applicable_categories}
              </p>
            )}
          </div>

          <div className="">
            <label className="block text-sm font-medium mb-2 text-gray-700 ">
              Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                {formData.is_active ? "Active" : "Expired"}
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
