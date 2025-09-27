import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, FileImage, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

// Language translations for the uploader component
const uploaderTranslations = {
  en: {
    uploadYourImages: "Upload Your Images",
    dragDrop: "Drag and drop your JPEG or PNG images here, or click the button below to browse",
    or: "or",
    browse: "Browse Files",
    onlyJpegPng: "Only JPEG and PNG files are supported",
    chooseFiles: "Choose Files",
    jpeg: "JPEG",
    png: "PNG"
  },
  ru: {
    uploadYourImages: "Загрузите Ваши Изображения",
    dragDrop: "Перетащите ваши JPEG или PNG изображения сюда, или нажмите на кнопку ниже для выбора",
    or: "или",
    browse: "Выбрать Файлы",
    onlyJpegPng: "Поддерживаются только файлы JPEG и PNG",
    chooseFiles: "Выбрать Файлы",
    jpeg: "JPEG",
    png: "PNG"
  },
  kk: {
    uploadYourImages: "Суреттеріңізді Жүктеңіз",
    dragDrop: "JPEG немесе PNG суреттеріңізді осында сүйреп әкеліңіз, немесе төмендегі батырманы басып таңдаңыз",
    or: "немесе",
    browse: "Файлдарды Таңдау",
    onlyJpegPng: "Тек JPEG және PNG файлдары қолдау табады",
    chooseFiles: "Файлдарды Таңдау",
    jpeg: "JPEG",
    png: "PNG"
  }
};

/**
 * ImageUploader Component
 * Handles file upload with drag-and-drop functionality
 * @param {Object} props - Component props
 * @param {Function} props.onFilesSelected - Callback when files are selected
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.language - Selected language (en, ru, kk)
 */
const ImageUploader = ({ 
  onFilesSelected, 
  isLoading = false, 
  className = "",
  language = "en" 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Get translations based on selected language
  const t = uploaderTranslations[language] || uploaderTranslations.en;

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isLoading) setIsDragOver(true);
    },
    [isLoading]
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (isLoading) return;

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "image/jpeg" || file.type === "image/png"
      );

      if (files.length > 0) {
        setSelectedFiles(files);
        onFilesSelected(files);
      }
    },
    [isLoading, onFilesSelected]
  );

  const handleFileChange = useCallback(
    (e) => {
      if (isLoading) return;

      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      onFilesSelected(files);
    },
    [isLoading, onFilesSelected]
  );

  return (
    <div className={cn("w-full", className)}>
      <h3 className="text-2xl font-bold text-center mb-6">{t.uploadYourImages}</h3>
      
      <div
        className={cn(
          "w-full border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm",
          isDragOver
            ? "border-blue-500 bg-blue-50/50"
            : "border-gray-300 hover:border-gray-400",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isLoading) setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          
          if (isLoading) return;
          
          const files = Array.from(e.dataTransfer.files).filter(
            (file) => file.type === "image/jpeg" || file.type === "image/png"
          );
          
          if (files.length > 0) {
            setSelectedFiles(files);
            onFilesSelected(files);
          }
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              {t.dragDrop}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-lg">
              <FileImage className="w-5 h-5 text-gray-600" />
              <span className="font-medium">{t.jpeg}</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-lg">
              <FileImage className="w-5 h-5 text-gray-600" />
              <span className="font-medium">{t.png}</span>
            </div>
          </div>
          
          <label className="cursor-pointer w-full max-w-xs">
            <div className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-base hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:translate-y-[-2px]">
              <Plus className="w-5 h-5" />
              <span>{t.chooseFiles}</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              multiple
              onChange={(e) => {
                if (isLoading) return;
                
                const files = Array.from(e.target.files);
                setSelectedFiles(files);
                onFilesSelected(files);
              }}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
