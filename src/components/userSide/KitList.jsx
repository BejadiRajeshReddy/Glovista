import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Package, Tag } from "lucide-react";
import { useState } from "react";
import { addKitToCart } from "../../services/kitsCompoApiService";
import { showToast } from "../utils/toast";

const KitsList = ({ kits }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleKitClick = (kitId) => {
    navigate("/kitDetails", { state: kitId });
  };

  const handleAddToCart = async (kit) => {
    setIsLoading(true);
    try {
      await addKitToCart(kit.id, 1);
      showToast("success", "Item Added to Cart successfully");
    } catch (error) {
      console.log("Error Adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kits.map((kit) => {
        const hasDiscount = kit.discount_price > 0;
        const originalPrice = kit.total_price + kit.discount_price;
        const discountPercentage = hasDiscount
          ? Math.round((kit.discount_price / originalPrice) * 100)
          : 0;

        return (
          <div
            key={kit.id}
            onClick={() => handleKitClick(kit.id)}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Image container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {kit.images && kit.images.length > 0 ? (
                <img
                  src={kit.images[0].image || "/placeholder.svg"}
                  alt={kit.kit_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Package size={48} className="text-gray-400" />
                </div>
              )}

              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </div>
              )}

              {/* Product count badge */}
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Package size={12} className="mr-1" />
                {kit.products.length}{" "}
                {kit.products.length === 1 ? "product" : "products"}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              {/* Category */}
              {kit.category && (
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <Tag size={12} className="mr-1" />
                  {kit.category.category_name}
                </div>
              )}

              {/* Title */}
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1 line-clamp-2">
                {kit.kit_name}
              </h3>

              {/* Subtitle */}
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {kit.subtitle}
              </p>

              {/* Rating placeholder - you can replace with actual ratings if available */}
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  4.0 (24 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-auto">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(kit.total_price)}
                  </span>

                  {hasDiscount && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>

                {/* Stock indicator */}
                <div className="mt-1 flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      kit.stock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span className="text-xs text-gray-500">
                    {kit.stock > 0 ? `In stock (${kit.stock})` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to cart button */}
            <div className="px-4 pb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(kit);
                }}
                disabled={kit.stock <= 0}
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors
                  ${
                    kit.stock > 0
                      ? " bg-sliderBg hover:bg-sliderHover hover:text-black text-white "
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <ShoppingCart size={16} />
                {kit.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KitsList;
