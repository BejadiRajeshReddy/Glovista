import React, { useState, useEffect } from "react";
import axios from "axios";
import ShipmentTracking from "./ShipmentTracking";
import { trackShipment } from "../../services/trackingApiService";

const TrackingByAwb = () => {
  const [awbNumber, setAwbNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentAwbSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveSearch = (awb) => {
    const updatedSearches = [
      { awb, timestamp: new Date().toISOString() },
      ...recentSearches.filter((item) => item.awb !== awb),
    ].slice(0, 5); // Keep only the 5 most recent

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentAwbSearches", JSON.stringify(updatedSearches));
  };

  const handleInputChange = (e) => {
    setAwbNumber(e.target.value.trim());
  };

  const handleTrackShipment = async () => {
    if (!awbNumber) {
      setError("Please enter an AWB number to track your shipment.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const response = await trackShipment(awbNumber);

      console.log(response);

      setTrackingData(response.tracking_data);
      saveSearch(awbNumber);
    } catch (err) {
      console.error("Tracking error:", err);
      setError(
        err.response?.data?.message ||
          "We couldn't find any information for this tracking number. Please verify and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearch = (awb) => {
    setAwbNumber(awb);
    // Auto-search after a short delay
    setTimeout(() => {
      setAwbNumber(awb);
      handleTrackShipment();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with illustration */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10 sm:py-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FFFFFF"
                  d="M47.5,-57.2C59.9,-45.8,67.4,-29.2,71.1,-11.5C74.8,6.2,74.7,25,66.3,39.2C57.9,53.5,41.1,63.2,23.5,68.8C5.9,74.4,-12.5,75.9,-29.1,70.2C-45.7,64.5,-60.5,51.7,-68.2,35.5C-75.9,19.2,-76.5,-0.5,-71.3,-18.1C-66.1,-35.7,-55,-51.2,-41,-60.4C-27,-69.6,-10.1,-72.5,4.2,-77.5C18.5,-82.5,35.1,-68.6,47.5,-57.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 relative">
              Track Your Shipment
            </h1>
            <p className="text-blue-100 max-w-lg relative">
              Enter your AWB (Air Waybill) number to get real-time updates on
              your package's journey.
            </p>
          </div>

          {/* Tracking form */}
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={awbNumber}
                  onChange={handleInputChange}
                  placeholder="Enter AWB Number"
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  aria-label="AWB Number"
                />
              </div>
              <button
                onClick={handleTrackShipment}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    Tracking...
                  </span>
                ) : (
                  "Track Shipment"
                )}
              </button>
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(item.awb)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
                    >
                      {item.awb}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
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
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="mt-8 space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}

            {/* Tracking results */}
            {trackingData && !loading && (
              <div className="mt-8">
                <ShipmentTracking sampleTrackingData={trackingData} />
              </div>
            )}

            {/* Tracking tips */}
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Tracking Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 mt-0.5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  AWB numbers are typically 10-12 digits long
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 mt-0.5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Tracking updates may take 24-48 hours to appear in the system
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 mt-0.5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  For additional assistance, contact our customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingByAwb;
