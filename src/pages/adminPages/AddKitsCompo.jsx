import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Camera,
  Check,
  XCircle,
  Plus,
  Package,
  DollarSign,
  Layers,
} from "lucide-react";
import { getAdminProducts } from "../../services/adminApiService";
import { uploadImage } from "../../components/utils/cloudinary";
import {
  createKit,
  getKitById,
  updateKit,
} from "../../services/kitsCompoApiService";
import { showToast } from "../../components/utils/toast";
import ProductDescriptionForm from "../../components/adminSide/ProductDescriptionForm";

export default function AddKitsComponent() {
  const [formData, setFormData] = useState({
    kit_name: "",
    // category: "",
    products: [],
    discount_price: 0,
    total_price: 0,
    stock: 0,
    subtitle: "",
    description: {},
    is_active: true,
    uploaded_images: [],
  });

  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const kitId = location.state;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kit_name) {
      showToast("error", "Kit name is required.");
      newErrors.kit_name = "Kit name is required.";
    }

    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) {
      showToast("error", "Valid stock quantity is required.");
      newErrors.stock = "Valid stock quantity is required.";
    }

    // if (!formData.category) {
    //   showToast("error", "Category is required.");
    //   newErrors.category = "Category is required.";
    // }

    if (formData.products.length < 2) {
      showToast("error", "At least two product must be selected.");
      newErrors.products = "At least two product must be selected.";
    }

    if (formData.products.length > 3) {
      showToast("error", "A maximum of 3 products are allowed.");
      newErrors.products = "A maximum of 3 products are allowed.";
    }

    if (formData.uploaded_images.length === 0) {
      showToast("error", "At least one image is required.");
      newErrors.uploaded_images = "At least one image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    setIsSubmitting(true);
    const files = Array.from(e.target.files);

    const uploadPromises = files.map((file) => uploadImage(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    setFormData((prevData) => ({
      ...prevData,
      uploaded_images: [...prevData.uploaded_images, ...uploadedUrls],
    }));

    setPreviews((prevPreviews) => [...prevPreviews, ...uploadedUrls]);

    setIsSubmitting(false);
  };

  const handleImageRemove = (imageUrl) => {
    const updatedImages = formData.uploaded_images.filter(
      (img) => img !== imageUrl
    );

    const updatedPreviews = previews.filter((preview) => preview !== imageUrl);

    setFormData((prevData) => ({
      ...prevData,
      uploaded_images: updatedImages,
    }));

    setPreviews(updatedPreviews);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await Promise.all(
        formData.uploaded_images.map(async (file) => {
          if (typeof file === "string") {
            return file;
          }
          return await uploadImage(file);
        })
      );

      formData.total_price = total;

      if (formData.description) {
        formData.description = JSON.stringify(formData.description);
      }

      const newData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "description" && typeof value === "object") {
          newData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach((item) => {
            newData.append(`${key}[]`, item);
          });
        } else {
          newData.append(key, value);
        }
      });

      if (kitId) {
        await updateKit(kitId, newData);
        showToast("success", "Kit updated successfully!");
      } else {
        await createKit(newData);
        showToast("success", "Kit created successfully!");
      }

      navigate("/admin/kitsCompo");
    } catch (error) {
      showToast("error", "Error saving kit!");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultiSelectChange = (e, fieldName) => {
    let value = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: isChecked
        ? [...prevData[fieldName], value]
        : prevData[fieldName].filter((item) => item !== value),
    }));
  };

  const onCancel = () => navigate("/admin/kitsCompo");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAdminProducts();
        setProducts(response || []);
      } catch (error) {
        showToast("error", "Failed to fetch products");
      }
    };

    if (kitId) {
      const fetchKitById = async () => {
        try {
          const response = await getKitById(kitId);

          setFormData({
            kit_name: response.kit_name || "",
            products: response.products || [],
            discount_price: response.discount_price || 0,
            stock: response.stock || 0,
            subtitle: response.subtitle || "",
            description: JSON.parse(response.description) || {},
            is_active: response.is_active || true,
            uploaded_images: response.images.map((img) => img.image) || [],
          });

          setPreviews(response?.images?.map((img) => img.image) || []);
        } catch (error) {
          console.error("Error fetching kit details", error);
          showToast("error", "Failed to fetch kit details");
        }
      };
      fetchKitById();
    }

    fetchProducts();
  }, [kitId]);

  useEffect(() => {
    if (products.length && formData.products.length) {
      const selected = products.filter((product) =>
        formData.products.includes(product.id)
      );
      setSelectedProducts(selected);
    } else {
      setSelectedProducts([]);
    }
  }, [products, formData.products]);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const subTotal = selectedProducts.reduce(
        (acc, product) => acc + product.product_price,
        0
      );

      setTotal(subTotal);
    }
  }, [selectedProducts]);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <Package size={18} /> },
    {
      id: "pricing",
      label: "Pricing & Inventory",
      icon: <DollarSign size={18} />,
    },
    { id: "products", label: "Products", icon: <Layers size={18} /> },
    { id: "images", label: "Images", icon: <Camera size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {kitId ? "Edit Kit" : "Create New Kit"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Check size={18} />
                  {kitId ? "Save Changes" : "Create Kit"}
                </>
              )}
            </button>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "basic" && (
              <div className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kit Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="kit_name"
                      value={formData.kit_name}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        errors.kit_name ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                      placeholder="Enter kit name"
                    />
                    {errors.kit_name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.kit_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <ProductDescriptionForm
                      formData={formData}
                      setFormData={setFormData}
                      fieldName="description"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        errors.category ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                    ></input>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category}
                      </p>
                    )}
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              is_active: true,
                            }))
                          }
                          className="mr-2"
                        />
                        Active
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="is_active"
                          checked={!formData.is_active}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              is_active: false,
                            }))
                          }
                          className="mr-2"
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Toatal Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="total_price"
                        disabled
                        value={total}
                        // onChange={handleChange}
                        className={`w-full pl-10 p-3 border ${
                          errors.total_price
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.total_price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.total_price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="discount_price"
                        value={formData.discount_price}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full p-3 border ${
                        errors.stock ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                      placeholder="0"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Products <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border ${
                      errors.products ? "border-red-500" : "border-gray-200"
                    } rounded-lg p-3 max-h-96 overflow-y-auto`}
                  >
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {products.map((product) => (
                          <label
                            key={product.id}
                            className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={product.id}
                              checked={formData.products.includes(product.id)}
                              onChange={(e) =>
                                handleMultiSelectChange(e, "products")
                              }
                              className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <div className="flex flex-1 gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                {product.images && product.images[0] && (
                                  <img
                                    src={
                                      product.images[0].image ||
                                      "/placeholder.svg"
                                    }
                                    alt={product.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h3 className="font-medium text-gray-800">
                                    {product.product_name}
                                  </h3>
                                  <span className="text-sm font-medium">
                                    $
                                    {Number.parseFloat(
                                      product.product_price
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {product.product_subtitle || "No subtitle"}
                                </p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No products available
                      </div>
                    )}
                  </div>
                  {errors.products && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.products}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Selected Products ({formData.products.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {formData.products.length > 0 ? (
                      products
                        .filter((product) =>
                          formData.products.includes(product.id.toString())
                        )
                        .map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 p-3 bg-white border rounded-lg"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                              {product.images && product.images[0] && (
                                <img
                                  src={
                                    product.images[0].image ||
                                    "/placeholder.svg"
                                  }
                                  alt={product.product_name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">
                                {product.product_name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                $
                                {Number.parseFloat(
                                  product.product_price
                                ).toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  products: prev.products.filter(
                                    (id) => id !== product.id.toString()
                                  ),
                                }));
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ))
                    ) : (
                      <div className="col-span-full text-center py-4 text-gray-500">
                        No products selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "images" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kit Images <span className="text-red-500">*</span>
                  </label>

                  {formData.uploaded_images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="aspect-square w-full relative bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={previews[0] || "/placeholder.svg"}
                          alt="Kit preview"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          {previews.map((img, i) => (
                            <div
                              key={i}
                              className="relative aspect-square w-20 h-20 bg-gray-100 rounded-lg overflow-hidden group"
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`Kit ${i} view`}
                                className="object-cover w-full h-full"
                              />
                              <button
                                onClick={() => handleImageRemove(img)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XCircle size={20} className="text-red-500" />
                              </button>
                            </div>
                          ))}

                          <label className="aspect-square w-20 h-20 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                            <Plus size={20} className="text-gray-500" />
                            <span className="text-xs text-gray-500 mt-1">
                              Add
                            </span>
                            <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              className="hidden"
                              accept="image/*"
                            />
                          </label>
                        </div>

                        {errors.uploaded_images && (
                          <p className="text-sm text-red-500">
                            {errors.uploaded_images}
                          </p>
                        )}

                        <p className="text-sm text-gray-500">
                          Upload high-quality images of your kit. The first
                          image will be used as the main display image.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 block cursor-pointer"
                    >
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          <span>Drag and drop</span>
                          <span className="text-primary"> or browse</span>
                          <span> to upload</span>
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        {errors.uploaded_images && (
                          <p className="mt-2 text-sm text-red-500">
                            {errors.uploaded_images}
                          </p>
                        )}
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
