import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiImage, FiBox, FiTag, FiList, FiUpload, FiX, FiArrowLeft,
  FiPackage, FiDollarSign, FiHash, FiCheckCircle, FiLayers, FiTruck
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ELEGANT WHITE & PINK COLOR SCHEME
  const colors = {
    background: "#ffffff",      // Pure white
    textPrimary: "#333333",     // Soft dark gray
    textSecondary: "#888888",   // Lighter gray
    accent: "#2563eb",          // Beautiful Pink (Tailwind blue-600)
    border: "#dbeafe",          // Very light pink borders
    surface: "#eff6ff",         // Surface pink
    surfaceHover: "#eff6ff",    // Light pink hover state
    shadow: "rgba(37, 99, 235, 0.1)", // Soft pink shadow
    success: "#10b981"
  };

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // Form state
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
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);
  const [isUploading3, setIsUploading3] = useState(false);

  // Product details
  const [productDetails, setProductDetails] = useState([
    { pdName: "Material", description: "" },
    { pdName: "Dimensions", description: "" },
    { pdName: "Weight Capacity", description: "" },
    { pdName: "Color Options", description: "" },
    { pdName: "Warranty", description: "3 years foam warranty, 5 years mechanical warranty" }
  ]);

  // Responsive State
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive Helpers
  const getTextSize = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getPadding = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getGap = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.6
      }
    }
  };

  const formFieldVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 25
      }
    })
  };

  const uploadAreaVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  // Handlers
  const uploadFileHandlerForImage = async (e) => {
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

  const uploadFileHandlerForImage2 = async (e) => {
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

  const uploadFileHandlerForImage3 = async (e) => {
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

  const updateProductDetailName = (index, value) => {
    const newDetails = [...productDetails];
    newDetails[index].pdName = value;
    setProductDetails(newDetails);
  };

  const updateProductDetailDescription = (index, value) => {
    const newDetails = [...productDetails];
    newDetails[index].description = value;
    setProductDetails(newDetails);
  };

  const addProductDetail = () => {
    setProductDetails([...productDetails, { pdName: "", description: "" }]);
  };

  const removeProductDetail = (index) => {
    if (productDetails.length > 1) {
      const newDetails = productDetails.filter((_, i) => i !== index);
      setProductDetails(newDetails);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || !category || !image) {
      toast.error("Please fill in all required fields including image");
      return;
    }

    const requiredDetails = productDetails.slice(0, 2);
    const invalidRequired = requiredDetails.filter(
      detail => !detail.pdName.trim() || !detail.description.trim()
    );

    if (invalidRequired.length > 0) {
      toast.error("Please fill in the first two specification names and values");
      return;
    }

    try {
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

      productDetails.forEach((detail, index) => {
        if (index < 2 || (detail.pdName.trim() || detail.description.trim())) {
          productData.append(`pdName${index + 2}`, detail.pdName);
          productData.append(`description${index + 2}`, detail.description);
        }
      });

      const { data } = await createProduct(productData);

      if (data?.error) {
        toast.error("Product creation failed. Try again.");
      } else {
        toast.success(`"${data?.name}" created successfully`);
        navigate("/admin");
      }
    } catch (error) {
      toast.error("Product creation failed. Try again.");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-6', 'px-6 py-8', 'px-8 py-12')}`}>
        {/* Header */}
        <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
          <motion.span
            className={`${getTextSize('text-xs tracking-[0.3em]', 'text-sm tracking-[0.4em]', 'text-sm tracking-[0.4em]')} text-gray-500 font-bold block mb-2`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Add New Product
          </motion.span>
          <motion.h1 className={`${getTextSize('text-2xl', 'text-4xl', 'text-6xl')} font-light tracking-tighter text-black`}>
            Create Saloon Interior Product
          </motion.h1>
          <motion.p className={`${getTextSize('text-sm', 'text-base', 'text-base')} text-gray-600 mt-2`}>
            Add a new product to your premium collection
          </motion.p>
        </motion.div>

        <div className={`grid ${isDesktop ? 'lg:grid-cols-3' : ''} ${getGap('gap-6', 'gap-8', 'gap-12')}`}>
          {/* Left Column - Image Upload */}
          <motion.div className={`${isDesktop ? 'lg:col-span-1' : ''} lg:sticky lg:top-8`} variants={itemVariants}>
            <motion.div
              className="bg-white border rounded-lg p-6"
              style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            >
              <motion.div
                className="flex items-center gap-3 mb-6 pb-4 border-b"
                style={{ borderColor: colors.border }}
                variants={itemVariants}
              >
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                >
                  <FiImage className="text-gray-600" />
                </motion.div>
                <motion.h2 className="text-lg font-light" style={{ color: colors.textPrimary }}>
                  Product Image
                </motion.h2>
              </motion.div>

              <div className="space-y-6">
                {image ? (
                  <div>
                    <motion.div
                      className="border overflow-hidden rounded-lg"
                      style={{ borderColor: colors.border }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.img
                        src={image}
                        alt="Product preview 1"
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div>
                    <div className="flex gap-3 mt-4">
                      <motion.label
                        className="flex-1 px-4 py-3 text-center text-xs uppercase tracking-wider font-medium cursor-pointer rounded-lg"
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                        whileHover={{ backgroundColor: colors.textPrimary, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin" />
                            Changing...
                          </div>
                        ) : 'Change Image 1'}
                        <input
                          type="file"
                          onChange={uploadFileHandlerForImage}
                          className="hidden"
                        />
                      </motion.label>
                      <motion.button
                        onClick={() => setImage("")}
                        className="flex-1 px-4 py-3 border text-xs uppercase tracking-wider font-medium rounded-lg"
                        style={{ borderColor: colors.border, color: colors.textSecondary }}
                        whileHover={{ backgroundColor: colors.surface, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className="border-2 border-dashed rounded-lg text-center py-8"
                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                    variants={uploadAreaVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: colors.background }}
                    >
                      <FiUpload className="text-xl text-gray-600" />
                    </motion.div>
                    <p className="text-sm text-gray-600 mb-4">Upload Main Image</p>
                    <motion.label
                      className="inline-block px-4 py-2 text-xs uppercase tracking-wider font-medium cursor-pointer rounded-lg"
                      style={{ backgroundColor: colors.accent, color: colors.background }}
                      whileHover={{ backgroundColor: colors.textPrimary, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <FaSpinner className="animate-spin" />
                          Uploading...
                        </div>
                      ) : 'Choose Image 1'}
                      <input
                        type="file"
                        onChange={uploadFileHandlerForImage}
                        className="hidden"
                      />
                    </motion.label>
                  </motion.div>
                )}

                {image2 ? (
                  <div>
                    <motion.div
                      className="border overflow-hidden rounded-lg mt-4"
                      style={{ borderColor: colors.border }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.img
                        src={image2}
                        alt="Product preview 2"
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div>
                    <div className="flex gap-3 mt-4">
                      <motion.label
                        className="flex-1 px-4 py-3 text-center text-xs uppercase tracking-wider font-medium cursor-pointer rounded-lg"
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                        whileHover={{ backgroundColor: colors.textPrimary, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isUploading2 ? (
                          <div className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin" />
                            Changing...
                          </div>
                        ) : 'Change Image 2'}
                        <input
                          type="file"
                          onChange={uploadFileHandlerForImage2}
                          className="hidden"
                        />
                      </motion.label>
                      <motion.button
                        onClick={() => setImage2("")}
                        className="flex-1 px-4 py-3 border text-xs uppercase tracking-wider font-medium rounded-lg"
                        style={{ borderColor: colors.border, color: colors.textSecondary }}
                        whileHover={{ backgroundColor: colors.surface, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className="border-2 border-dashed rounded-lg text-center py-8 mt-4"
                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                    variants={uploadAreaVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: colors.background }}
                    >
                      <FiUpload className="text-xl text-gray-600" />
                    </motion.div>
                    <p className="text-sm text-gray-600 mb-4">Upload Image 2</p>
                    <motion.label
                      className="inline-block px-4 py-2 text-xs uppercase tracking-wider font-medium cursor-pointer rounded-lg"
                      style={{ backgroundColor: colors.accent, color: colors.background }}
                      whileHover={{ backgroundColor: colors.textPrimary, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isUploading2 ? (
                        <div className="flex items-center gap-2">
                          <FaSpinner className="animate-spin" />
                          Uploading...
                        </div>
                      ) : 'Choose Image 2'}
                      <input
                        type="file"
                        onChange={uploadFileHandlerForImage2}
                        className="hidden"
                      />
                    </motion.label>
                  </motion.div>
                )}

                {image3 ? (
                  <div>
                    <motion.div
                      className="border overflow-hidden rounded-lg mt-4"
                      style={{ borderColor: colors.border }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.img
                        src={image3}
                        alt="Product preview 3"
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div>
                    <div className="flex gap-3 mt-4">
                      <motion.label
                        className="flex-1 px-4 py-3 text-center text-xs uppercase tracking-wider font-medium cursor-pointer rounded-lg"
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                        whileHover={{ backgroundColor: colors.textPrimary, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isUploading3 ? (
                          <div className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin" />
                            Changing...
                          </div>
                        ) : 'Change Image 3'}
                        <input
                          type="file"
                          onChange={uploadFileHandlerForImage3}
                          className="hidden"
                        />
                      </motion.label>
                      <motion.button
                        onClick={() => setImage3("")}
                        className="flex-1 px-4 py-3 border text-xs uppercase tracking-wider font-medium rounded-lg"
                        style={{ borderColor: colors.border, color: colors.textSecondary }}
                        whileHover={{ backgroundColor: colors.surface, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className="border-2 border-dashed rounded-lg text-center py-8 mt-4"
                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                    variants={uploadAreaVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: colors.background }}
                    >
                      <FiUpload className="text-xl text-gray-600" />
                    </motion.div>
                    <p className="text-sm text-gray-600 mb-4">Upload Image 3</p>
                    <motion.label
                      className="inline-block px-4 py-2 text-xs uppercase tracking-wider font-medium cursor-pointer rounded-lg"
                      style={{ backgroundColor: colors.accent, color: colors.background }}
                      whileHover={{ backgroundColor: colors.textPrimary, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isUploading3 ? (
                        <div className="flex items-center gap-2">
                          <FaSpinner className="animate-spin" />
                          Uploading...
                        </div>
                      ) : 'Choose Image 3'}
                      <input
                        type="file"
                        onChange={uploadFileHandlerForImage3}
                        className="hidden"
                      />
                    </motion.label>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Main Form */}
          <motion.div className={`${isDesktop ? 'lg:col-span-2' : ''}`} variants={itemVariants}>
            <motion.div
              className="bg-white border rounded-lg"
              style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            >
              {/* Form Header */}
              <motion.div
                className="border-b p-6"
                style={{ borderColor: colors.border }}
                variants={itemVariants}
              >
                <motion.div className="flex items-center gap-4" variants={itemVariants}>
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.surface }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiBox className="text-gray-600" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-light" style={{ color: colors.textPrimary }}>
                      Product Information
                    </h2>
                    <p className="text-xs text-gray-500">Fill in all required fields</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <motion.div className="space-y-8" variants={containerVariants}>
                  {/* Basic Information */}
                  <motion.div variants={itemVariants}>
                    <motion.div
                      className="flex items-center gap-3 mb-6 pb-4 border-b"
                      style={{ borderColor: colors.border, color: colors.textPrimary }}
                      variants={itemVariants}
                    >
                      <FiTag />
                      <h3 className="text-lg font-light">Basic Information</h3>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      variants={containerVariants}
                    >
                      {[
                        { label: "Product Name *", value: name, setValue: setName, icon: FiPackage, type: "text", placeholder: "e.g., Premium Salon Chair" },
                        { label: "Price (Rs.) *", value: price, setValue: setPrice, icon: FiDollarSign, type: "number", placeholder: "0.00" },
                        { label: "Brand *", value: brand, setValue: setBrand, icon: FiTag, type: "text", placeholder: "Enter brand name" },
                        { label: "Category *", value: category, setValue: setCategory, icon: FiLayers, type: "select", placeholder: "Select Category" },
                        { label: "Quantity *", value: quantity, setValue: setQuantity, icon: FiHash, type: "number", placeholder: "Enter quantity" },
                        { label: "Stock Count *", value: countInStock, setValue: setCountInStock, icon: FiPackage, type: "number", placeholder: "Enter stock count" }
                      ].map((field, index) => (
                        <motion.div key={index} custom={index} variants={formFieldVariants}>
                          <motion.label
                            className="block text-xs uppercase tracking-wider font-medium mb-2"
                            style={{ color: colors.textPrimary }}
                            whileHover={{ x: 2 }}
                          >
                            {field.label}
                          </motion.label>
                          <motion.div
                            className="flex items-center gap-3 p-3 border rounded-lg"
                            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                            whileFocusWithin={{ scale: 1.01, borderColor: colors.accent }}
                          >
                            <field.icon className="text-gray-500" />
                            {field.type === "select" ? (
                              <select
                                value={field.value}
                                onChange={(e) => field.setValue(e.target.value)}
                                className="w-full bg-transparent text-sm focus:outline-none"
                                style={{ color: colors.textPrimary }}
                                required
                              >
                                <option value="">{field.placeholder}</option>
                                {categories?.map((cat) => (
                                  <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.setValue(e.target.value)}
                                className="w-full bg-transparent text-sm focus:outline-none"
                                style={{ color: colors.textPrimary }}
                                placeholder={field.placeholder}
                                required
                              />
                            )}
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Description */}
                  <motion.div variants={itemVariants}>
                    <motion.div
                      className="flex items-center gap-3 mb-6 pb-4 border-b"
                      style={{ borderColor: colors.border, color: colors.textPrimary }}
                      variants={itemVariants}
                    >
                      <FiList />
                      <h3 className="text-lg font-light">Description *</h3>
                    </motion.div>
                    <motion.textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 border rounded-lg min-h-[140px]"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                        color: colors.textPrimary
                      }}
                      placeholder="Describe the product features, benefits, and saloon applications..."
                      required
                      whileFocus={{ scale: 1.01, borderColor: colors.accent }}
                    />
                  </motion.div>

                  {/* Product Details */}
                  <motion.div variants={itemVariants}>
                    <motion.div
                      className="flex items-center justify-between mb-6 pb-4 border-b"
                      style={{ borderColor: colors.border }}
                      variants={itemVariants}
                    >
                      <motion.div
                        className="flex items-center gap-3"
                        style={{ color: colors.textPrimary }}
                      >
                        <FiLayers />
                        <h3 className="text-lg font-light">Product Specifications</h3>
                      </motion.div>
                      <motion.button
                        type="button"
                        onClick={addProductDetail}
                        className="px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-lg"
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add Spec
                      </motion.button>
                    </motion.div>

                    <motion.div
                      className={`space-y-6 ${getGap('gap-4', 'gap-6', 'gap-6')}`}
                      variants={containerVariants}
                    >
                      {productDetails.map((detail, index) => (
                        <motion.div
                          key={index}
                          custom={index}
                          variants={formFieldVariants}
                          initial="hidden"
                          animate="visible"
                          className="border rounded-lg p-4"
                          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                          whileHover={{ borderColor: colors.accent }}
                        >
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            variants={containerVariants}
                          >
                            <motion.div variants={itemVariants}>
                              <motion.label
                                className="block text-xs uppercase tracking-wider font-medium mb-2"
                                style={{ color: colors.textPrimary }}
                                whileHover={{ x: 2 }}
                              >
                                Specification Name
                              </motion.label>
                              <motion.div
                                className="flex items-center gap-3 p-3 border rounded-lg"
                                style={{ borderColor: colors.border, backgroundColor: colors.background }}
                                whileFocusWithin={{ scale: 1.01, borderColor: colors.accent }}
                              >
                                <FiTruck className="text-gray-500" />
                                <input
                                  type="text"
                                  value={detail.pdName}
                                  onChange={(e) => updateProductDetailName(index, e.target.value)}
                                  className="w-full bg-transparent text-sm focus:outline-none"
                                  style={{ color: colors.textPrimary }}
                                  placeholder="e.g., Material, Dimensions"
                                  required={index < 2}
                                />
                              </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                              <motion.label
                                className="block text-xs uppercase tracking-wider font-medium mb-2"
                                style={{ color: colors.textPrimary }}
                                whileHover={{ x: 2 }}
                              >
                                Specification Value
                              </motion.label>
                              <motion.div
                                className="flex items-center gap-3 p-3 border rounded-lg"
                                style={{ borderColor: colors.border, backgroundColor: colors.background }}
                                whileFocusWithin={{ scale: 1.01, borderColor: colors.accent }}
                              >
                                <FiCheckCircle className="text-gray-500" />
                                <input
                                  type="text"
                                  value={detail.description}
                                  onChange={(e) => updateProductDetailDescription(index, e.target.value)}
                                  className="w-full bg-transparent text-sm focus:outline-none"
                                  style={{ color: colors.textPrimary }}
                                  placeholder="Enter specification value"
                                  required={index < 2}
                                />
                              </motion.div>
                            </motion.div>
                          </motion.div>

                          {productDetails.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => removeProductDetail(index)}
                              className="mt-4 px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-lg"
                              style={{ borderColor: colors.border, color: colors.textSecondary }}
                              whileHover={{ backgroundColor: colors.error, color: colors.background, borderColor: colors.error }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Remove Spec
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Form Actions */}
                  <motion.div
                    className="pt-6 border-t"
                    style={{ borderColor: colors.border }}
                    variants={itemVariants}
                  >
                    <motion.div
                      className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row'} items-center justify-between`}
                      variants={itemVariants}
                    >
                      <motion.div
                        className="text-xs text-gray-500"
                        variants={itemVariants}
                      >
                        <p className="uppercase tracking-wider">* Required fields</p>
                        <p className="mt-1">{productDetails.length} specifications</p>
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={isUploading}
                        className={`${isMobile ? 'w-full' : ''} px-8 py-4 text-xs uppercase tracking-wider font-medium rounded-lg`}
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                        whileHover={{ backgroundColor: colors.textPrimary, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        whileDisabled={{ opacity: 0.6 }}
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin" />
                            Creating Product...
                          </div>
                        ) : 'Create Product'}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </form>
            </motion.div>

            {/* Guide Information */}
            <motion.div
              className="bg-white border rounded-lg mt-8"
              style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              variants={itemVariants}
            >
              <motion.div
                className="p-6"
                variants={containerVariants}
              >
                <motion.h3 className="text-lg font-light mb-6" style={{ color: colors.textPrimary }} variants={itemVariants}>
                  Specification Guide
                </motion.h3>
                <motion.div
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} ${getGap('gap-4', 'gap-6', 'gap-6')}`}
                  variants={containerVariants}
                >
                  {[
                    { title: "Specifications", desc: "Appear in product detail section", icon: FiTruck },
                    { title: "Custom Names", desc: "Tailor to saloon interior needs", icon: FiTag },
                    { title: "Complete Details", desc: "Help customers make informed decisions", icon: FiCheckCircle }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: colors.surface }}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="text-gray-600" />
                      </motion.div>
                      <motion.h4
                        className="text-xs uppercase tracking-wider font-medium mb-1"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.title}
                      </motion.h4>
                      <motion.p
                        className="text-xs text-gray-500"
                        variants={itemVariants}
                      >
                        {item.desc}
                      </motion.p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductList;