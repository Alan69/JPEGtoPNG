import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, FileImage, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * ImageUploader Component
 * Handles file upload with drag-and-drop functionality
 * @param {Object} props - Component props
 * @param {Function} props.onFilesSelected - Callback when files are selected
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.className - Additional CSS classes
 */
const ImageUploader = ({ onFilesSelected, isLoading = false, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  /**
   * Validates if the file is a valid image format
   * @param {File} file - File to validate
   * @returns {boolean} True if valid image
   */
  const isValidImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  };

  /**
   * Handles file selection from input or drag-and-drop
   * @param {FileList} files - Selected files
   */
  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(isValidImage);
    
    if (validFiles.length !== fileArray.length) {
      alert('Please select only JPEG or PNG images.');
    }
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected]);

  /**
   * Handles drag over event
   * @param {DragEvent} e - Drag event
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  /**
   * Handles drag leave event
   * @param {DragEvent} e - Drag event
   */
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  /**
   * Handles drop event
   * @param {DragEvent} e - Drop event
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  /**
   * Handles file input change
   * @param {Event} e - Input change event
   */
  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    handleFiles(files);
  }, [handleFiles]);

  /**
   * Removes a file from the selected files list
   * @param {number} index - Index of file to remove
   */
  const removeFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Clears all selected files
   */
  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 group",
          isDragOver 
            ? "border-blue-400 bg-blue-50/50 scale-[1.02] shadow-xl" 
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50",
          isLoading && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Upload Icon */}
          <div className={cn(
            "p-6 rounded-2xl transition-all duration-300",
            isDragOver 
              ? "bg-blue-100 scale-110" 
              : "bg-gray-100 group-hover:bg-gray-200"
          )}>
            <Upload className={cn(
              "w-12 h-12 transition-colors duration-300",
              isDragOver ? "text-blue-600" : "text-gray-600"
            )} />
          </div>
          
          {/* Upload Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {isDragOver ? "Drop your images here" : "Upload Your Images"}
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Drag and drop your JPEG or PNG images here, or click the button below to browse
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FileImage className="w-4 h-4" />
                <span>JPEG</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <FileImage className="w-4 h-4" />
                <span>PNG</span>
              </div>
            </div>
          </div>

          {/* File Input */}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />

          {/* Upload Button */}
          <button
            type="button"
            className={cn(
              "px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3",
              isDragOver
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
            )}
            disabled={isLoading}
          >
            <Plus className="w-5 h-5" />
            <span>{isLoading ? 'Processing...' : 'Choose Files'}</span>
          </button>

          {/* Drag Indicator */}
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-500/10 rounded-3xl flex items-center justify-center pointer-events-none">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                Release to upload
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ImageUploader;
