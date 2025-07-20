import React from 'react';
import './DetectionResult.css';

interface DetectionResponse {
  is_counterfeit: boolean;
  confidence: number;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface DetectionResultProps {
  result: DetectionResponse;
}

const DetectionResult: React.FC<DetectionResultProps> = ({ result }) => {
  const getStatusIcon = () => {
    return result.is_counterfeit ? '⚠️' : '✅';
  };

  const getStatusDot = () => {
    return (
      <span
        style={{
          display: 'inline-block',
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: result.is_counterfeit ? '#dc3545' : '#28a745',
          marginRight: 10,
          verticalAlign: 'middle',
          boxShadow: '0 0 6px rgba(0,0,0,0.15)'
        }}
        aria-label={result.is_counterfeit ? 'Counterfeit' : 'Authentic'}
      />
    );
  };

  const getStatusText = () => {
    return result.is_counterfeit ? 'Counterfeit Detected' : 'Genuine Product';
  };

  const getStatusClass = () => {
    return result.is_counterfeit ? 'counterfeit' : 'genuine';
  };

  const getConfidenceColor = () => {
    if (result.confidence >= 0.8) return '#28a745'; // Green
    if (result.confidence >= 0.6) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  return (
    <div className={`detection-result ${getStatusClass()}`}>
      <div className="result-header">
        {getStatusDot()}
        <div className="status-icon">{getStatusIcon()}</div>
        <h2 className="status-text">{getStatusText()}</h2>
      </div>
      
      <div className="confidence-section">
        <div className="confidence-label">
          Confidence Level: {(result.confidence * 100).toFixed(1)}%
        </div>
        <div className="confidence-bar">
          <div 
            className="confidence-fill"
            style={{ 
              width: `${result.confidence * 100}%`,
              backgroundColor: getConfidenceColor()
            }}
          />
        </div>
      </div>

      {result.message && (
        <div className="result-message">
          <p>{result.message}</p>
        </div>
      )}

      {result.location && (
        <div className="result-location">
          <strong>Scan Location:</strong>
          <a
            href={`https://www.google.com/maps?q=${result.location.latitude},${result.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 8 }}
          >
            View on Map
          </a>
          <span style={{ marginLeft: 8, fontSize: '0.95em', color: '#555' }}>
            ({result.location.latitude.toFixed(5)}, {result.location.longitude.toFixed(5)})
          </span>
        </div>
      )}

      <div className="result-info">
        {result.is_counterfeit ? (
          <div className="warning-info">
            <h3>⚠️ Warning</h3>
            <p>This product appears to be counterfeit. Please verify with official sources and avoid consumption.</p>
          </div>
        ) : (
          <div className="safe-info">
            <h3>✅ Safe</h3>
            <p>This product appears to be genuine based on our analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionResult;
