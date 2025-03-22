import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "../utils/Cn";

export default function ShipmentTracking({ sampleTrackingData }) {
  const [trackingInfo, setTrackingInfo] = useState({
    shipment_track: [],
    shipment_track_activities: [],
    tracking_data: {},
    shipment_status: 2,
  });

  console.log(sampleTrackingData);

  useEffect(() => {
    setTrackingInfo(sampleTrackingData);
  }, [sampleTrackingData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "DLVD":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "OFD":
        return <Truck className="h-5 w-5 text-green-500" />;
      case "RAD":
        return <MapPin className="h-5 w-5 text-blue-500" />;
      case "IT":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "PKD":
      case "PUD":
        return <Package className="h-5 w-5 text-primary" />;
      case "OFP":
        return <ArrowRight className="h-5 w-5 text-amber-500" />;
      case "DRC":
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "DLVD":
        return "border-green-600 bg-green-50 dark:bg-green-900/20";
      case "OFD":
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      case "RAD":
      case "IT":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "PKD":
      case "PUD":
        return "border-primary bg-primary/5";
      case "OFP":
        return "border-amber-500 bg-amber-50 dark:bg-amber-900/20";
      default:
        return "border-gray-300 bg-gray-50 dark:bg-gray-800/50";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return { date: formattedDate, time: formattedTime };
  };

  const getShipmentStatusText = (status) => {
    switch (status) {
      case 7:
        return "Delivered";
      case 6:
        return "Out for Delivery";
      case 5:
        return "In Transit";
      case 4:
        return "Picked Up";
      case 3:
        return "Ready for Pickup";
      case 2:
        return "Processing";
      case 1:
        return "Order Placed";
      default:
        return "Processing";
    }
  };

  const truncateActivity = (activity, maxLength = 80) => {
    if (activity.length <= maxLength) return activity;
    return activity.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Shipment Tracking
            </h3>
            {trackingInfo?.shipment_track?.[0]?.awb_code && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                AWB:{" "}
                <span className="font-medium">
                  {trackingInfo.shipment_track[0].awb_code}
                </span>
              </p>
            )}
          </div>
          <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {getShipmentStatusText(trackingInfo.shipment_status)}
          </div>
        </div>

        {trackingInfo.shipment_track_activities.length > 0 ? (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            <ul className="space-y-5">
              {trackingInfo.shipment_track_activities.map((activity, index) => {
                const { date, time } = formatDate(activity.date);
                return (
                  <li key={index} className="relative pl-14">
                    <div
                      className={cn(
                        "absolute left-2 p-2 rounded-full z-10",
                        index === 0
                          ? "bg-green-100 dark:bg-green-900/30"
                          : index ===
                            trackingInfo.shipment_track_activities.length - 1
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      )}
                    >
                      {getStatusIcon(activity.status)}
                    </div>

                    <div
                      className={cn(
                        "rounded-lg p-4 border-l-4 transition-all",
                        getStatusColorClass(activity.status)
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {activity.status === "DLVD" ? (
                              <span className="text-green-600">
                                {activity.activity}
                              </span>
                            ) : (
                              activity.activity.split(" ")[0]
                            )}
                          </h4>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {date} • {time}
                          </div>
                        </div>

                        {activity.activity.includes(" ") &&
                          activity.status !== "DLVD" && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {truncateActivity(
                                activity.activity.substring(
                                  activity.activity.indexOf(" ") + 1
                                )
                              )}
                            </p>
                          )}

                        <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span className="truncate">{activity.location}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Tracking details not available.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Please check back later or contact customer support.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm">
            <div className="text-gray-500 dark:text-gray-400">
              Order ID:{" "}
              <span className="font-medium">
                {trackingInfo.shipment_track[0]?.order_id || "N/A"}
              </span>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Estimated Delivery:{" "}
              <span className="font-medium">
                {formatDate(trackingInfo.etd).date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
