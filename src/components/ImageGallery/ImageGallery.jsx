import React, { useState, useEffect, useCallback } from 'react';

const ImageGallery = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageArray, setImageArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [preloadedImages, setPreloadedImages] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    
    const SLIDE_DURATION = 5000; // 6 giây

    const handleNextImage = useCallback(() => {
        setCurrentImageIndex((prev) => 
            prev === imageArray.length - 1 ? 0 : prev + 1
        );
    }, [imageArray.length]);

    const handlePrevImage = useCallback(() => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? imageArray.length - 1 : prev - 1
        );
    }, [imageArray.length]);

    // Xử lý preload ảnh
    useEffect(() => {
        const urls = images.split(', ');
        setImageArray(urls);

        const preloadImages = urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
        });

        Promise.all(preloadImages)
            .then(loadedImages => {
                setPreloadedImages(loadedImages);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error preloading images:', error);
                setIsLoading(false);
            });
    }, [images]);

    // Xử lý auto slide
    useEffect(() => {
        let slideTimer;
        
        if (!isLoading && imageArray.length > 1 && !isPaused) {
            slideTimer = setInterval(() => {
                handleNextImage();
            }, SLIDE_DURATION);
        }

        return () => {
            if (slideTimer) {
                clearInterval(slideTimer);
            }
        };
    }, [isLoading, imageArray.length, isPaused, handleNextImage]);

    return (
        <div 
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {isLoading ? (
                <div className="w-full h-64 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            ) : (
                <div className="relative h-64">
                    {imageArray.map((url, index) => (
                        <img 
                            key={url}
                            src={url}
                            alt={`Bar ${index + 1}`}
                            className={`absolute w-full h-64 object-cover rounded-lg mb-4 transition-transform duration-300 ease-in-out ${
                                index === currentImageIndex 
                                    ? 'translate-x-0 opacity-100' 
                                    : index < currentImageIndex 
                                        ? '-translate-x-full opacity-0' 
                                        : 'translate-x-full opacity-0'
                            }`}
                            style={{
                                zIndex: index === currentImageIndex ? 1 : 0
                            }}
                        />
                    ))}
                    
                    {/* Thêm thanh progress */}
                    {!isPaused && imageArray.length > 1 && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                            <div 
                                className="h-full bg-yellow-500 transition-all duration-300"
                                style={{
                                    width: '100%',
                                    animation: `slideProgress ${SLIDE_DURATION}ms linear infinite`
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {imageArray.length > 1 && !isLoading && (
                <>
                    <button 
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {imageArray.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentImageIndex 
                                        ? 'bg-yellow-500 w-4' 
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes slideProgress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default ImageGallery; 