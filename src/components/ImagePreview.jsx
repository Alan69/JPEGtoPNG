import { useState, useCallback } from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle, FileImage, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * ImagePreview Component
 * Displays converted images with download functionality
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of converted image objects
 * @param {string} props.className - Additional CSS classes
 */
const ImagePreview = ({ images = [], className = "" }) => {
  const [downloading, setDownloading] = useState(new Set());

  /**
   * Converts image format using HTML5 Canvas API
   * @param {File} file - Original image file
   * @param {string} targetFormat - Target format ('png' or 'jpeg')
   * @returns {Promise<Blob>} Converted image blob
   */
  const convertImageFormat = useCallback(async (file, targetFormat) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert to the target format
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          `image/${targetFormat}`,
          targetFormat === 'jpeg' ? 0.9 : 1.0 // JPEG quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  /**
   * Downloads a converted image
   * @param {Object} imageObj - Image object with original file and converted blob
   * @param {number} index - Index of the image
   */
  const downloadImage = useCallback(async (imageObj, index) => {
    if (downloading.has(index)) return;

    setDownloading(prev => new Set(prev).add(index));

    try {
      const originalFile = imageObj.originalFile;
      const targetFormat = originalFile.type.includes('jpeg') ? 'png' : 'jpeg';
      
      // Convert the image
      const convertedBlob = await convertImageFormat(originalFile, targetFormat);
      
      // Create download link
      const url = URL.createObjectURL(convertedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${originalFile.name.split('.')[0]}.${targetFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  }, [downloading, convertImageFormat]);

  /**
   * Gets the appropriate icon for the conversion status
   * @param {Object} imageObj - Image object
   * @returns {JSX.Element} Status icon
   */
  const getStatusIcon = (imageObj) => {
    if (imageObj.error) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  /**
   * Gets the conversion info text
   * @param {Object} imageObj - Image object
   * @returns {string} Conversion info
   */
  const getConversionInfo = (imageObj) => {
    if (imageObj.error) {
      return 'Conversion failed';
    }
    
    const originalFormat = imageObj.originalFile.type.includes('jpeg') ? 'JPEG' : 'PNG';
    const targetFormat = originalFormat === 'JPEG' ? 'PNG' : 'JPEG';
    return `${originalFormat} → ${targetFormat}`;
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((imageObj, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300 group"
          >
            {/* Image Preview */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              <img
                src={imageObj.previewUrl}
                alt={`Converted ${index + 1}`}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Status Overlay */}
              <div className="absolute top-4 right-4">
                <div className={cn(
                  "p-2 rounded-xl backdrop-blur-sm",
                  imageObj.error ? "bg-red-100/80" : "bg-green-100/80"
                )}>
                  {getStatusIcon(imageObj)}
                </div>
              </div>

              {/* Format Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {imageObj.originalFile.type.includes('jpeg') ? 'JPEG' : 'PNG'}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* Image Info */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 truncate text-sm">
                  {imageObj.originalFile.name}
                </h3>
                
                {/* Conversion Info */}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(imageObj)}
                  <span className="text-sm font-medium text-gray-700">
                    {getConversionInfo(imageObj)}
                  </span>
                </div>
                
                {/* File Size */}
                <div className="text-sm text-gray-500">
                  {(imageObj.originalFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => downloadImage(imageObj, index)}
                disabled={downloading.has(index) || imageObj.error}
                className={cn(
                  "w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm",
                  imageObj.error
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : downloading.has(index)
                    ? "bg-blue-100 text-blue-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
                )}
              >
                {downloading.has(index) ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>

              {/* Error Message */}
              {imageObj.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{imageObj.error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Batch Download Option */}
      {images.length > 1 && (
        <div className="mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Download All</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Download all {images.filter(img => !img.error).length} converted images at once
            </p>
            <button
              onClick={() => {
                images.forEach((imageObj, index) => {
                  if (!imageObj.error) {
                    setTimeout(() => downloadImage(imageObj, index), index * 500);
                  }
                });
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Download className="w-5 h-5" />
              <span>Download All ({images.filter(img => !img.error).length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
