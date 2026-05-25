import { useState, useEffect, useRef } from 'react';
import { optimizeUnsplashUrl, generateSrcSet, getImageSizes, getBlurDataURL } from '../utils/imageOptimization';

/**
 * Optimized Image Component
 * Provides lazy loading, responsive images, and blur-up placeholder
 */
const OptimizedImage = ({
    src,
    alt,
    className = '',
    width,
    height,
    type = 'default',
    priority = false,
    onLoad,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority); // Load immediately if priority
    const imgRef = useRef(null);
    const placeholderSrc = getBlurDataURL();

    useEffect(() => {
        if (priority) return; // Skip intersection observer for priority images

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before entering viewport
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [priority]);

    const handleLoad = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
    };

    // Optimize the source URL
    const optimizedSrc = src.includes('unsplash.com')
        ? optimizeUnsplashUrl(src, { width: width || 800 })
        : src;

    // Generate srcset for responsive images
    const srcSet = src.includes('unsplash.com') ? generateSrcSet(src) : '';

    // Get sizes attribute
    const sizes = getImageSizes(type);

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={{
                width: width || '100%',
                height: height || 'auto',
            }}
        >
            {/* Blur placeholder */}
            {!isLoaded && (
                <img
                    src={placeholderSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                    aria-hidden="true"
                />
            )}

            {/* Actual image */}
            <img
                src={isInView ? optimizedSrc : placeholderSrc}
                srcSet={isInView && srcSet ? srcSet : undefined}
                sizes={isInView && sizes ? sizes : undefined}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={handleLoad}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
