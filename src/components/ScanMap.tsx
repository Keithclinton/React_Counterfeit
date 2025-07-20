import React, { useState, useEffect } from 'react';

interface Scan {
  id: string;
  latitude: number;
  longitude: number;
  is_counterfeit: boolean;
  brand?: string;
  date: string;
}

interface ScanMapProps {
  scans: Scan[];
}

const ScanMap: React.FC<ScanMapProps> = ({ scans }) => {
  const [filteredScans, setFilteredScans] = useState<Scan[]>(scans);
  const [brandFilter, setBrandFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    let result = scans;
    if (brandFilter) {
      result = result.filter(scan => scan.brand?.toLowerCase().includes(brandFilter.toLowerCase()));
    }
    if (dateFilter) {
      result = result.filter(scan => scan.date.startsWith(dateFilter));
    }
    setFilteredScans(result);
  }, [brandFilter, dateFilter, scans]);

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative', margin: '30px 0' }}>
      <h2>All Scans Map</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Filter by brand"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
      </div>
      <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: 8, position: 'relative', background: '#f8f8f8' }}>
        {/* Simple map placeholder. For real use, integrate Google Maps, Mapbox, or Leaflet. */}
        {filteredScans.map(scan => (
          <div
            key={scan.id}
            title={`${scan.is_counterfeit ? 'Counterfeit' : 'Authentic'}\n${scan.brand || ''}\n${scan.date}`}
            style={{
              position: 'absolute',
              left: `${50 + (scan.longitude % 1) * 400}px`, // Fake projection for demo
              top: `${200 - (scan.latitude % 1) * 400}px`,
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: scan.is_counterfeit ? '#dc3545' : '#28a745',
              border: '2px solid #fff',
              boxShadow: '0 0 6px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              zIndex: 2
            }}
          />
        ))}
        <div style={{position:'absolute',bottom:8,right:8,fontSize:'0.9em',color:'#888'}}>Map is a demo. Integrate a real map for production.</div>
      </div>
    </div>
  );
};

export default ScanMap;
