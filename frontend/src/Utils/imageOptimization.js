/**
 * Image Optimization Utilities
 * Provides utilities for optimizing images with lazy loading, responsive images, and WebP support
 */

/**
 * Optimize Unsplash image URLs with proper parameters
 * @param {string} url - Original Unsplash URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized URL
 */
export const optimizeUnsplashUrl = (url, options = {}) => {
    const {
        width = 800,
        quality = 80,
        format = 'auto',
        fit = 'crop',
    } = options;

    // Check if it's an Unsplash URL
    if (!url || !url.includes('unsplash.com')) {
        return url;
    }

    // Parse existing URL parameters
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    // Set optimization parameters
    params.set('w', width);
    params.set('q', quality);
    params.set('fm', format);
    params.set('fit', fit);
    params.set('auto', 'format'); // Auto format selection

    // Return optimized URL
    return `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
};

/**
 * Generate responsive image srcset for different screen sizes
 * @param {string} url - Base image URL
 * @returns {string} - srcset string
 */
export const generateSrcSet = (url) => {
    if (!url || !url.includes('unsplash.com')) {
        return '';
    }

    const sizes = [320, 640, 768, 1024, 1280, 1920];
    const srcset = sizes
        .map((size) => {
            const optimizedUrl = optimizeUnsplashUrl(url, { width: size });
            return `${optimizedUrl} ${size}w`;
        })
        .join(', ');

    return srcset;
};

/**
 * Get appropriate sizes attribute for responsive images
 * @param {string} type - Image type (hero, card, thumbnail, etc.)
 * @returns {string} - sizes attribute value
 */
export const getImageSizes = (type = 'default') => {
    const sizeMap = {
        hero: '100vw',
        card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
        thumbnail: '(max-width: 768px) 50vw, 25vw',
        full: '100vw',
        default: '(max-width: 768px) 100vw, 50vw',
    };

    return sizeMap[type] || sizeMap.default;
};

/**
 * Lazy load image with intersection observer
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source
 */
export const lazyLoadImage = (img, src) => {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = src;
                        image.classList.add('loaded');
                        observer.unobserve(image);
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before entering viewport
            }
        );

        observer.observe(img);
    } else {
        // Fallback for browsers without IntersectionObserver
        img.src = src;
    }
};

/**
 * Check if browser supports WebP format
 * @returns {Promise<boolean>}
 */
export const supportsWebP = () => {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src =
            'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
};

/**
 * Get optimized image format based on browser support
 * @returns {Promise<string>} - 'webp' or 'jpg'
 */
export const getOptimalFormat = async () => {
    const hasWebP = await supportsWebP();
    return hasWebP ? 'webp' : 'jpg';
};

/**
 * Preload critical images
 * @param {string[]} urls - Array of image URLs to preload
 */
export const preloadImages = (urls) => {
    urls.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
    });
};

/**
 * Calculate blur data URL for placeholder
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @returns {string} - Data URL for blur placeholder
 */
export const getBlurDataURL = (width = 10, height = 10) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return canvas.toDataURL();
};
