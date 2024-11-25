import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const ImageGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Xử lý chuỗi images thành mảng
  const imageArray = typeof images === 'string' ? images.split(',').map(url => url.trim()) : [];

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || imageArray.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full mb-20">
      <div className="w-full h-[400px]">
        <img
          src={imageArray[currentImageIndex]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Navigation buttons */}
        <button
          onClick={goToPreviousImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ArrowBack />
        </button>
        <button
          onClick={goToNextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ArrowForward />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {imageArray.length}
        </div>
      </div>

      {/* Thumbnail navigation với style ẩn scrollbar */}
      <div 
        className="absolute -bottom-16 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4 no-scrollbar"
        style={{
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none'     /* Firefox */
        }}
      >
        <style>
          {`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {imageArray.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
              index === currentImageIndex ? 'border-yellow-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.string
};

ImageGallery.defaultProps = {
  images: ''
};

export default ImageGallery; 