// import React from "react";
import { addToCart } from "../../services/userApiServices";
import { showToast } from "../utils/toast";

const AddToCart = ({ product, qty = 1 }) => {
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      const response = await addToCart(product.id, qty);
      showToast("success", "Item Successfully added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <>
      {product.product_count > 0 && product.product_status ? (
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-sliderBg hover:bg-sliderHover hover:text-black text-white py-2 rounded-md hover:shadow-xl"
        >
          Add to Cart
        </button>
      ) : (
        <button
          disabled
          className="mt-4 w-full bg-[#7ebeb5] hover:bg-[#607a76] text-black hover:text-white py-2 rounded-md hover:shadow-xl"
        >
          Sold Out
        </button>
      )}
    </>
  );
};

export default AddToCart;
