import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Grid3X3,
  List,
} from "lucide-react";
import { showToast } from "../../components/utils/toast";
import { deleteKit, getKitsCompo } from "../../services/kitsCompoApiService";

export default function KitsCompo() {
  const [kits, setKits] = useState([]);
  const [filteredKits, setFilteredKits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kitToDelete, setKitToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    setIsLoading(true);
    try {
      const response = await getKitsCompo();
      setKits(response || []);
      setFilteredKits(response || []);

      const uniqueCategories = [
        ...new Set(
          response.map((kit) => kit.category?.category_name || "Uncategorized")
        ),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching kits:", error);
      showToast("error", "Failed to load kits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [kits, searchTerm, categoryFilter, statusFilter, sortBy]);

  const applyFilters = () => {
    let result = [...kits];

    if (searchTerm) {
      result = result.filter(
        (kit) =>
          kit.kit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kit.kit_subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (kit) => kit.category?.category_name === categoryFilter
      );
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((kit) => kit.is_active === isActive);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        result.sort((a, b) => a.kit_name.localeCompare(b.kit_name));
        break;
      case "name-desc":
        result.sort((a, b) => b.kit_name.localeCompare(a.kit_name));
        break;
      case "price-high":
        result.sort(
          (a, b) => parseFloat(b.kit_price) - parseFloat(a.kit_price)
        );
        break;
      case "price-low":
        result.sort(
          (a, b) => parseFloat(a.kit_price) - parseFloat(b.kit_price)
        );
        break;
      default:
        break;
    }

    setFilteredKits(result);
  };

  const handleDeleteClick = (kit) => {
    setKitToDelete(kit);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!kitToDelete) return;

    try {
      await deleteKit(kitToDelete.id);
      showToast("success", "Kit deleted successfully");
      fetchKits();
    } catch (error) {
      console.error("Error deleting kit:", error);
      showToast("error", "Failed to delete kit");
    } finally {
      setShowDeleteModal(false);
      setKitToDelete(null);
    }
  };

  const handleEditKit = (kitId) => {
    navigate("/admin/kitsCompo/add", { state: kitId });
  };

  const handleViewKit = (kitId) => {
    navigate(`/admin/kitsCompo/view/${kitId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Kits & Compos
              </h1>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/admin/kitsCompo/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Kit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search kits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative inline-block text-left">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative inline-block text-left">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="relative inline-block text-left">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-high">Price (High-Low)</option>
                    <option value="price-low">Price (Low-High)</option>
                  </select>
                </div>

                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-gray-100 text-indigo-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredKits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No kits found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters or search term"
                : "Get started by creating a new kit"}
            </p>
            {!searchTerm &&
              categoryFilter === "all" &&
              statusFilter === "all" && (
                <div className="mt-6">
                  <Link
                    to="/admin/kitsCompo/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Kit
                  </Link>
                </div>
              )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {kit.images && kit.images[0] ? (
                    <img
                      src={kit.images[0].image || "/placeholder.svg"}
                      alt={kit.kit_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        kit.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {kit.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {kit.kit_name}
                      </h3>
                    </div>
                    <div className="text-lg font-bold text-indigo-600">
                      ₹{kit.total_price}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="text-sm font-medium">
                      {kit.subtitle || "Uncategorized"}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-gray-500">Products</div>
                    <div className="flex items-center mt-1">
                      {kit.products_list &&
                        kit.products_list.slice(0, 3).map((product, index) => (
                          <div
                            key={index}
                            className="relative -ml-2 first:ml-0"
                          >
                            {product.images && product.images[0] ? (
                              <img
                                src={
                                  product.images[0].image || "/placeholder.svg"
                                }
                                alt={product.product_name}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  {product.product_name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      {kit.products_list && kit.products_list.length > 3 && (
                        <div className="ml-1 text-xs text-gray-500">
                          +{kit.products_list.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Stock: <span className="font-medium">{kit.stock}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewKit(kit.id)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors"
                        aria-label="View kit"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditKit(kit.id)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors"
                        aria-label="Edit kit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(kit)}
                        className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Delete kit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Products
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKits.map((kit) => (
                  <tr key={kit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                          {kit.images && kit.images[0] ? (
                            <img
                              src={kit.images[0].image || "/placeholder.svg"}
                              alt={kit.kit_name}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {kit.kit_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {kit.kit_subtitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {kit.category?.category_name || "Uncategorized"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {kit.products_list &&
                          kit.products_list
                            .slice(0, 3)
                            .map((product, index) => (
                              <div
                                key={index}
                                className="relative -ml-2 first:ml-0"
                              >
                                {product.images && product.images[0] ? (
                                  <img
                                    src={
                                      product.images[0].image ||
                                      "/placeholder.svg"
                                    }
                                    alt={product.product_name}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                    title={product.product_name}
                                  />
                                ) : (
                                  <div
                                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                                    title={product.product_name}
                                  >
                                    <span className="text-xs text-gray-500">
                                      {product.product_name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                        {kit.products_list && kit.products_list.length > 3 && (
                          <div className="ml-1 text-xs text-gray-500">
                            +{kit.products_list.length - 3} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{kit.kit_price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {kit.kit_count}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          kit.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {kit.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewKit(kit.id)}
                          className="text-gray-500 hover:text-indigo-600 transition-colors"
                          aria-label="View kit"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditKit(kit.id)}
                          className="text-gray-500 hover:text-indigo-600 transition-colors"
                          aria-label="Edit kit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(kit)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          aria-label="Delete kit"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Kit
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{kitToDelete?.kit_name}
                        "? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
