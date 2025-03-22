import React, { useEffect, useState } from "react";
import ProductDetails from "../../../components/userSide/ProductDetails";
import { useLocation } from "react-router-dom";
import { getProductById } from "../../../services/adminApiService";
import Loader from "../../../components/common/Loader";
import Services from "../../../components/userSide/Services";
import RatingsAndReviews from "../../../components/userSide/RatingsAndReviews";
import ProductList from "../../../components/userSide/ProductList";
import { getProducts } from "../../../services/userApiServices";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState({});
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const id = location.state;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getProductById(id, { signal });
        setProduct(response);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to fetch product data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductData();

    return () => controller.abort();
  }, [id]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await getProducts();

        setProducts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("An Error Occurred Fetching", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ProductDetails product={product} />
      <Services />
      <div className="flex justify-center">
        <RatingsAndReviews />
      </div>
      <div className="flex justify-center w-full border-t">
        <div className="w-full max-w-screen-xl px-10">
          <div className="text-2xl font-semibold py-5">Featured Collection</div>
          <ProductList filteredProducts={products} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
