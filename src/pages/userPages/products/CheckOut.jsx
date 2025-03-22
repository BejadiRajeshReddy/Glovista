import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AddressByUserId } from "../../../services/userApiServices";
import { useSelector } from "react-redux";

import { getCoupon, getOffers } from "../../../services/adminApiService";
import AddressList from "../../../components/userSide/AddressList";
import Loader from "../../../components/common/Loader";
import { createOrder } from "../../../services/paymentApiService";
import { showToast } from "../../../components/utils/toast";
import OffersSection from "../../../components/userSide/OffersSection";
import CouponsSection from "../../../components/userSide/CouponsSection";
import PaymentSection from "../../../components/userSide/PaymentSection";
import OrderSummary from "../../../components/userSide/OrderSummary";
import {
  createShipRocketOrder,
  generateAWB,
} from "../../../services/trackingApiService";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [userAddress, setUserAddress] = useState([]);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state;

  // Calculate subtotal based on product or kit price
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product
      ? item.product.product_price
      : item.kits_combo.total_price;
    return sum + item.quantity * price;
  }, 0);

  const deliveryFee = subtotal > 499 ? 0 : 15;

  // Validate discount rules
  const validateDiscount = (coupon, offer, subtotal) => {
    if (!coupon || !offer) return true;

    const couponDiscount =
      coupon.discount_type === "percentage"
        ? Math.min(
            (subtotal * coupon.discount_value) / 100,
            coupon.max_discount_amount
          )
        : coupon.discount_value;

    const offerDiscount =
      offer.offer_type === "percentage"
        ? Math.min(
            (subtotal * offer.offer_value) / 100,
            offer.max_discount_amount
          )
        : offer.offer_value;

    const totalDiscount =
      parseFloat(couponDiscount) + parseFloat(offerDiscount);
    const maxAllowedDiscount = subtotal * 0.3;

    return totalDiscount <= maxAllowedDiscount;
  };

  // Calculate total discount
  const calculateDiscount = () => {
    let discount = 0;

    if (appliedCoupon && subtotal > (appliedCoupon.min_purchase_amount || 0)) {
      if (appliedCoupon.discount_type === "percentage") {
        const amount = (subtotal * appliedCoupon.discount_value) / 100;
        discount += Math.min(amount, appliedCoupon.max_discount_amount);
      } else {
        discount += parseInt(appliedCoupon.discount_value);
      }
    }

    if (appliedOffer && subtotal > (appliedOffer.min_purchase_amount || 0)) {
      if (appliedOffer.offer_type === "percentage") {
        const amount = (subtotal * appliedOffer.offer_value) / 100;
        discount += Math.min(amount, appliedOffer.max_discount_amount);
      } else {
        discount += parseInt(appliedOffer.offer_value);
      }
    }

    let greaterMaxDiscount = null;
    if (appliedCoupon && appliedOffer) {
      greaterMaxDiscount = Math.max(
        appliedCoupon.max_discount_amount,
        appliedOffer.max_discount_amount
      );
    } else if (appliedCoupon) {
      greaterMaxDiscount = appliedCoupon.max_discount_amount;
    } else if (appliedOffer) {
      greaterMaxDiscount = appliedOffer.max_discount_amount;
    }

    if (greaterMaxDiscount !== null && discount > greaterMaxDiscount) {
      discount = greaterMaxDiscount;
    }

    const maxAllowedDiscount = subtotal * 0.3;
    if (appliedCoupon && appliedOffer && discount > maxAllowedDiscount) {
      discount = maxAllowedDiscount;
    }

    return discount;
  };

  const discount = calculateDiscount();
  const total = (subtotal - discount + deliveryFee).toFixed(2);

  const userData = useSelector((state) => state?.auth?.userInfo || {});

  // Fetch user address
  useEffect(() => {
    const fetchUserAddressData = async () => {
      setIsLoading(true);
      try {
        const response = await AddressByUserId(userData.user_id);
        setUserAddress(response);
      } catch (error) {
        console.log(error, "Error fetching user address");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAddressData();
  }, [userData]);

  // Set default selected address
  useEffect(() => {
    if (userAddress.length > 0) {
      setSelectedAddress(userAddress[0]);
    }
  }, [userAddress]);

  // Apply coupon
  const handleApplyCoupon = (coupon) => {
    if (subtotal < coupon.min_purchase_amount) {
      return showToast(
        "error",
        `The total should be above ${coupon.min_purchase_amount}`
      );
    }

    if (!validateDiscount(coupon, appliedOffer, subtotal)) {
      return showToast(
        "error",
        "This coupon cannot be stacked with the applied offer."
      );
    }

    setAppliedCoupon(coupon);
    showToast("success", `Coupon ${coupon.coupon_code} applied successfully!`);
  };

  // Apply offer
  const handleApplyOffer = (offer) => {
    if (subtotal < offer.min_purchase_amount) {
      return showToast(
        "error",
        `The purchase should be above ${offer.min_purchase_amount}`
      );
    }

    if (!validateDiscount(appliedCoupon, offer, subtotal)) {
      return showToast(
        "error",
        "This offer cannot be stacked with the applied coupon."
      );
    }

    setAppliedOffer(offer);
    showToast("success", `Offer ${offer.offer_name} applied successfully!`);
  };

  // Handle COD payment
  const handleCod = async () => {
    setIsLoading(true);
    if (!selectedAddress) {
      return showToast("error", "Please select an address for delivery");
    }

    const orderData = {
      user: userData.user_id,
      subtotal: subtotal,
      discount: discount,
      delivery_fee: deliveryFee,
      total_amount: total,
      address: JSON.parse(JSON.stringify(selectedAddress)),
      payment_method: "cod",
      order_status: "confirmed",
    };

    try {
      const response = await createOrder(orderData);

      if (response) {
        const data = response;
        showToast("success", "Order placed successfully!");
        await createOrderForShipRocket(response, selectedAddress);
        navigate("/order_confirmation", { state: { order: data } });
      } else {
        const errorData = await response.json();
        console.error("Error placing order:", errorData);
        showToast("error", "Failed to place order. Please try again.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create ShipRocket order
  const createOrderForShipRocket = async (order, address) => {
    const orderedAddress = address;

    const orderPayload = {
      order_id: order.order_id,
      order_date: new Date().toISOString(),
      pickup_location: "Office",
      billing_customer_name: orderedAddress.name,
      billing_last_name: "",
      billing_address: orderedAddress.area_address,
      billing_city: orderedAddress.city,
      billing_pincode: orderedAddress.zip_code,
      billing_state: orderedAddress.state,
      billing_country: "India",
      billing_email: orderedAddress.email,
      billing_phone: orderedAddress.primary_number,
      shipping_is_billing: true,
      order_items: cartItems.map((item) => ({
        name: item.product
          ? item.product.product_name
          : item.kits_combo.kit_name,
        sku: item.product ? item.product.id : item.kits_combo.id,
        units: item.quantity,
        selling_price: item.product
          ? item.product.product_price
          : item.kits_combo.total_price,
        discount: item.discount || 0,
        tax: item.tax || 12,
        hsn: item.hsn || 3304,
      })),
      payment_method: paymentMethod,
      shipping_charges: 0,
      total_discount: discount,
      sub_total: subtotal,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    try {
      const respnose = await createShipRocketOrder(orderPayload);

      await generateAWB(respnose.shipment_id);
    } catch (error) {
      console.error("ShipRocket Order Error:", error);
    }
  };

  // Fetch offers and coupons
  useEffect(() => {
    const fetchOffersAndCoupons = async () => {
      setIsLoading(true);
      try {
        const offers = await getOffers();
        const coupons = await getCoupon();

        if (coupons) {
          setAvailableCoupons(coupons);
        }

        if (offers) {
          setAvailableOffers(offers);
        }
      } catch (error) {
        console.log("Error fetching offers and coupons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffersAndCoupons();
  }, []);

  const onSuccess = async (data) => {
    try {
      await createOrderForShipRocket(data, selectedAddress);
      navigate("/order_confirmation", { state: { order: data } });
    } catch (error) {
      showToast("error", "Payment failed. Please try again.");
      console.error("Failed to create order in ShipRocket:", error);
    }
  };

  const onFailure = async (data) => {
    showToast("error", "Payment failed. Please try again.");
    console.log(data);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-gray-700">
            Cart
          </Link>
          <span>/</span>
          <span>Checkout</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light">CHECKOUT</h1>
          <Link to="/cart">
            <button className="flex items-center text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 ">
          <div className="lg:col-span-8 space-y-8">
            <AddressList
              userAddress={userAddress}
              setUserAddress={setUserAddress}
              userData={userData}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
            <OffersSection
              appliedOffer={appliedOffer}
              availableOffers={availableOffers}
              handleApplyOffer={handleApplyOffer}
            />
            <CouponsSection
              appliedCoupon={appliedCoupon}
              availableCoupons={availableCoupons}
              handleApplyCoupon={handleApplyCoupon}
            />

            <PaymentSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <OrderSummary
            appliedCoupon={appliedCoupon}
            appliedOffer={appliedOffer}
            cartItems={cartItems}
            paymentMethod={paymentMethod}
            setAppliedCoupon={setAppliedCoupon}
            setAppliedOffer={setAppliedOffer}
            subtotal={subtotal}
            discount={discount}
            deliveryFee={deliveryFee}
            total={total}
            handleCod={handleCod}
            userData={userAddress}
            isLoading={isLoading}
            onSuccess={onSuccess}
            onFailure={onFailure}
            selectedAddress={selectedAddress}
          />
        </div>
      </div>
    </>
  );
}
