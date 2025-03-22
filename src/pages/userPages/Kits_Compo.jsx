"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  Search,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import KitsList from "../../components/userSide/KitList";
import { getKitsCompo } from "../../services/kitsCompoApiService";

const Kits_Compo = () => {
  const [kits, setKits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortOrder, setSortOrder] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredKits = kits
    .filter(
      (kit) =>
        kit.kit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kit.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (kit) =>
        selectedCategory === "all" ||
        kit.category.id.toString() === selectedCategory
    )
    .filter(
      (kit) =>
        kit.total_price >= priceRange[0] && kit.total_price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "price-asc":
          return a.total_price - b.total_price;
        case "price-desc":
          return b.total_price - a.total_price;
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "featured":
        default:
          const discountA = a.discount_price || 0;
          const discountB = b.discount_price || 0;
          return discountB - discountA;
      }
    });

  useEffect(() => {
    const fetchKitsData = async () => {
      setIsLoading(true);
      try {
        const response = await getKitsCompo();

        if (Array.isArray(response)) {
          setKits(response);

          const uniqueCategories = [
            ...new Set(
              response
                .map((kit) =>
                  kit.category && typeof kit.category === "object"
                    ? { id: kit.category.id, name: kit.category.category_name }
                    : null
                )
                .filter(Boolean)
            ),
          ];

          const categoryMap = {};
          uniqueCategories.forEach((cat) => {
            categoryMap[cat.id] = cat;
          });

          setCategories(Object.values(categoryMap));
        }
      } catch (error) {
        console.error("Error fetching kits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKitsData();
  }, []);

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([0, 5000]);
    setSortOrder("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900">Kits & Combos</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Skincare Kits & Combos
          </h1>
          <p className="mt-2 text-gray-600">
            Curated collections for all your skincare needs
          </p>
        </div>

        {/* Mobile filter button */}
        <button
          className="mt-4 md:hidden flex items-center justify-center gap-2 w-full py-3 bg-gray-100 rounded-lg font-medium"
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal size={18} />
          Filter & Sort
        </button>
      </div>

      {/* Search bar - visible on all screens */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search kits by name or description..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {(selectedCategory !== "all" ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 5000) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {/* Category filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        All Categories
                      </span>
                    </label>

                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id.toString()}
                          onChange={() =>
                            setSelectedCategory(category.id.toString())
                          }
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ₹{priceRange[0]}
                      </span>
                      <span className="text-sm text-gray-600">
                        ₹{priceRange[1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full p-2 text-sm border border-gray-200 rounded"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full p-2 text-sm border border-gray-200 rounded"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Sort By
                  </h3>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsFilterOpen(false)}
            ></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Category filter */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Category
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mobile-category"
                            value="all"
                            checked={selectedCategory === "all"}
                            onChange={() => setSelectedCategory("all")}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            All Categories
                          </span>
                        </label>

                        {categories.map((category) => (
                          <label
                            key={category.id}
                            className="flex items-center"
                          >
                            <input
                              type="radio"
                              name="mobile-category"
                              value={category.id}
                              checked={
                                selectedCategory === category.id.toString()
                              }
                              onChange={() =>
                                setSelectedCategory(category.id.toString())
                              }
                              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range filter */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Price Range
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            ₹{priceRange[0]}
                          </span>
                          <span className="text-sm text-gray-600">
                            ₹{priceRange[1]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(e, 0)}
                            className="w-full p-2 text-sm border border-gray-200 rounded"
                            placeholder="Min"
                          />
                          <input
                            type="number"
                            min={priceRange[0]}
                            max="5000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(e, 1)}
                            className="w-full p-2 text-sm border border-gray-200 rounded"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Sort By
                      </h3>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <button
                      onClick={() => {
                        setIsFilterOpen(false);
                      }}
                      className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Apply Filters
                    </button>

                    {(selectedCategory !== "all" ||
                      priceRange[0] > 0 ||
                      priceRange[1] < 5000) && (
                      <button
                        onClick={() => {
                          clearFilters();
                          setIsFilterOpen(false);
                        }}
                        className="w-full mt-2 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1">
          {/* Sort dropdown for tablet/desktop */}
          <div className="hidden md:flex lg:hidden items-center justify-end mb-6">
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
                <option value="newest">Sort: Newest First</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredKits.length}{" "}
              {filteredKits.length === 1 ? "kit" : "kits"}
              {selectedCategory !== "all" &&
              categories.find((c) => c.id.toString() === selectedCategory)
                ? ` in ${
                    categories.find((c) => c.id.toString() === selectedCategory)
                      .name
                  }`
                : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-square mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredKits.length > 0 ? (
                <KitsList kits={filteredKits} />
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Filter className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No kits found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kits_Compo;
