import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/userApiServices";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ProductList from "./ProductList";

function BestSeller() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = filteredProducts.slice(
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

  useEffect(() => {
    setFilteredProducts(products.filter((product) => product.product_status));
  }, [products]);

  return (
    <div className="py-10 font-albert px-8 md:px-12 lg:px-20 xl:px-24">
      <div className=" flex justify-between items-center mb-4">
        <h2 className="lg:text-[2.5rem] text-xl md:text-3xl font-medium">
          Best Sellers
        </h2>
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
          {/* <Link to="products?search=''\\"> */}
          <Link to="products">
            <button>view all</button>
          </Link>
        </div>
      </div>
      <div className="lg:px-10">
        <ProductList filteredProducts={currentProducts} />
      </div>
    </div>
  );
}

export default BestSeller;
