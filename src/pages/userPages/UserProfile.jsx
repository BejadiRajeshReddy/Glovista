import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Profile from "../../components/userSide/Profile";
import Orders from "../../components/userSide/Orders";
import { MapPinned, Package, Truck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import TrackingByAwb from "../../components/userSide/TrackingByAwb";
import WalletComponent from "../../components/userSide/WalletComponent";
import ReferralComponent from "../../components/userSide/ReferralComponent";

function UserProfile() {
  const [selectedSection, setSelectedSection] = useState("profile");
  const userData = useSelector((state) => state?.auth?.userInfo || {});

  return (
    <>
      <div className="w-full bg-gray-100 min-h-screen px-4 -mt-2 sm:px-8 md:px-16 lg:px-24 xl:px-44 pb-10">
        <nav className="flex items-center pt-4 space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <span>/</span> &#160; Profile
        </nav>
        <div className="flex mb-6 bg-white rounded-lg shadow-md p-1">
          <button
            onClick={() => setSelectedSection("profile")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedSection === "profile"
                ? "bg-blue-500 text-white font-medium shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setSelectedSection("wallet")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedSection === "wallet"
                ? "bg-blue-500 text-white font-medium shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            My Wallet
          </button>
          <button
            onClick={() => setSelectedSection("referrals")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedSection === "referrals"
                ? "bg-blue-500 text-white font-medium shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Referrals
          </button>
          <button
            onClick={() => setSelectedSection("address")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedSection === "address"
                ? "bg-blue-500 text-white font-medium shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Address
          </button>
          <button
            onClick={() => setSelectedSection("orders")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedSection === "orders"
                ? "bg-blue-500 text-white font-medium shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setSelectedSection("tracking")}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              selectedSection === "tracking"
                ? "bg-blue-500 text-white font-medium shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tracking
          </button>
        </div>

        <div className="relative w-full min-h-fit overflow-visible">
          <TransitionGroup>
            <CSSTransition
              key={selectedSection}
              timeout={300}
              classNames="transition-item"
              unmountOnExit
            >
              <div className="w-full">
                {selectedSection === "address" && (
                  <Profile userData={userData} activeTab={selectedSection} />
                )}
                {selectedSection === "profile" && (
                  <Profile userData={userData} activeTab={selectedSection} />
                )}
                {selectedSection === "orders" && <Orders userData={userData} />}
                {selectedSection === "tracking" && <TrackingByAwb />}
                {selectedSection === "wallet" && <WalletComponent />}
                {selectedSection === "referrals" && <ReferralComponent />}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
