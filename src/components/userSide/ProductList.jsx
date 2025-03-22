import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddToCart from "./AddToCart";
import { getOffers } from "../../services/adminApiService";

const ProductList = ({ filteredProducts }) => {
  const [offers, setOffers] = useState([]);

  const location = useLocation();
  const path = location.pathname;
  const isNotHome = path !== "/";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersData = await getOffers();
        console.log("Offers Data:", offersData); // Check structure
        setOffers(Array.isArray(offersData) ? offersData : []);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  const getDiscountedPrice = (product) => {
    if (!Array.isArray(offers) || offers.length === 0) {
      return null; // No offers available, skip discount logic
    }

    const applicableOffer = offers.find(
      (offer) =>
        Array.isArray(offer.applicable_categories) &&
        offer.applicable_categories.some(
          (category) => category.id === product.category
        )
    );

    if (applicableOffer) {
      const { offer_type, offer_value, max_discount_amount } = applicableOffer;

      let discountedPrice = product.product_price;

      if (offer_type === "percentage") {
        const discountAmount = (product.product_price * offer_value) / 100;
        discountedPrice = Math.max(
          product.product_price -
            Math.min(discountAmount, max_discount_amount || discountAmount),
          0
        );
      } else if (offer_type === "fixed") {
        discountedPrice = Math.max(product.product_price - offer_value, 0);
      }

      return discountedPrice.toFixed(2);
    }

    return null;
  };

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const discountedPrice = getDiscountedPrice(product);
          return (
            <div
              key={product.id}
              onClick={() => navigate("/productDetails", { state: product.id })}
              className="border border-navBg rounded-lg shadow-md hover:shadow-xl transition"
            >
              <div
                className={`bg-navBg p-[1px] ${
                  isNotHome ? "h-64" : "h-[22rem]"
                }`}
              >
                <img
                  src={product.images[0].image}
                  alt={product.product_name}
                  className="w-full object-cover h-full rounded-md"
                />
                <p className="text-sm uppercase h-8 text-center p-3">
                  {product.product_skinType}
                </p>
              </div>
              <div className="p-4 h-40">
                <h3 className="font-bold text-lg h-fit">
                  {product.product_name.length > 50
                    ? product.product_name.slice(0, 50) + "..."
                    : product.product_name}
                </h3>

                <p className="text-green-700 text-base font-semibold">
                  {product.product_subtitle}
                </p>

                <span className="text-base text-black h-fit flex gap-2">
                  <p className="">4.69 </p>
                  <Star className="w-5 h-5 fill-yellow-800 text-yellow-800" />{" "}
                  <p className="">656 Reviews </p>
                </span>

                <p
                  className={`h-6 font-semibold mt-2 ${
                    discountedPrice ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {discountedPrice ? (
                    <>
                      <span className="line-through text-gray-500">
                        Rs. {product.product_price}
                      </span>{" "}
                      Rs. {discountedPrice}
                    </>
                  ) : (
                    `Rs. ${product.product_price}`
                  )}
                </p>
              </div>
              <div className="p-2">
                <AddToCart product={product} />
              </div>
            </div>
          );
        })}
      </div>
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
