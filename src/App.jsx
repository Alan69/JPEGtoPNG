import { useState, useCallback } from "react";
import {
  RefreshCw,
  Image as ImageIcon,
  Zap,
  Download,
  ArrowRight,
  CheckCircle,
  Globe,
} from "lucide-react";
import AdBanner from "./components/AdBanner";
import ImageUploader from "./components/ImageUploader";
import ImagePreview from "./components/ImagePreview";

// Language translations
const translations = {
  en: {
    title: "Image Converter",
    subtitle: "Convert JPEG ↔ PNG instantly in your browser",
    clearAll: "Clear All",
    convertImages: "Convert Images",
    instantlyFree: "Instantly & Free",
    transformDescription:
      "Transform your JPEG and PNG images in seconds. No uploads, no waiting, no data sent to servers. Everything happens right in your browser.",
    processingImages: "Processing images...",
    convertingImages: "Converting your images...",
    imagesReady: "images ready for download",
    yourImages: "Your Images",
    uploadedImages: "Uploaded images and their converted versions",
    original: "Original",
    download: "Download",
    footerText:
      "Convert images instantly in your browser - no data sent to servers",
    private: "100% Private",
    noUploads: "No Uploads",
    instantProcessing: "Instant Processing",
  },
  ru: {
    title: "Конвертер Изображений",
    subtitle: "Мгновенное преобразование JPEG ↔ PNG в вашем браузере",
    clearAll: "Очистить всё",
    convertImages: "Конвертировать Изображения",
    instantlyFree: "Мгновенно и Бесплатно",
    transformDescription:
      "Преобразуйте ваши изображения JPEG и PNG за секунды. Без загрузок на сервер, без ожидания, без отправки данных. Всё происходит прямо в вашем браузере.",
    processingImages: "Обработка изображений...",
    convertingImages: "Конвертация ваших изображений...",
    imagesReady: "изображений готово к скачиванию",
    yourImages: "Ваши Изображения",
    uploadedImages: "Загруженные изображения и их конвертированные версии",
    original: "Оригинал",
    download: "Скачать",
    footerText:
      "Мгновенная конвертация изображений в вашем браузере - без отправки данных на серверы",
    private: "100% Приватно",
    noUploads: "Без Загрузок",
    instantProcessing: "Мгновенная Обработка",
  },
  kk: {
    title: "Сурет Түрлендіргіш",
    subtitle: "JPEG ↔ PNG пішімдерін браузеріңізде лезде түрлендіріңіз",
    clearAll: "Барлығын тазалау",
    convertImages: "Суреттерді Түрлендіру",
    instantlyFree: "Жылдам және Тегін",
    transformDescription:
      "JPEG және PNG суреттеріңізді секундтар ішінде түрлендіріңіз. Серверге жүктеусіз, күтусіз, деректерді жібермей. Барлығы тікелей браузеріңізде орындалады.",
    processingImages: "Суреттер өңделуде...",
    convertingImages: "Суреттеріңіз түрлендірілуде...",
    imagesReady: "сурет жүктеуге дайын",
    yourImages: "Сіздің Суреттеріңіз",
    uploadedImages: "Жүктелген суреттер және олардың түрлендірілген нұсқалары",
    original: "Түпнұсқа",
    download: "Жүктеу",
    footerText:
      "Суреттерді браузеріңізде лезде түрлендіріңіз - серверлерге деректер жіберілмейді",
    private: "100% Құпия",
    noUploads: "Жүктеусіз",
    instantProcessing: "Лезде Өңдеу",
  },
};

/**
 * Main App Component
 * Image Converter with Google AdSense integration
 * Features:
 * - Upload multiple JPEG/PNG images
 * - Convert between JPEG and PNG formats
 * - Download converted images
 * - Google AdSense integration
 * - Responsive design with TailwindCSS
 * - Multilingual support (English, Russian, Kazakh)
 */
function App() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [language, setLanguage] = useState("en");

  // Get translations based on selected language
  const t = translations[language];

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <div className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer">
                  <Globe className="w-4 h-4" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 cursor-pointer text-sm font-medium"
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                    <option value="kk">Қазақша</option>
                  </select>
                </div>
              </div>

              {images.length > 0 && (
                <button
                  onClick={clearAllImages}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.clearAll}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Ad Banner - Top */}
        <AdBanner
          clientId="ca-pub-6354681495028216"
          slot="9819433163"
          className="mb-12"
        />

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.convertImages}
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                {t.instantlyFree}
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t.transformDescription}
            </p>

            {/* Quick Stats */}
          </div>
        </section>

        {/* Upload Section */}
        <section className="mb-16">
          <ImageUploader
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
            language={language}
          />

          {/* Processing Progress */}
          {isProcessing && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    {t.processingImages}
                  </span>
                  <span className="text-sm text-gray-500 font-semibold">
                    {Math.round(processingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {t.convertingImages}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        {images.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-5 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
                <CheckCircle className="w-5 h-5" />
                <span>
                  {images.filter((img) => !img.error).length} {t.imagesReady}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t.yourImages}
              </h3>
              <p className="text-gray-600">{t.uploadedImages}</p>
            </div>

            {/* Combined Image Display */}
            <div className="space-y-8">
              {images.map((imageObj, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-6 items-start"
                >
                  {/* Original Image */}
                  <div className="flex-1 bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-shadow duration-300">
                    <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img
                        src={imageObj.previewUrl}
                        alt={`Original ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-3 left-3">
                        <div className="bg-blue-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
                          {t.original}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-gray-700 truncate font-medium">
                        {imageObj.originalFile.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(imageObj.originalFile.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </div>
                    </div>
                  </div>

                  {/* Arrow between images */}
                  <div className="hidden sm:flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-purple-400" />
                  </div>

                  {/* Converted Image */}
                  <div className="flex-1 bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-shadow duration-300">
                    <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img
                        src={imageObj.previewUrl}
                        alt={`Converted ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-3 left-3">
                        <div className="bg-green-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 shadow-sm">
                          {imageObj.originalFile.type.includes("jpeg")
                            ? "PNG"
                            : "JPEG"}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="p-1 rounded-lg backdrop-blur-sm bg-green-100/80 shadow-sm">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-gray-700 truncate font-medium">
                        {imageObj.originalFile.name.split(".")[0]}.
                        {imageObj.originalFile.type.includes("jpeg")
                          ? "png"
                          : "jpeg"}
                      </div>
                      <button
                        onClick={() => downloadImage(imageObj, index)}
                        className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:translate-y-[-2px]"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.download}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Ad Banner - Bottom */}
            <div className="sticky bottom-0 z-40 w-full bg-white/80 backdrop-blur-md py-4 border-t border-gray-200/50 shadow-lg">
              <AdBanner
                clientId="ca-pub-6354681495028216"
                slot="9819433163"
                className="max-w-7xl mx-auto"
              />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {t.title}
              </span>
            </div>
            <p className="text-gray-600 mb-6">{t.footerText}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span className="bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                ✓ {t.private}
              </span>
              <span className="bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                ✓ {t.noUploads}
              </span>
              <span className="bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                ✓ {t.instantProcessing}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
