"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Package,
  Truck,
  RefreshCw,
  Shield,
  Minus,
  Plus,
  Info,
} from "lucide-react";
import {
  addKitToCart,
  getKitById,
  getKitsCompo,
} from "../../services/kitsCompoApiService";

const KitDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const kitId = location.state;

  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedKits, setRelatedKits] = useState([]);

  useEffect(() => {
    const fetchKitDetails = async () => {
      setLoading(true);
      try {
        const kitData = await getKitById(kitId);
        setKit(kitData);
        const related = await getKitsCompo();

        // setRelatedKits(related || []);
        // }
      } catch (err) {
        console.error("Error fetching kit details:", err);
        setError("Failed to load kit details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (kitId) {
      fetchKitDetails();
    } else {
      setError("Kit not found");
      setLoading(false);
    }
  }, [kitId]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (kit?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addKitToCart(kit.id, 1);
      showToast("success", "Item Added to Cart successfully");
    } catch (error) {
      console.log("Error Adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-gray-200 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mt-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Info className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Kit Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            {error ||
              "The kit you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/kits")}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
          >
            Browse All Kits
          </button>
        </div>
      </div>
    );
  }

  // Calculate discount information
  const hasDiscount = kit.discount_price > 0;
  const originalPrice = kit.total_price + kit.discount_price;
  const discountPercentage = hasDiscount
    ? Math.round((kit.discount_price / originalPrice) * 100)
    : 0;

  // Check if kit is in stock
  const isInStock = kit.stock > 0;
  const lowStock = isInStock && kit.stock < 5;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/kits" className="hover:text-primary transition-colors">
            Kits & Combos
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900 truncate max-w-xs">
            {kit.kit_name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100 relative">
              {kit.images && kit.images.length > 0 ? (
                <img
                  src={
                    kit.images[activeImageIndex]?.image || "/placeholder.svg"
                  }
                  alt={`${kit.kit_name} - Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={64} className="text-gray-400" />
                </div>
              )}

              {/* Navigation arrows for images */}
              {kit.images && kit.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? kit.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === kit.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {kit.images && kit.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {kit.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      activeImageIndex === index
                        ? "border-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image.image || "/placeholder.svg"}
                      alt={`${kit.kit_name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div>
            {/* Category */}
            {kit.category && (
              <div className="text-sm text-gray-500 mb-2">
                {kit.category.category_name}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {kit.kit_name}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-4">{kit.subtitle}</p>

            {/* Rating placeholder - replace with actual ratings if available */}
            <div className="flex items-center mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                4.0 (24 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(kit.total_price)}
                </span>

                {hasDiscount && (
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}

                {hasDiscount && (
                  <span className="ml-3 text-sm font-medium text-green-600">
                    Save {formatPrice(kit.discount_price)}
                  </span>
                )}
              </div>

              {/* Tax information */}
              <p className="text-sm text-gray-500 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Stock information */}
            <div className="mb-6">
              {isInStock ? (
                <div className="flex items-center text-sm">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium text-green-700">In Stock</span>
                  {lowStock && (
                    <span className="ml-2 text-orange-600">
                      (Only {kit.stock} left)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center text-sm">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="font-medium text-red-700">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity selector */}
            {isInStock && (
              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={kit.stock}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center border-y border-gray-300 py-2 focus:ring-0 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= kit.stock}
                    className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                  isInStock
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              {/* <button
                onClick={handleBuyNow}
                disabled={!isInStock}
                className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                  isInStock
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button> */}

              <button
                className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={20} />
              </button>

              <button
                className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Product highlights */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Kit Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600">
                    {kit.products.length} premium products included
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600">
                    {hasDiscount
                      ? `${discountPercentage}% discount on combined price`
                      : "Curated selection of products"}
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600">
                    Complete skincare routine
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600">
                    Perfect gift option
                  </span>
                </li>
              </ul>
            </div>

            {/* Delivery options */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Delivery & Returns</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Truck
                    size={18}
                    className="text-gray-600 mr-3 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Free delivery on orders over ₹499
                    </p>
                    <p className="text-xs text-gray-500">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw
                    size={18}
                    className="text-gray-600 mr-3 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Easy 15-day returns
                    </p>
                    <p className="text-xs text-gray-500">
                      If you're not satisfied with your purchase
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield
                    size={18}
                    className="text-gray-600 mr-3 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      100% authentic products
                    </p>
                    <p className="text-xs text-gray-500">
                      All products are original and verified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for additional information */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === "products"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Products Included
              </button>
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === "description"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === "reviews"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === "products" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Products Included in This Kit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kit.products_list && kit.products_list.length > 0 ? (
                    kit.products_list.map((product) => (
                      <div
                        key={product.id}
                        className="flex border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img
                              src={
                                product.images[0].image || "/placeholder.svg"
                              }
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4">
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
                            {product.product_name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                            {product.product_subtitle}
                          </p>
                          <p className="text-sm font-medium">
                            {formatPrice(product.product_price)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">
                      No product information available
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "description" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                {kit.description &&
                typeof kit.description === "object" &&
                Object.keys(kit.description).length > 0 ? (
                  <div className="prose max-w-none">
                    {Object.entries(kit.description).map(
                      ([key, value], index) => (
                        <div key={index} className="mb-4">
                          <h4 className="text-base font-medium mb-2">{key}</h4>
                          <p className="text-gray-600">{value}</p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {typeof kit.description === "string" && kit.description
                      ? kit.description
                      : "This kit contains a carefully selected collection of products designed to work together for optimal results. Each product complements the others to create a complete skincare routine."}
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                {/* Placeholder for reviews - replace with actual reviews component */}
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Star className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-base font-medium text-gray-900">
                    No reviews yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to review this product
                  </p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Kits */}
        {relatedKits.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedKits.slice(0, 4).map((relatedKit) => (
                <div
                  key={relatedKit.id}
                  onClick={() =>
                    navigate("/kitDetails", { state: relatedKit.id })
                  }
                  className="group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {relatedKit.images && relatedKit.images.length > 0 ? (
                      <img
                        src={relatedKit.images[0].image || "/placeholder.svg"}
                        alt={relatedKit.kit_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-gray-400" />
                      </div>
                    )}

                    {relatedKit.discount_price > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round(
                          (relatedKit.discount_price /
                            (relatedKit.total_price +
                              relatedKit.discount_price)) *
                            100
                        )}
                        % OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors mb-1 line-clamp-1">
                      {relatedKit.kit_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                      {relatedKit.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">
                          {formatPrice(relatedKit.total_price)}
                        </span>
                        {relatedKit.discount_price > 0 && (
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            {formatPrice(
                              relatedKit.total_price + relatedKit.discount_price
                            )}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {relatedKit.products.length} products
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitDetailsPage;
