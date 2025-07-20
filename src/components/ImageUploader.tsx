import React, { useState, useRef } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    onImageUpload(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${isLoading ? 'loading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="file-input"
        />
        {/* Hidden camera input for taking photo */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            {isLoading && <div className="loading-overlay">Analyzing...</div>}
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📷</div>
            <p>
              {isLoading 
                ? 'Analyzing image...' 
                : 'Click to upload or drag and drop an image here'
              }
            </p>
            <p className="upload-hint">Supported formats: JPG, PNG, GIF</p>
            <button 
              className="upload-button"
              type="button"
              onClick={handleCameraClick}
              disabled={isLoading}
              style={{ marginTop: 16 }}
            >
              📸 Take Photo
            </button>
          </div>
        )}
      </div>
      
      {preview && !isLoading && (
        <button 
          className="upload-button"
          onClick={handleButtonClick}
        >
          Upload Different Image
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
