import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ 
  value, 
  text, 
  color = "text-amber-400",
  showValue = true,
  size = "medium"
}) => {
  const fullStars = Math.floor(value);
  const decimalPart = value - fullStars;
  const hasHalfStar = decimalPart >= 0.25 && decimalPart <= 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    small: "text-base",
    medium: "text-xl md:text-2xl",
    large: "text-3xl md:text-4xl"
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, index) => (
          <span
            key={`full-${index}`}
            className={`${color} ${sizeClasses[size]}`}
          >
            <FaStar />
          </span>
        ))}
        
        {/* Half Star */}
        {hasHalfStar && (
          <span className={`${color} ${sizeClasses[size]}`}>
            <FaStarHalfAlt />
          </span>
        )}
        
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <span
            key={`empty-${index}`}
            className={`text-gray-300 ${sizeClasses[size]}`}
          >
            <FaRegStar />
          </span>
        ))}
      </div>

      {/* Rating Value */}
      {showValue && (
        <span className="text-gray-700 font-semibold text-sm md:text-base ml-1">
          {value.toFixed(1)}
        </span>
      )}

      {/* Rating Text */}
      {text && (
        <span className="text-gray-500 text-sm md:text-base ml-1">
          {text}
        </span>
      )}
    </div>
  );
};

export default Ratings;