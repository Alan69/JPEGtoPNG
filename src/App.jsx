import { useState, useCallback } from "react";
import {
  RefreshCw,
  Image as ImageIcon,
  Zap,
  Download,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import AdBanner from "./components/AdBanner";
import ImageUploader from "./components/ImageUploader";
import ImagePreview from "./components/ImagePreview";

/**
 * Main App Component
 * Image Converter with Google AdSense integration
 * Features:
 * - Upload multiple JPEG/PNG images
 * - Convert between JPEG and PNG formats
 * - Download converted images
 * - Google AdSense integration
 * - Responsive design with TailwindCSS
 */
function App() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  /**
   * Processes uploaded files and creates preview URLs
   * @param {Array} files - Array of uploaded files
   */
  const processFiles = useCallback(async (files) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const processedImages = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const previewUrl = URL.createObjectURL(file);

        processedImages.push({
          originalFile: file,
          previewUrl: previewUrl,
          error: null,
        });

        setProcessingProgress(((i + 1) / files.length) * 100);

        // Small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        processedImages.push({
          originalFile: files[i],
          previewUrl: null,
          error: error.message,
        });
      }
    }

    setImages(processedImages);
    setIsProcessing(false);
    setProcessingProgress(0);
  }, []);

  /**
   * Handles file selection from uploader
   * @param {Array} files - Selected files
   */
  const handleFilesSelected = useCallback(
    (files) => {
      processFiles(files);
    },
    [processFiles]
  );

  /**
   * Clears all processed images
   */
  const clearAllImages = useCallback(() => {
    // Clean up object URLs to prevent memory leaks
    images.forEach((img) => {
      if (img.previewUrl) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setImages([]);
  }, [images]);

  /**
   * Converts image format using HTML5 Canvas API
   * @param {File} file - Original image file
   * @param {string} targetFormat - Target format ('png' or 'jpeg')
   * @returns {Promise<Blob>} Converted image blob
   */
  const convertImageFormat = useCallback(async (file, targetFormat) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
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
              reject(new Error("Failed to convert image"));
            }
          },
          `image/${targetFormat}`,
          targetFormat === "jpeg" ? 0.9 : 1.0 // JPEG quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  /**
   * Downloads a converted image
   * @param {Object} imageObj - Image object with original file
   * @param {number} index - Index of the image
   */
  const downloadImage = useCallback(
    async (imageObj) => {
      try {
        const originalFile = imageObj.originalFile;
        const targetFormat = originalFile.type.includes("jpeg")
          ? "png"
          : "jpeg";

        // Convert the image
        const convertedBlob = await convertImageFormat(
          originalFile,
          targetFormat
        );

        // Create download link
        const url = URL.createObjectURL(convertedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${originalFile.name.split(".")[0]}.${targetFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download image. Please try again.");
      }
    },
    [convertImageFormat]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Image Converter
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Convert JPEG ↔ PNG instantly in your browser
                </p>
              </div>
            </div>

            {images.length > 0 && (
              <button
                onClick={clearAllImages}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ad Banner - Top */}
        <AdBanner
          clientId="ca-pub-xxxxxxxxxxxxxx"
          slot="1234567890"
          className="mb-12"
        />

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Convert Images
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Instantly & Free
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your JPEG and PNG images in seconds. No uploads, no
              waiting, no data sent to servers. Everything happens right in your
              browser.
            </p>

            {/* Quick Stats */}
          </div>
        </section>

        {/* Upload Section */}
        <section className="mb-16">
          <ImageUploader
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
          />

          {/* Processing Progress */}
          {isProcessing && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Processing images...
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(processingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Converting your images...
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        {images.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" />
                <span>
                  {images.filter((img) => !img.error).length} images ready for
                  download
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Images
              </h3>
              <p className="text-gray-600">
                Uploaded images and their converted versions
              </p>
            </div>

            {/* Combined Image Display */}
            <div className="space-y-6">
              {images.map((imageObj, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 items-start"
                >
                  {/* Original Image */}
                  <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20">
                    <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img
                        src={imageObj.previewUrl}
                        alt={`Original ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 left-2">
                        <div className="bg-blue-100/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-blue-700">
                          Original
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-gray-500 truncate">
                        {imageObj.originalFile.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {(imageObj.originalFile.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </div>
                    </div>
                  </div>

                  {/* Arrow between images */}
                  <div className="hidden sm:flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Converted Image */}
                  <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20">
                    <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img
                        src={imageObj.previewUrl}
                        alt={`Converted ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 left-2">
                        <div className="bg-green-100/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-green-700">
                          {imageObj.originalFile.type.includes("jpeg")
                            ? "PNG"
                            : "JPEG"}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="p-1 rounded-lg backdrop-blur-sm bg-green-100/80">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-gray-500 truncate">
                        {imageObj.originalFile.name.split(".")[0]}.
                        {imageObj.originalFile.type.includes("jpeg")
                          ? "png"
                          : "jpeg"}
                      </div>
                      <button
                        onClick={() => downloadImage(imageObj, index)}
                        className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-xs hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ad Banner - Bottom */}
        <AdBanner
          clientId="ca-pub-xxxxxxxxxxxxxx"
          slot="0987654321"
          className="mt-16"
        />
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Image Converter
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Convert images instantly in your browser - no data sent to servers
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>✓ 100% Private</span>
              <span>✓ No Uploads</span>
              <span>✓ Instant Processing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
