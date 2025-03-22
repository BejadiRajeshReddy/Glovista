import { useState, useEffect } from "react";

export default function OrderImage({ order }) {
  const images = order.items.flatMap((item) =>
    item.product.images.length > 0
      ? item.product.images.map((img) => img.image)
      : []
  ) || ["/placeholder.svg"];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
      <img
        src={images[currentIndex]}
        alt="Product image"
        className="h-full w-full object-cover"
        onError={(e) => {
          e.target.src = "/placeholder.svg";
        }}
      />
    </div>
  );
}
