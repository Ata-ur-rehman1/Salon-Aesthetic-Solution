import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import {
  FiEdit2, FiTrash2, FiPlus, FiList, FiLayers, FiTag, FiX,
  FiPackage
} from "react-icons/fi";
import Loader from "../../components/Loader";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

const CategoryList = () => {
  // ELEGANT WHITE & PINK COLOR SCHEME
  const colors = {
    background: "#ffffff",      // Pure white
    textPrimary: "#333333",     // Soft dark gray
    textSecondary: "#888888",   // Lighter gray
    accent: "#ec4899",          // Beautiful Pink (Tailwind pink-500)
    border: "#fce7f3",          // Very light pink borders
    surface: "#fdf2f8",         // Surface pink
    surfaceHover: "#fdf2f8",    // Light pink hover state
    shadow: "rgba(236, 72, 153, 0.1)", // Soft pink shadow
    success: "#10b981",
    error: "#ef4444"
  };

  const { data: categories, isLoading, error } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

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

  // Responsive Typography & Spacing Helpers
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.05, duration: 0.4, ease: "easeOut" }
    },
    hover: {
      y: -4,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  // Handlers
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} category created successfully!`);
      }
    } catch (error) {
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} category updated successfully!`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      toast.error("Updating category failed, try again.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} category deleted successfully!`);
        setSelectedCategory(null);
        setModalVisible(false);
        setDeleteConfirmVisible(false);
      }
    } catch (error) {
      toast.error("Category deletion failed. Try again.");
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
    setModalVisible(true);
  };

  const openDeleteConfirm = (category) => {
    setSelectedCategory(category);
    setDeleteConfirmVisible(true);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-4xl mb-6" variants={itemVariants}>⚠️</motion.div>
          <motion.h3 className="text-xl font-light mb-2" style={{ color: colors.textPrimary }} variants={itemVariants}>
            Error Loading Categories
          </motion.h3>
          <motion.p className="text-sm mb-8" style={{ color: colors.textSecondary }} variants={itemVariants}>
            Please try again later
          </motion.p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-xs uppercase tracking-wider font-medium border hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-colors"
            style={{ borderColor: colors.accent, color: colors.accent }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Page
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4 py-6' : isTablet ? 'px-6 py-8' : 'px-8 py-12'}`}>
        {/* Header */}
        <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
            style={{ color: colors.textSecondary }}
          >
            System Structure
          </motion.span>
          <motion.h1 className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter text-black`} style={{ letterSpacing: '-0.02em' }}>
            Category Directory
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 bg-pink-500 mx-auto mt-6" style={{ opacity: 0.8 }}
          />
        </motion.div>

        <div className={`grid ${isDesktop ? 'lg:grid-cols-3' : ''} ${getGap('gap-6', 'gap-8', 'gap-12')}`}>
          {/* Create Section */}
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
                  <FiPlus className="text-gray-600" />
                </motion.div>
                <motion.h2 className="text-xl md:text-2xl font-light tracking-tighter" style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}>
                  New Entry
                </motion.h2>
              </motion.div>

              <CategoryForm
                value={name}
                setValue={setName}
                handleSubmit={handleCreateCategory}
                buttonText="Create Category"
                placeholder="e.g., Salon Chairs, Reception Desks..."
                className="w-full"
              />
            </motion.div>
          </motion.div>

          {/* Categories List */}
          <motion.div className={`${isDesktop ? 'lg:col-span-2' : ''}`} variants={itemVariants}>
            <motion.div
              className="bg-white border rounded-lg p-6 mb-6"
              style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            >
              <motion.div
                className="flex items-center justify-between mb-6 pb-4 border-b"
                style={{ borderColor: colors.border }}
                variants={itemVariants}
              >
                <motion.div
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.surface }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiList className="text-gray-600" />
                  </motion.div>
                  <div>
                    <motion.h2 className="text-xl md:text-2xl font-light tracking-tighter" style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}>
                      Active Categories
                    </motion.h2>
                    <motion.p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40" variants={itemVariants}>
                      {categories?.length || 0} SECTIONS • CURATED SELECTION
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>

              {categories?.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: colors.surface }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <FiPackage className="text-2xl text-gray-400" />
                  </motion.div>
                  <motion.h4 className="text-lg font-light mb-2" style={{ color: colors.textPrimary }}>
                    No categories yet
                  </motion.h4>
                  <motion.p className="text-sm text-gray-500" variants={itemVariants}>
                    Create your first category to organize salon interior products.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} ${getGap('gap-4', 'gap-6', 'gap-6')}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {categories?.map((category, index) => (
                    <motion.div
                      key={category._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="group border rounded-lg p-4"
                      style={{ borderColor: colors.border, backgroundColor: colors.background }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                            <motion.div
                              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: colors.surface }}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <div className="text-lg font-light tracking-tighter" style={{ color: colors.accent }}>
                                {category.name.charAt(0).toUpperCase()}
                              </div>
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <motion.h3 className="font-light text-base tracking-tight mb-1" style={{ color: colors.textPrimary }}>
                                {category.name}
                              </motion.h3>
                              <div className="flex items-center gap-2">
                                <FiTag className="text-gray-400" />
                                <p className="text-[10px] uppercase tracking-wider font-bold opacity-30">
                                  REF: {category._id.substring(0, 8)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-20">
                            <FiPackage />
                            <span>Inventory Asset</span>
                          </div>
                        </div>

                        <motion.div
                          className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <motion.button
                            onClick={() => openEditModal(category)}
                            className="p-2 border rounded"
                            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                            whileHover={{ scale: 1.1, backgroundColor: colors.background }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit2 className="text-gray-600" />
                          </motion.button>

                          <motion.button
                            onClick={() => openDeleteConfirm(category)}
                            className="p-2 border rounded"
                            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                            whileHover={{ scale: 1.1, backgroundColor: colors.error, borderColor: colors.error }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiTrash2 className="text-gray-600" />
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Stats Card */}
            {categories?.length > 0 && (
              <motion.div
                className="bg-white border rounded-lg p-6"
                style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
                whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                variants={itemVariants}
              >
                <motion.h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-6" style={{ color: colors.textPrimary }} variants={itemVariants}>
                  Metric Overview
                </motion.h3>
                <motion.div
                  className="grid grid-cols-3 gap-4"
                  variants={containerVariants}
                >
                  <motion.div className="text-center p-4 border rounded-lg" style={{ borderColor: colors.border }} variants={itemVariants}>
                    <motion.div className="text-2xl font-light tracking-tighter mb-1" style={{ color: colors.textPrimary }}>
                      {categories.length}
                    </motion.div>
                    <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Count</div>
                  </motion.div>
                  <motion.div className="text-center p-4 border rounded-lg" style={{ borderColor: colors.border }} variants={itemVariants}>
                    <motion.div className="text-2xl font-light tracking-tighter mb-1" style={{ color: colors.textPrimary }}>
                      100%
                    </motion.div>
                    <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Coverage</div>
                  </motion.div>
                  <motion.div className="text-center p-4 border rounded-lg" style={{ borderColor: colors.border }} variants={itemVariants}>
                    <motion.div className="text-2xl font-light tracking-tighter mb-1" style={{ color: colors.textPrimary }}>
                      Live
                    </motion.div>
                    <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Status</div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedCategory(null);
            setUpdatingName("");
          }}
        >
          <motion.div
            className="bg-white border rounded-lg p-6"
            style={{ borderColor: colors.border }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <motion.div
              className="flex items-center justify-between mb-6 pb-4 border-b"
              style={{ borderColor: colors.border }}
            >
              <motion.div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  whileHover={{ scale: 1.1 }}
                >
                  <FiEdit2 className="text-gray-600" />
                </motion.div>
                <h3 className="text-lg font-light" style={{ color: colors.textPrimary }}>
                  Edit Category
                </h3>
              </motion.div>
              <motion.button
                onClick={() => setModalVisible(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="text-gray-600" />
              </motion.button>
            </motion.div>

            <CategoryForm
              value={updatingName}
              setValue={setUpdatingName}
              handleSubmit={handleUpdateCategory}
              buttonText="Update Category"
              placeholder="Update category name..."
            />
          </motion.div>
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          isOpen={deleteConfirmVisible}
          onClose={() => {
            setDeleteConfirmVisible(false);
            setSelectedCategory(null);
          }}
        >
          <motion.div
            className="bg-white border rounded-lg p-6 text-center"
            style={{ borderColor: colors.border }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: colors.surface }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FiTrash2 className="text-xl text-gray-600" />
            </motion.div>

            <motion.h3 className="text-lg font-light mb-2" style={{ color: colors.textPrimary }}>
              Delete Category
            </motion.h3>

            <motion.p className="text-sm mb-8" style={{ color: colors.textSecondary }}>
              Delete "{selectedCategory?.name}"? This action cannot be undone.
            </motion.p>

            <motion.div className="flex gap-3">
              <motion.button
                onClick={() => setDeleteConfirmVisible(false)}
                className="flex-1 px-6 py-3 border text-xs uppercase tracking-wider"
                style={{ borderColor: colors.border, color: colors.textSecondary }}
                whileHover={{ backgroundColor: colors.surface }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleDeleteCategory}
                className="flex-1 px-6 py-3 text-xs uppercase tracking-wider text-white"
                style={{ backgroundColor: colors.error }}
                whileHover={{ backgroundColor: colors.textPrimary }}
                whileTap={{ scale: 0.98 }}
              >
                Delete
              </motion.button>
            </motion.div>
          </motion.div>
        </Modal>
      </div>
    </motion.div>
  );
};

export default CategoryList;