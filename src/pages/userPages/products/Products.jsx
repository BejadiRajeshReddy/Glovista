"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategory, getProducts } from "../../../services/userApiServices";
import ProductList from "../../../components/userSide/ProductList";
import { Link } from "react-router-dom";
import { getConcerns, getIngredients } from "../../../services/adminApiService";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const ingredientParam = searchParams.get("ingredients") || "";
  const concernParam = searchParams.get("concerns") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOrder, setSortOrder] = useState("random");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(ingredientParam);
  const [selectedConcern, setSelectedConcern] = useState(concernParam);
  const [concerns, setConcerns] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, concernsRes, ingredientsRes] =
          await Promise.all([
            getProducts(),
            getCategory(),
            getConcerns(),
            getIngredients(),
          ]);

        setProducts(Array.isArray(productsRes) ? productsRes : []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
        setConcerns(concernsRes || []);
        setIngredients(ingredientsRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchTerm(searchParam);
    setSelectedIngredient(ingredientParam);
    setSelectedConcern(concernParam);
  }, [categoryParam, searchParam, ingredientParam, concernParam]);

  const updateQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (searchTerm) queryParams.set("search", searchTerm);
    if (selectedIngredient) queryParams.set("ingredients", selectedIngredient);
    if (selectedConcern) queryParams.set("concerns", selectedConcern);
    navigate(`/products?${queryParams.toString()}`);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleIngredientChange = (e) => {
    setSelectedIngredient(e.target.value);
  };

  const handleConcernChange = (e) => {
    setSelectedConcern(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    updateQueryParams();
  }, [
    selectedCategory,
    searchTerm,
    selectedIngredient,
    selectedConcern,
    navigate,
  ]);

  useEffect(() => {
    const updatedProducts = products
      .filter((product) => product.product_status)
      .filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (product) =>
          selectedCategory === "all" ||
          product.category_name === selectedCategory
      )
      .filter((product) => {
        if (!selectedIngredient || selectedIngredient === "") return true;
        return product.product_ingredient.includes(Number(selectedIngredient));
      })
      .filter((product) => {
        if (!selectedConcern || selectedConcern === "") return true;
        return product.concern_name === selectedConcern;
      })
      .sort((a, b) => {
        if (sortOrder === "asc") return a.product_price - b.product_price;
        if (sortOrder === "desc") return b.product_price - a.product_price;
        if (sortOrder === "random") return Math.random() - 0.5;
        return 0;
      });

    setFilteredProducts(updatedProducts);
    setCurrentPage(1);
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedIngredient,
    selectedConcern,
    sortOrder,
  ]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="max-w-7xl mx-auto">
      <nav className="flex pt-2 items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span> &#160; Shop
      </nav>
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      <div className="lg:flex lg:space-x-6">
        <div className="hidden lg:block w-1/3">
          <div className="p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="">
              <label className="block text-sm font-medium mb-2">
                {" "}
                <strong>Search</strong>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full border rounded-md p-2 mb-4"
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-2">
                {" "}
                <strong>Category</strong>{" "}
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border rounded-md p-2 mb-4"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option
                    key={category.category_name}
                    value={category.category_name}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-2">
                {" "}
                <strong>Ingredients</strong>
              </label>
              <select
                value={selectedIngredient}
                onChange={handleIngredientChange}
                className="w-full border rounded-md p-2 mb-4"
              >
                <option value="">All Ingredients</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.ingredient_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-2">
                {" "}
                <strong>Concerns</strong>
              </label>
              <select
                value={selectedConcern}
                onChange={handleConcernChange}
                className="w-full border rounded-md p-2 mb-4"
              >
                <option value="">All Concerns</option>
                {concerns.map((concern) => (
                  <option
                    key={concern.concern_name}
                    value={concern.concern_name}
                  >
                    {concern.concern_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {" "}
                <strong>Sort By</strong>
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        <div className="lg:flex lg:space-x-6">
          <ProductList filteredProducts={currentProducts} />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="mx-2 px-4 py-2 border rounded-md"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          disabled={currentPage * productsPerPage >= filteredProducts.length}
          onClick={() => handlePageChange(currentPage + 1)}
          className="mx-2 px-4 py-2 border rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
