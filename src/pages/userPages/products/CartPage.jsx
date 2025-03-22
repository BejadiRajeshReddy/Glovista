import React, { useEffect, useState } from "react";
import { Minus, Plus, ArrowRight, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import {
  getCart,
  deleteFromCart,
  updateCart,
} from "../../../services/userApiServices";
import Loader from "../../../components/common/Loader";
import { showToast } from "../../../components/utils/toast";
import { deleteKitFromCart } from "../../../services/kitsCompoApiService";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState({});

  const navigate = useNavigate();

  const handleQuantityChange = async (id, change, type) => {
    const item = cartItems.find((item) =>
      type === "product" ? item.product?.id === id : item.kits_combo?.id === id
    );
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    try {
      await updateCart(id, newQuantity, type);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          (
            type === "product"
              ? item.product?.id === id
              : item.kits_combo?.id === id
          )
            ? {
                ...item,
                quantity: newQuantity,
                total_price:
                  newQuantity *
                  (type === "product"
                    ? item.product.product_price
                    : item.kits_combo.total_price),
              }
            : item
        )
      );

      setCart((prevCart) => ({
        ...prevCart,
        total:
          prevCart.total +
          change *
            (type === "product"
              ? item.product.product_price
              : item.kits_combo.discount_price),
      }));
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  };

  const handleRemoveItem = async (id, type) => {
    setIsLoading(true);
    try {
      if (type === "product") {
        await deleteFromCart(id);
      } else {
        await deleteKitFromCart(id);
      }
      setCartItems((prevItems) =>
        prevItems.filter((item) =>
          type === "product"
            ? item.product?.id !== id
            : item.kits_combo?.id !== id
        )
      );
      showToast("success", "Item deleted from cart!!!!");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        const response = await getCart();
        setCart(response);
        setCartItems(response.items || []);
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartData();
  }, []);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => {
      const price = item.product
        ? item.product.product_price
        : item.kits_combo.total_price;
      return acc + item.quantity * price;
    }, 0);
    setCart((prevCart) => ({ ...prevCart, total: newSubtotal }));
  }, [cartItems]);

  const subtotal = cart.total || 0;
  const deliveryFee = subtotal > 499 ? 0 : 15;
  const total = subtotal + deliveryFee;

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span>
        <span>Cart</span>
      </nav>

      <h1 className="text-3xl font-light mb-8">YOUR CART</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
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
                    className="object-cover w-full h-full"
                  />
                </div>
                <div
                  onClick={() =>
                    navigate(item.product ? "/productDetails" : "/kitDetails", {
                      state: item.product
                        ? item.product.id
                        : item.kits_combo.id,
                    })
                  }
                  className="flex-1 text-center sm:text-left cursor-pointer"
                >
                  <h3 className="font-medium">
                    {item.product
                      ? item.product.product_name
                      : item.kits_combo.kit_name}
                  </h3>
                  <div className="mt-2 font-medium">
                    <span className="font-sans">₹ </span>
                    {item.product
                      ? item.product.product_price
                      : item.kits_combo.total_price}
                  </div>
                  <div className="mt-2 font-medium">
                    {item.product
                      ? item.product.category_name
                      : item.kits_combo.subtitle}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() =>
                      handleQuantityChange(
                        item.product ? item.product.id : item.kits_combo.id,
                        -1,
                        item.product ? "product" : "kit"
                      )
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() =>
                      handleQuantityChange(
                        item.product ? item.product.id : item.kits_combo.id,
                        1,
                        item.product ? "product" : "kit"
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() =>
                      handleRemoveItem(
                        item.product ? item.product.id : item.kits_combo.id,
                        item.product ? "product" : "kit"
                      )
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    <span className="font-sans">₹ </span>
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    <span className="font-sans">₹ </span>
                    {deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">
                    <span className="font-sans">₹ </span>
                    {total.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={() => navigate("/checkout", { state: cartItems })}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Go to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
