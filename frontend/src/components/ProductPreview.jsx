import { motion } from "framer-motion";

const ProductPreview = ({ product, style }) => {
    if (!product) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                width: "22rem",
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(20px)",
                borderRadius: "1rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.5) inset",
                padding: "1rem",
                overflow: "hidden",
                ...style, // Allow overriding styles (position, top, left) from parent
            }}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                {product.countInStock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                        Out of Stock
                    </div>
                )}
                {product.brand && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">
                        {product.brand}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1" title={product.name}>
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>
                                    {i < Math.round(product.rating || 0) ? "★" : "☆"}
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                            ({product.numReviews || 0})
                        </span>
                    </div>
                    <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${product.countInStock > 0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}
                    >
                        {product.countInStock > 0 ? "In Stock" : "Unavailable"}
                    </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="pt-3 mt-2 border-t border-gray-200/60 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Price</span>
                        <span className="text-xl font-bold text-gray-900">
                            ${product.price}
                        </span>
                    </div>
                    <div className="text-[10px] text-gray-400 italic">
                        Press Enter to view
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductPreview;
