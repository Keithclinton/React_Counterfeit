import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
// Helper: Export to CSV
function exportToCSV(scans: Scan[]) {
  const header = 'id,brand,date,latitude,longitude,is_counterfeit\n';
  const rows = scans.map(s => `${s.id},${s.brand || ''},${s.date || ''},${s.latitude},${s.longitude},${s.is_counterfeit}`);
  const csv = header + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scans.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Helper: Export to JSON
function exportToJSON(scans: Scan[]) {
  const blob = new Blob([JSON.stringify(scans, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scans.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Map control: Center on user location
const CenterMapOnUser: React.FC<{ userLocation: [number, number] | null }> = ({ userLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation]);
  return null;
};

interface Scan {
  id: string;
  latitude: number;
  longitude: number;
  is_counterfeit: boolean;
  brand?: string;
  date?: string;
}

interface ScanMapProps {
  scans: Scan[];
}

const ScanMap: React.FC<ScanMapProps> = ({ scans }) => {
  const [filteredScans, setFilteredScans] = useState<Scan[]>(scans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandFilter, setBrandFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Backend integration: fetch scans from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://fastapi-tf-79035170475.africa-south1.run.app/scans')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch scans');
        return res.json();
      })
      .then((data: Scan[]) => {
        let result = data;
        if (brandFilter) {
          result = result.filter(scan => scan.brand?.toLowerCase().includes(brandFilter.toLowerCase()));
        }
        if (dateFilter) {
          result = result.filter(scan => scan.date?.startsWith(dateFilter));
        }
        setFilteredScans(result);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [brandFilter, dateFilter]);

  // Center on first scan or Nairobi
  const center = scans.length > 0
    ? [scans[0].latitude, scans[0].longitude]
    : [-1.286389, 36.817223];

  // User location state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation(null)
      );
    }
  }, []);

  // Custom marker icons
  const greenIcon: L.Icon<any> = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const redIcon: L.Icon<any> = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const mapRef = useRef<any>(null);
  const handleCenterOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 13);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: 400, position: 'relative', margin: '30px 0' }}>
      <h2>All Scans Map</h2>
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter by brand"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          style={{ marginRight: 8, marginBottom: 8, flex: '1 1 180px' }}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={{ marginBottom: 8, flex: '1 1 180px' }}
        />
        <button onClick={handleCenterOnUser} disabled={!userLocation} style={{ marginLeft: 8, marginBottom: 8 }}>
          Center on My Location
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="authentic" style={{ width: 18, marginRight: 4 }} /> Authentic
          </span>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt="counterfeit" style={{ width: 18, marginRight: 4 }} /> Counterfeit
          </span>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
            <img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" alt="user" style={{ width: 18, marginRight: 4 }} /> You
          </span>
        </div>
        <div style={{ marginLeft: 16, display: 'flex', gap: 8 }}>
          <button onClick={() => exportToCSV(filteredScans)} style={{ fontSize: 13 }}>Export CSV</button>
          <button onClick={() => exportToJSON(filteredScans)} style={{ fontSize: 13 }}>Export JSON</button>
        </div>
      </div>
      {loading && <div style={{ color: '#888', margin: '16px 0' }}>Loading scans...</div>}
      {error && <div style={{ color: 'red', margin: '16px 0' }}>Error: {error}</div>}
      {!loading && filteredScans.length === 0 && <div style={{ color: '#888', margin: '16px 0' }}>No scans found for the selected filters.</div>}
      <div style={{ height: '60vh', width: '100%', margin: '0 auto', maxWidth: 900, minHeight: 300 }}>
        <MapContainer
          center={center as [number, number]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          whenReady={((event: any) => { mapRef.current = event.target; }) as any}
        >
          <TileLayer
            // @ts-ignore
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup>
            {filteredScans.map(scan => (
              <Marker
                key={scan.id}
                position={[scan.latitude, scan.longitude] as [number, number]}
                icon={scan.is_counterfeit ? redIcon : greenIcon}
              >
                <Popup>
                  <b>Brand:</b> {scan.brand || 'Unknown'}<br />
                  <b>Date:</b> {scan.date || 'N/A'}<br />
                  <b>Status:</b> {scan.is_counterfeit ? 'Counterfeit' : 'Authentic'}
                </Popup>
              </Marker>
            ))}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={new L.Icon.Default()}
              >
                <Popup>
                  <b>Your Location</b>
                </Popup>
              </Marker>
            )}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .leaflet-container { min-height: 300px !important; }
        }
      `}</style>
    </div>
  );
};

export default ScanMap;
