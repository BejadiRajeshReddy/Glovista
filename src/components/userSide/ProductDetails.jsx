import { Card } from "@material-tailwind/react";
import { Badge } from "@mui/material";
import { Minus, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import AddToCart from "./AddToCart";
import { FaAmazon } from "react-icons/fa";
import { SiFlipkart } from "react-icons/si";

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [openedImage, setOpenedImage] = useState(null);

  useEffect(() => {
    if (product.images) {
      setOpenedImage(product.images[0].image);
    }
  }, [product]);

  //

  const renderDescription = (description) => {
    if (!description || typeof description !== "object") return null;

    return (
      <div className="space-y-6">
        {description.main_heading && (
          <h2 className="text-xl font-semibold">{description.main_heading}</h2>
        )}

        {description.paragraphs && description.paragraphs.length > 0 && (
          <div className="space-y-4">
            {description.paragraphs.map((para, index) => (
              <div key={index} className="space-y-2">
                {para.heading && (
                  <h4 className="text-base font-medium">{para.heading}</h4>
                )}
                <p>{para.description}</p>
              </div>
            ))}
          </div>
        )}

        {description.bullet_points && description.bullet_points.length > 0 && (
          <div className="space-y-4">
            {description.bullet_points.map((bulletPoint, index) => (
              <div key={index} className="space-y-2">
                {bulletPoint.heading && (
                  <h4 className="text-base font-medium">
                    {bulletPoint.heading}
                  </h4>
                )}
                <ul className="list-disc pl-5 space-y-1">
                  {bulletPoint.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {description.points && description.points.length > 0 && (
          <div className="space-y-4">
            {description.points.map((point, index) => (
              <div key={index} className=" ">
                {point.heading && (
                  <h4 className="text-base font-medium">{point.heading} :</h4>
                )}
                <div className="list-disc pl-2 ">
                  {point.items.map((item, itemIndex) => (
                    <p key={itemIndex}>{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="space-y-4 col-span-12 md:col-span-5 lg:col-span-4">
          <div className="relative rounded-md aspect-square">
            <img
              src={openedImage || "/placeholder.svg"}
              alt={product.product_name}
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product?.images?.map((imageObj, i) => (
              <div
                onClick={() => setOpenedImage(imageObj.image)}
                key={i}
                className="relative aspect-square border rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={imageObj.image || "/placeholder.svg"}
                  alt={`Product view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex h-20 justify-between items-center gap-2">
            <button
              onClick={() => window.open(product.amazon_url)}
              name="amazone"
              className="w-10  flex items-center justify-center"
            >
              <FaAmazon size={30} />
            </button>
            <button
              onClick={() => window.open(product.flipkart_url)}
              name="flipkart"
              className="w-10  flex items-center justify-center"
            >
              <SiFlipkart size={30} />
            </button>
            {/* <button
              onClick={() => window.open(product.nykaa_url)}
              name="nykaa"
              className="w-14 h-10  flex items-center justify-center"
            >
              <img src="/nykaa.svg" alt="/" />
            </button>
            <button
              onClick={() => window.open(product.meesho_url)}
              name="meesho"
              className="w-10  flex items-center justify-center"
            >
              <img src="/meesho.svg" className="w-10 " alt="/" />
            </button> */}
          </div>
        </div>

        <div className="space-y-6 col-span-12 md:col-span-7 lg:col-span-8">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outlined"
              className="text-xs px-4 py-1 rounded-sm bg-orange-50 text-orange-700 border-orange-200"
            >
              ALL SKIN TYPE
            </Badge>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {product.product_name}
            </h1>
            <p className="text-emerald-500 font-medium">
              {product.product_subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">4.78</span>
            </div>
            <div className="text-gray-600">64 Reviews</div>
          </div>

          <div className="flex gap-1 items-baseline flex-wrap">
            <div className="text-gray-500 text-sm">MRP:</div>
            <div className="text-xl font-medium">
              RS . {product.product_price}
            </div>
          </div>
          <div className="text-sm text-gray-600">Inclusive of all taxes</div>

          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {/* {["100g"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[80px] border p-2 rounded ${
                    selectedSize === size ? "bg-gray-200" : ""
                  }`}
                >
                  {size}
                </button>
              ))} */}
            </div>

            <div className="flex flex-col items-center sm:flex-row gap-4 w-2/3">
              <div className="flex items-center h-10 mb-2 p-2 border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-grow ">
                <AddToCart product={product} qty={quantity} />
                <p className="text-center text-xs font-bold p-1">
                  5% OFF ON PREPAID ORDERS | COD FEE RS.25/-
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-teal-50 p-4">
            <p className="text-center font-bold text-teal-600 text-lg">
              TRIPLE THE JOY: GRAB 3 FOR JUST ₹899!
            </p>
          </Card>

          <div className="space-y-6">
            {renderDescription(product.product_description)}
          </div>
        </div>
      </div>
    </div>
  );
}
