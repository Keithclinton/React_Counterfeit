import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import DetectionResult from './components/DetectionResult';
import ScanMap from './components/ScanMap';

interface DetectionResponse {
  brand?: string;
  date?: string;
  is_counterfeit: boolean;
  confidence: number;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  id?: string;
}

function App() {
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null);
  const [scans, setScans] = useState<DetectionResponse[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          setLocation(null);
        }
      );
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setDetectionResult(null);

    const formData = new FormData();
    formData.append('file', file);
    // Always send latitude and longitude as required by backend
    const lat = location?.latitude ?? 0;
    const lng = location?.longitude ?? 0;
    formData.append('latitude', String(lat));
    formData.append('longitude', String(lng));
    // Optionally, ask user for brand or use a default
    formData.append('brand', 'Unknown');

    try {
      const response = await fetch('https://fastapi-tf-79035170475.africa-south1.run.app/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DetectionResponse = await response.json();
      // Attach location, brand, and date to result
      const scan: DetectionResponse = {
        ...result,
        location: location ?? undefined,
        brand: result.brand || 'Unknown',
        date: new Date().toISOString().slice(0, 10),
      };
      setDetectionResult(scan);
      setScans(prev => [...prev, { ...scan, id: `${Date.now()}` }]);
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
        {showMap ? (
          <ScanMap scans={scans.map((scan, idx) => ({
            id: scan.id || String(idx),
            latitude: scan.location?.latitude || 0,
            longitude: scan.location?.longitude || 0,
            is_counterfeit: scan.is_counterfeit,
            brand: scan.brand,
            date: scan.date || '',
          }))} />
        ) : (
          <>
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
              <>
                <DetectionResult result={detectionResult} />
                <button className="upload-button" style={{marginTop:24}} onClick={() => setShowMap(true)}>
                  View All Scans on Map
                </button>
              </>
            )}
          </>
        )}
        {showMap && (
          <button className="upload-button" style={{marginTop:24}} onClick={() => setShowMap(false)}>
            Back to Scan
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
