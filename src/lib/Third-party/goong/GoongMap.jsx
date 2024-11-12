import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from '@goongmaps/goong-map-react';
import { LocationOn, AddCircle, RemoveCircle } from '@mui/icons-material';

const GOONG_MAPTILES_KEY = import.meta.env.VITE_GOONG_MAPTILES_API;

// Hàm format khoảng cách theo đơn vị VN
const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  } else {
    return `${distanceInKm.toFixed(1)}km`;
  }
};

// Hàm tính khoảng cách giữa 2 điểm
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const GoongMap = ({ branches }) => {
  const [viewport, setViewport] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    zoom: 15,
    bearing: 0,
    pitch: 0
  });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  // Thêm hàm xử lý zoom
  const handleZoom = (direction) => {
    setViewport(prev => ({
      ...prev,
      zoom: direction === 'in' ? prev.zoom + 1 : prev.zoom - 1
    }));
  };

  // Lấy vị trí người dùng
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Cập nhật viewport dựa trên quán bar đầu tiên
  useEffect(() => {
    if (branches?.length > 0) {
      const firstBranch = branches[0];
      if (firstBranch.latitude && firstBranch.longitude) {
        setViewport(prev => ({
          ...prev,
          latitude: parseFloat(firstBranch.latitude),
          longitude: parseFloat(firstBranch.longitude),
          zoom: 12
        }));
      }
    }
  }, [branches]);

  const validBranches = branches?.filter(branch => {
    const lat = parseFloat(branch.latitude);
    const lng = parseFloat(branch.longitude);
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  }) || [];

  return (
    <div className="w-full">
      <div className="h-[300px] w-full rounded-lg overflow-hidden relative">
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100%"
          onViewportChange={nextViewport => setViewport(nextViewport)}
          goongApiAccessToken={GOONG_MAPTILES_KEY}
          mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
        >
          {/* Custom zoom controls */}
          <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg">
            <button
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100"
              onClick={() => handleZoom('in')}
            >
              <AddCircle className="text-gray-600" />
            </button>
            <div className="h-px bg-gray-200" />
            <button
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100"
              onClick={() => handleZoom('out')}
            >
              <RemoveCircle className="text-gray-600" />
            </button>
          </div>

          {/* Hiển thị vị trí người dùng */}
          {userLocation && (
            <Marker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
            >
              <div className="text-blue-500">
                <LocationOn style={{ fontSize: '2rem' }} />
                <div className="text-sm bg-white px-2 py-1 rounded shadow-lg">Vị trí của bạn</div>
              </div>
            </Marker>
          )}

          {/* Hiển thị các quán bar - Chỉ hiển thị icon, không hiển thị tên */}
          {validBranches.map((branch) => (
            <Marker
              key={branch.barId}
              latitude={parseFloat(branch.latitude)}
              longitude={parseFloat(branch.longitude)}
            >
              <div 
                className="text-red-500 cursor-pointer"
                onClick={() => setSelectedBar(branch)}
              >
                <LocationOn style={{ fontSize: '2rem' }} />
              </div>
            </Marker>
          ))}

          {/* Popup khi click vào marker - Hiển thị thông tin đầy đủ */}
          {selectedBar && (
            <Popup
              latitude={parseFloat(selectedBar.latitude)}
              longitude={parseFloat(selectedBar.longitude)}
              onClose={() => setSelectedBar(null)}
              closeButton={true}
              closeOnClick={false}
              offsetTop={-10}
              tipSize={8}
              anchor="bottom"
              className="map-popup"
            >
              <div className="p-2 max-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{selectedBar.barName}</h3>
                <p className="text-xs text-gray-600 mb-1 truncate" title={selectedBar.address}>
                  {selectedBar.address}
                </p>
                {userLocation && (
                  <p className="text-xs text-orange-400">
                    Cách bạn {formatDistance(calculateDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      parseFloat(selectedBar.latitude),
                      parseFloat(selectedBar.longitude)
                    ))}
                  </p>
                )}
              </div>
            </Popup>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
};

export default GoongMap;