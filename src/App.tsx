import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import DetectionResult from './components/DetectionResult';

interface DetectionResponse {
  is_counterfeit: boolean;
  confidence: number;
  message: string;
}

function App() {
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setDetectionResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://fastapi-tf-79035170475.africa-south1.run.app/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DetectionResponse = await response.json();
      setDetectionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍾 Counterfeit Alcohol Detection</h1>
        <p>Upload an image of alcohol to check for counterfeits</p>
      </header>
      <main className="App-main">
        <ImageUploader 
          onImageUpload={handleImageUpload} 
          isLoading={isLoading} 
        />
        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
          </div>
        )}
        {detectionResult && (
          <DetectionResult result={detectionResult} />
        )}
      </main>
    </div>
  );
}

export default App;
