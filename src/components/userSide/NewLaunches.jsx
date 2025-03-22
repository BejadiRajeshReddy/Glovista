import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../services/userApiServices";

const NewLaunches = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const itemsPerPage = 3;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await getProducts();

        setProducts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("An Error Occured Fetching", error);
      }
    };
    fetchProductData();
  }, []);

  return (
    <div className="py-10 font-albert px-24">
      <div className=" flex justify-between items-center mb-4">
        <h2 className="text-[2.5rem] font-medium">New Launches</h2>
        <div className="flex gap-3 justify-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={` border  text-gray-500 rounded-full ${
              currentPage === 1
                ? " cursor-auto "
                : " hover:text-black hover:shadow-2xl hover:scale-125"
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={` border text-gray-500  rounded-full shadow-2xl ${
              currentPage === totalPages
                ? " cursor-auto"
                : " hover:text-black hover:border-2 hover:shadow-2xl hover:scale-125"
            }`}
          >
            <ChevronRight />
          </button>
          <Link to="products?search=new_launches">
            <button>view all</button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate("/productDetails", { state: product.id })}
            className="border cursor-pointer border-navBg rounded-lg shadow-md hover:shadow-xl transition "
          >
            <div className="bg-navBg p-[1px]">
              <img
                src={product.images[0].image}
                alt={product.product_name}
                className="w-full  object-cover rounded-md "
              />
              <p className="text-sm uppercase text-center p-3">
                {product.product_skinType}
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{product.product_name}</h3>
              <p className="text-sm text-gray-600">
                {product.product_description}
              </p>
              <p className="text-green-600 font-semibold mt-2">
                Rs. {product.product_price}
              </p>
              <AddToCart product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewLaunches;
