import React from "react";
import RazorpayPayment from "./RazorpayPayment";

const OrderSummary = ({
  cartItems,
  appliedCoupon,
  appliedOffer,
  setAppliedCoupon,
  setAppliedOffer,
  paymentMethod,
  subtotal,
  discount,
  deliveryFee,
  total,
  handleCod,
  userData,
  onSuccess,
  isLoading,
  onFailure,
  selectedAddress,
}) => {
  return (
    <div className="lg:col-span-4 border rounded-lg h-fit">
      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
        <h2 className="text-xl font-medium mb-4">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex space-x-4">
              <div className="w-20 h-20 relative bg-gray-100 rounded-md">
                <img
                  src={
                    item.product
                      ? item.product.images[0]?.image || "/placeholder.svg"
                      : item.kits_combo.images[0]?.image || "/placeholder.svg"
                  }
                  alt={
                    item.product
                      ? item.product.product_name
                      : item.kits_combo.kit_name
                  }
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">
                  {item.product
                    ? item.product.product_name
                    : item.kits_combo.kit_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.product
                    ? item.product.category_name
                    : item.kits_combo.subtitle}
                </p>
                <p className="font-medium mt-1">
                  <span className="font-sans">₹ </span>
                  {item.product
                    ? item.product.product_price * item.quantity
                    : item.kits_combo.total_price * item.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t pt-4">
          {appliedCoupon && (
            <div className="flex justify-between pb-4 items-center">
              <span className="text-green-500">
                Coupon Applied ({appliedCoupon.code})
              </span>
              <button
                onClick={() => setAppliedCoupon(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
          {appliedOffer && (
            <div className="flex justify-between items-center">
              <span className="text-green-500">
                Offer Applied ({appliedOffer.name})
              </span>
              <button
                onClick={() => setAppliedOffer(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              <span className="font-sans">₹ </span>
              {subtotal}
            </span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Discount</span>
            <span>
              -<span className="font-sans">₹ </span>
              {discount.toFixed(2)}
            </span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-500">
              <span>Coupon Applied ({appliedCoupon.coupon_code})</span>
              {appliedCoupon.discount_type === "fixed" ? (
                <span>
                  <span className="font-sans">₹ </span>
                  {parseInt(appliedCoupon.discount_value).toFixed(2)}
                </span>
              ) : (
                <span>
                  %{parseInt(appliedCoupon.discount_value).toFixed(2)}
                </span>
              )}
            </div>
          )}
          {appliedOffer && (
            <div className="flex justify-between text-green-500">
              <span>Offer Applied ({appliedOffer.offer_code})</span>
              {appliedOffer.offer_type === "fixed" ? (
                <span>
                  <span className="font-sans">₹ </span>
                  {parseInt(appliedOffer.offer_value).toFixed(2)}
                </span>
              ) : (
                <span>%{parseInt(appliedOffer.offer_value).toFixed(2)}</span>
              )}
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">
              <span className="font-sans">₹ </span>
              {deliveryFee}
            </span>
          </div>
          <div className="border-t pt-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              <span className="font-sans">₹ </span>
              {total}
            </span>
          </div>
        </div>

        {paymentMethod === "razor" ? (
          <RazorpayPayment
            amount={total}
            userData={userData}
            delivery_fee={deliveryFee}
            discount={discount}
            subtotal={subtotal}
            onSuccess={onSuccess}
            onFailure={onFailure}
            address={selectedAddress}
          />
        ) : (
          <button
            onClick={handleCod}
            disabled={isLoading || total === 0}
            className="w-full mt-6 bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md"
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
