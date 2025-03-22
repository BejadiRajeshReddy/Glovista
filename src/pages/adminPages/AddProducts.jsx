import { Camera, Check, XCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  createProducts,
  getCategory,
  getConcerns,
  getIngredients,
  getProductById,
  updateProduct,
} from "../../services/adminApiService";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadImage } from "../../components/utils/cloudinary";
import ProductDescriptionForm from "../../components/adminSide/ProductDescriptionForm";
import { showToast } from "../../components/utils/toast";

export default function AddProducts() {
  const [formData, setFormData] = useState({
    product_name: "",
    product_subtitle: "",
    product_count: "",
    product_price: "",
    product_category: "",
    product_concern: "",
    product_ingredient: [],
    product_description: [],
    product_status: false,
    amazon_url: "",
    flipkart_url: "",
    nykaa_url: "",
    meesho_url: "",
    uploaded_images: [],
  });

  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [concerns, setConcerns] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product_name) {
      showToast("error", "Product name is required.");
      newErrors.product_name = "Product name is required.";
    }

    if (!formData.product_category) {
      showToast("error", "Product category is required.");
      newErrors.product_category = "Product category is required.";
    }

    if (!formData.product_price || isNaN(formData.product_price)) {
      showToast("error", "Valid product price is required.");
      newErrors.product_price = "Valid product price is required.";
    }

    if (!formData.product_count || isNaN(formData.product_count)) {
      showToast("error", "Valid product count is required.");
      newErrors.product_count = "Valid product count is required.";
    }

    if (!formData.product_description) {
      showToast("error", "Product description is required.");
      newErrors.product_description = "Product description is required.";
    }

    if (formData.uploaded_images.length === 0) {
      showToast("error", "At least one image is required.");
      newErrors.uploaded_images = "At least one image is required.";
    }

    if (!formData.product_subtitle) {
      showToast("error", "subtitle name is required.");
      newErrors.product_subtitle = "Product subtitle is required.";
    }
    if (!formData.product_concern) {
      showToast("error", "Please select a concern related to the products.");
      newErrors.product_subtitle = "Product concern is required.";
    }
    if (formData.product_ingredient < 1) {
      showToast("error", "Please select an ingredint related to the product.");
      newErrors.product_subtitle = "Product ingredient is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    const uploadPromises = files.map((file) => uploadImage(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    setFormData((prevData) => ({
      ...prevData,
      uploaded_images: [...prevData.uploaded_images, ...uploadedUrls],
    }));

    setPreviews((prevPreviews) => [...prevPreviews, ...uploadedUrls]);
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

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      const processedImages = await Promise.all(
        formData.uploaded_images.map(async (file) => {
          if (typeof file === "string") return file;
          return await uploadImage(file);
        })
      );

      const normalizedIngredients = Array.isArray(formData.product_ingredient)
        ? formData.product_ingredient.map(Number)
        : [Number(formData.product_ingredient)];

      const newFormData = {
        ...formData,
        uploaded_images: processedImages,
        product_ingredient: normalizedIngredients,
        product_description: JSON.stringify(formData.product_description),
      };

      console.log(formData.product_description);

      const formDataToSend = new FormData();
      Object.entries(newFormData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formDataToSend.append(`${key}[]`, item));
        } else {
          formDataToSend.append(key, value);
        }
      });

      if (productId) {
        await updateProduct(productId, formDataToSend);
      } else {
        const response = await createProducts(formDataToSend);
        console.log(response);
      }

      showToast("success", "Product uploaded successfully!");
      navigate("/admin/products");
    } catch (error) {
      showToast("error", "Error uploading product!");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultiSelectChange = (e, fieldName) => {
    const value = Number(e.target.value);
    const isChecked = e.target.checked;

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: isChecked
        ? [...new Set([...prevData[fieldName].map(Number), value])]
        : prevData[fieldName].filter((item) => Number(item) !== value),
    }));
  };

  const onCancel = () => navigate("/admin/products");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await getCategory();
        setCategories(response || []);
      } catch (error) {
        showToast("error", "Failed to fetch categories");
      }
    };

    const fetchConcerns = async () => {
      try {
        const response = await getConcerns();
        setConcerns(response || []);
      } catch (error) {
        showToast("error", "Failed to fetch concerns");
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await getIngredients();
        setIngredients(response || []);
      } catch (error) {
        showToast("error", "Failed to fetch ingredients");
      }
    };

    if (productId) {
      const fetchProductById = async () => {
        try {
          const response = await getProductById(productId);

          console.log(response);

          setFormData((prevData) => ({
            ...prevData,
            product_name: response?.product_name || "",
            product_category: response?.product_category || "",
            product_concern: response?.product_concern || "",
            product_ingredient: response?.product_ingredient || [],
            product_price: response?.product_price || "",
            product_count: response?.product_count || "",
            product_description:
              JSON.parse(response?.product_description) || [],
            uploaded_images: response?.images?.map((img) => img.image) || [],
            product_status: response?.product_status || false,
            product_subtitle: response?.product_subtitle || "",
            amazon_url: response?.amazon_url || "",
            flipkart_url: response?.flipkart_url || "",
            nykaa_url: response?.nykaa_url || "",
            meesho_url: response?.meesho_url || "",
          }));

          setPreviews(response?.images?.map((img) => img.image));
        } catch (error) {
          console.error("Error fetching product details", error);
        }
      };
      fetchProductById();
    }

    fetchCategoryData();
    fetchConcerns();
    fetchIngredients();
  }, [productId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-800">
              {formData.product_name ? "Edit Product" : "Add New Product"}
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            {productId ? (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 flex items-center gap-2"
              >
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Check size={20} />
                    Save Product
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 flex items-center gap-2"
              >
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Check size={20} />
                    Add Product
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-6">
                General Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <ProductDescriptionForm
                  formData={formData}
                  setFormData={setFormData}
                />

                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="product_category"
                    value={formData.product_category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category, i) => (
                      <option key={i} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Concerns
                  </label>
                  <select
                    name="product_concern"
                    value={formData.product_concern}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  >
                    <option value="" disabled>
                      Select a Concern
                    </option>
                    {concerns.map((concern, i) => (
                      <option key={i} value={concern.id}>
                        {concern.concern_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Ingredients
                  </label>
                  <div className="border border-gray-200 rounded-lg p-3">
                    {ingredients.map((ingredient) => (
                      <label
                        key={ingredient.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          value={ingredient.id}
                          checked={formData.product_ingredient.includes(
                            ingredient.id
                          )}
                          onChange={(e) =>
                            handleMultiSelectChange(e, "product_ingredient")
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">
                          {ingredient.ingredient_name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-6">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="product_subtitle"
                      value={formData.product_subtitle}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="col-span-3 text-xs h-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <div className="flex items-center gap-4 mt-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="product_status"
                          checked={formData.product_status === true}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              product_status: true,
                            }))
                          }
                          className="mr-2"
                        />
                        Active
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="product_status"
                          checked={formData.product_status === false}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              product_status: false,
                            }))
                          }
                          className="mr-2"
                        />
                        Non-Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Pricing And Stock</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Pricing
                    </label>
                    <input
                      type="text"
                      name="product_price"
                      value={formData.product_price}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="product_count"
                      value={formData.product_count}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Product Links</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amazon URL
                  </label>
                  <input
                    type="url"
                    name="amazon_url"
                    value={formData.amazon_url}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flipkart URL
                  </label>
                  <input
                    type="url"
                    name="flipkart_url"
                    value={formData.flipkart_url}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nykaa URL
                  </label>
                  <input
                    type="url"
                    name="nykaa_url"
                    value={formData.nykaa_url}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meesho URL
                  </label>
                  <input
                    type="url"
                    name="meesho_url"
                    value={formData.meesho_url}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                  />
                </div> */}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Upload Images</h2>
              <div className="space-y-6">
                {formData.uploaded_images.length > 0 ? (
                  <div className="aspect-square w-full relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={previews[0]}
                      alt="Product preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full flex justify-center items-center relative bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="w-[400px] relative border-2 border-gray-300 border-dashed rounded-lg p-6"
                      id="dropzone"
                    >
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 z-50"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <div className="text-center">
                        <img
                          className="mx-auto h-12 w-12"
                          src="https://www.svgrepo.com/show/357902/image-upload.svg"
                          alt=""
                        />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer"
                          >
                            <span>Drag and drop</span>
                            <span className="text-indigo-600"> or browse</span>
                            <span>to upload</span>
                            <input
                              onChange={handleFileChange}
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              accept="image/*"
                            />
                          </label>
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, WEBP, AVIF, etc., up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {previews.length > 0 &&
                    previews.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square w-24 bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <XCircle
                          size={16}
                          color="red"
                          className=" absolute top-0 right-0 "
                          onClick={() => handleImageRemove(img)}
                        />
                        <img
                          src={img}
                          alt={`Product ${i} view`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}

                  <button className="aspect-square w-24 bg-gray-100 rounded-lg flex items-center justify-center relative">
                    <Camera size={24} />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
