"use client";

import { useEffect, useState } from "react";
import {
  AddressByUserId,
  deleteAddressById,
  PostAddress,
  updateAddressById,
} from "../../services/userApiServices";

const Profile = ({ userData, activeTab }) => {
  const [userAddress, setUserAddress] = useState([]);
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    house_number: "",
    area_address: "",
    city: "",
    state: "",
    zip_code: "",
    primary_number: "",
    secondary_number: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchUserAddressData = async () => {
      try {
        const response = await AddressByUserId(userData.user_id);

        setUserAddress(response);
      } catch (error) {
        console.log(error, "Error fetching user address");
        showNotification("error", "Failed to load addresses");
      }
    };
    fetchUserAddressData();
  }, [userData]);

  useEffect(() => {
    if (userAddress.length > 0) {
      setUser({ username: userAddress[0].name, email: userAddress[0].email });
    }
  }, [userAddress]);

  useEffect(() => {
    if (editAddress) {
      setFormValues({
        name: editAddress.name || "",
        email: editAddress.email || "",
        house_number: editAddress.house_number || "",
        area_address: editAddress.area_address || "",
        city: editAddress.city || "",
        state: editAddress.state || "",
        zip_code: editAddress.zip_code || "",
        primary_number: editAddress.primary_number || "",
        secondary_number: editAddress.secondary_number || "",
      });
    }
  }, [editAddress]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.name) errors.name = "Full name is required";
    if (!formValues.email) errors.email = "Email is required";
    if (!formValues.house_number)
      errors.house_number = "House number is required";
    if (!formValues.area_address) errors.area_address = "Address is required";
    if (!formValues.city) errors.city = "City is required";
    if (!formValues.state) errors.state = "State is required";

    if (!formValues.zip_code) {
      errors.zip_code = "Zip code is required";
    } else if (!/^[0-9]{6}$/.test(formValues.zip_code)) {
      errors.zip_code = "Zip code must be 6 digits";
    }

    if (!formValues.primary_number) {
      errors.primary_number = "Primary number is required";
    } else if (!/^\d{10}$/.test(formValues.primary_number)) {
      errors.primary_number = "Primary number must be 10 digits";
    }

    if (!formValues.secondary_number) {
      errors.secondary_number = "Secondary number is required";
    } else if (!/^\d{10}$/.test(formValues.secondary_number)) {
      errors.secondary_number = "Secondary number must be 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      user: userData.user_id,
      ...formValues,
    };

    try {
      if (editAddress) {
        const res = await updateAddressById(editAddress.id, payload);
        setUserAddress((prev) =>
          prev.map((address) => (address.id === editAddress.id ? res : address))
        );
        showNotification("success", "Address updated successfully");
      } else {
        const res = await PostAddress(payload);
        if (userAddress.length > 0) {
          setUserAddress((prev) => [...prev, res]);
        } else {
          setUserAddress([res]);
        }
        showNotification("success", "Address added successfully");
      }

      setIsAddressFormOpen(false);
      setEditAddress(null);
      setFormValues({
        name: "",
        email: "",
        house_number: "",
        area_address: "",
        city: "",
        state: "",
        zip_code: "",
        primary_number: "",
        secondary_number: "",
      });
    } catch (error) {
      console.log(error);
      showNotification("error", "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddressById(addressId);
      setUserAddress((prev) =>
        prev.filter((address) => address.id !== addressId)
      );
      showNotification("success", "Address deleted successfully");
      setIsModalOpen(false);
    } catch (error) {
      showNotification("error", "Failed to delete address");
    }
  };

  const handleEdit = (address) => {
    setEditAddress(address);
    setIsAddressFormOpen(true);
    setIsModalOpen(false);
  };

  const openAddressModal = (address) => {
    setEditAddress(address);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-100 border-l-4 border-green-500 text-green-700"
                : "bg-red-100 border-l-4 border-red-500 text-red-700"
            } animate-fade-in`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section  */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10 sm:py-12 text-white">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold">
                    {user.username || "User"}
                  </h1>
                  <p className="text-blue-100">
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Account Information
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {user.username || "Not provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {user.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Account Created
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {userData.created_at
                      ? new Date(userData.created_at).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              {/* {/* <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Account Settings
                </h2>

                <div className="space-y-4">
                  <button className="w-full sm:w-auto px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile
                  </button>

                  <button className="w-full sm:w-auto px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Change Password
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* Address Section  */}
        {activeTab === "address" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  My Addresses
                </h2>
                <button
                  onClick={() => {
                    setEditAddress(null);
                    setIsAddressFormOpen(true);
                    setFormValues({
                      name: "",
                      email: "",
                      house_number: "",
                      area_address: "",
                      city: "",
                      state: "",
                      zip_code: "",
                      primary_number: "",
                      secondary_number: "",
                    });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Address
                </button>
              </div>

              {userAddress.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No addresses found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add a new address to get started
                  </p>
                  <button
                    onClick={() => {
                      setEditAddress(null);
                      setIsAddressFormOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userAddress.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group"
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openAddressModal(address)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="mb-3 pb-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">
                          {address.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{address.email}</p>
                      </div>

                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          {address.house_number}, {address.area_address}
                        </p>
                        <p>
                          {address.city}, {address.state} - {address.zip_code}
                        </p>
                        <p className="pt-2 border-t border-gray-100 mt-2">
                          <span className="font-medium">Phone:</span>{" "}
                          {address.primary_number}
                          {address.secondary_number &&
                            `, ${address.secondary_number}`}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-2">
                        <button
                          onClick={() => handleEdit(address)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {isAddressFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[70vh] mt-40 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={() => setIsAddressFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House Number
                  </label>
                  <input
                    type="text"
                    name="house_number"
                    value={formValues.house_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.house_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.house_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.house_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formValues.zip_code}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.zip_code ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.zip_code && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.zip_code}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="area_address"
                    value={formValues.area_address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.area_address
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  ></textarea>
                  {formErrors.area_address && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.area_address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formValues.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formValues.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Number
                  </label>
                  <input
                    type="text"
                    name="primary_number"
                    value={formValues.primary_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.primary_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.primary_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.primary_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Number
                  </label>
                  <input
                    type="text"
                    name="secondary_number"
                    value={formValues.secondary_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.secondary_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.secondary_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.secondary_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddressFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : editAddress ? (
                    "Update Address"
                  ) : (
                    "Add Address"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Details Modal */}
      {isModalOpen && editAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Address Details
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p className="text-gray-800">{editAddress.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-gray-800">{editAddress.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-gray-800">
                    {editAddress.house_number}, {editAddress.area_address}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    City, State, Zip
                  </h3>
                  <p className="text-gray-800">
                    {editAddress.city}, {editAddress.state} -{" "}
                    {editAddress.zip_code}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Phone Numbers
                  </h3>
                  <p className="text-gray-800">
                    Primary: {editAddress.primary_number}
                    {editAddress.secondary_number && (
                      <>
                        <br />
                        Secondary: {editAddress.secondary_number}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleDelete(editAddress.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(editAddress)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
