import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { FaBox, FaEdit, FaTrash, FaImage, FaTag, FaList, FaInfoCircle, FaPlus, FaTimes } from "react-icons/fa";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading: loadingProduct } = useGetProductByIdQuery(params._id);
  const { data: categories } = useFetchCategoriesQuery();

  // State management
  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [recommendations, setRecommendations] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);
  const [isUploading3, setIsUploading3] = useState(false);

  // Product details with name and value
  const [productDetails, setProductDetails] = useState([]);

  // API hooks
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Initialize form with product data
  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setCountInStock(productData.countInStock || "");
      setDiscount(productData.discount || 0);
      setImage(productData.image || "");
      setImage2(productData.image2 || "");
      setImage3(productData.image3 || "");
      setIsDiscounted(productData.isDiscounted || false);
      setIsSpecial(productData.isSpecial || false);
      setRecommendations(productData.recommendations || "");

      // Initialize product details from productData
      const details = [];
      for (let i = 2; i <= 14; i++) {
        const pdName = productData[`pdName${i}`];
        const description = productData[`description${i}`];
        if (pdName || description) {
          details.push({
            pdName: pdName || "",
            description: description || ""
          });
        }
      }
      // If no details found in product data, initialize with one empty detail
      if (details.length === 0) {
        details.push({ pdName: "", description: "" });
      }
      setProductDetails(details);
    }
  }, [productData]);

  // Handle image upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFileHandler2 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading2(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image 2 uploaded successfully");
      setImage2(res.image);
    } catch (error) {
      toast.error(error?.data?.message || "Image 2 upload failed");
    } finally {
      setIsUploading2(false);
    }
  };

  const uploadFileHandler3 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading3(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image 3 uploaded successfully");
      setImage3(res.image);
    } catch (error) {
      toast.error(error?.data?.message || "Image 3 upload failed");
    } finally {
      setIsUploading3(false);
    }
  };

  // Add new product detail
  const addProductDetail = () => {
    setProductDetails([...productDetails, { pdName: "", description: "" }]);
  };

  // Remove product detail
  const removeProductDetail = (index) => {
    if (productDetails.length > 1) {
      const newDetails = productDetails.filter((_, i) => i !== index);
      setProductDetails(newDetails);
    }
  };

  // Update product detail field
  const updateProductDetail = (index, field, value) => {
    const newDetails = [...productDetails];
    newDetails[index][field] = value;
    setProductDetails(newDetails);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requiredDetails = productDetails.slice(0, 2);
      const invalidRequired = requiredDetails.filter(
        detail => !detail.pdName.trim() || !detail.description.trim()
      );

      if (invalidRequired.length > 0) {
        toast.error("Please fill in the first two specification names and values");
        return;
      }

      const productData = new FormData();
      productData.append("image", image);
      if (image2) productData.append("image2", image2);
      if (image3) productData.append("image3", image3);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", countInStock);
      productData.append("discount", discount);
      productData.append("isDiscounted", isDiscounted);
      productData.append("isSpecial", isSpecial);
      productData.append("recommendations", recommendations);

      // Add product details
      productDetails.forEach((detail, index) => {
        if (index < 2 || (detail.pdName.trim() || detail.description.trim())) {
          productData.append(`pdName${index + 2}`, detail.pdName);
          productData.append(`description${index + 2}`, detail.description);
        }
      });

      await updateProduct({
        productId: params._id,
        formData: productData
      }).unwrap();

      toast.success("Product updated successfully");
      navigate("/admin/all-products-list");
    } catch (error) {
      console.error(error);
      toast.error("Product update failed");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(params._id).unwrap();
      toast.success("Product deleted successfully");
      navigate("/admin/all-products-list");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed. Try again.");
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Update Product</h1>
              <p className="text-gray-600 mt-2">Edit product information</p>
            </div>
            <button
              onClick={() => navigate("/admin/all-products-list")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                  <FaImage className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Product Image</h2>
              </div>

              <div className="space-y-4">
                {image ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt="Product 1"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 bg-gray-50 border-t border-gray-300 flex justify-between">
                      <label className="cursor-pointer">
                        <span className="text-gray-900 hover:text-gray-700 font-medium">
                          Change Image 1
                        </span>
                        <input
                          type="file"
                          onChange={uploadFileHandler}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                      <button type="button" onClick={() => setImage("")} className="text-red-500 font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload Main Image</p>
                    <label className="inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors cursor-pointer shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.39)' }}>
                      {isUploading ? "Uploading..." : "Choose Image 1"}
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                )}

                {image2 ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={image2}
                      alt="Product 2"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 bg-gray-50 border-t border-gray-300 flex justify-between">
                      <label className="cursor-pointer">
                        <span className="text-gray-900 hover:text-gray-700 font-medium">
                          Change Image 2
                        </span>
                        <input
                          type="file"
                          onChange={uploadFileHandler2}
                          className="hidden"
                          disabled={isUploading2}
                        />
                      </label>
                      <button type="button" onClick={() => setImage2("")} className="text-red-500 font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload Image 2</p>
                    <label className="inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors cursor-pointer shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.39)' }}>
                      {isUploading2 ? "Uploading..." : "Choose Image 2"}
                      <input
                        type="file"
                        onChange={uploadFileHandler2}
                        className="hidden"
                        disabled={isUploading2}
                      />
                    </label>
                  </div>
                )}

                {image3 ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={image3}
                      alt="Product 3"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 bg-gray-50 border-t border-gray-300 flex justify-between">
                      <label className="cursor-pointer">
                        <span className="text-gray-900 hover:text-gray-700 font-medium">
                          Change Image 3
                        </span>
                        <input
                          type="file"
                          onChange={uploadFileHandler3}
                          className="hidden"
                          disabled={isUploading3}
                        />
                      </label>
                      <button type="button" onClick={() => setImage3("")} className="text-red-500 font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload Image 3</p>
                    <label className="inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors cursor-pointer shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.39)' }}>
                      {isUploading3 ? "Uploading..." : "Choose Image 3"}
                      <input
                        type="file"
                        onChange={uploadFileHandler3}
                        className="hidden"
                        disabled={isUploading3}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Delete Section */}
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                  <FaTrash className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Danger Zone</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Deleting this product will remove it permanently. This action cannot be undone.
                </p>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Product Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-300">
              {/* Form Header */}
              <div className="border-b border-gray-300 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                    <FaEdit className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                    <p className="text-gray-600 text-sm">Update product details below</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaBox className="text-gray-700" />
                      <h3 className="font-bold text-gray-900">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Brand *
                        </label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                          placeholder="Enter brand"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                          placeholder="Enter quantity"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Count *
                        </label>
                        <input
                          type="number"
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                          placeholder="Enter stock count"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Description */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaList className="text-gray-700" />
                      <h3 className="font-bold text-gray-900">Description</h3>
                    </div>

                    <div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500 min-h-[120px]"
                        placeholder="Enter product description"
                        required
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div>
                    <div className="space-y-4">
                      {productDetails.map((detail, index) => (
                        <div key={index} className="border border-gray-300 rounded p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                              </div>
                              <span className="font-medium text-gray-900">Detail #{index + 1}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Detail Name
                              </label>
                              <input
                                type="text"
                                value={detail.pdName}
                                onChange={(e) => updateProductDetail(index, "pdName", e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="e.g., Material, Dimensions"
                                required={index < 2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Detail Value
                              </label>
                              <input
                                type="text"
                                value={detail.description}
                                onChange={(e) => updateProductDetail(index, "description", e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Enter detail value"
                                required={index < 2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaInfoCircle className="text-gray-700" />
                      <h3 className="font-bold text-gray-900">Recommendations</h3>
                    </div>

                    <div>
                      <textarea
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-500 min-h-[100px]"
                        placeholder="Enter recommendations or usage tips"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-gray-300">
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => navigate("/admin/all-products-list")}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-pink-500 text-white px-8 py-3 rounded hover:bg-pink-600 transition-colors shadow-lg" style={{ backgroundImage: 'linear-gradient(135deg, #ec4899, #f472b6)', boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.39)' }}
                      >
                        Update Product
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;