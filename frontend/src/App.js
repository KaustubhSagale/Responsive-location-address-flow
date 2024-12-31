import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import AddressForm from './components/AddressForm';
import AddressManagement from './components/AddressManagement';
import './App.css';

const App = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null); 

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('http://localhost:30001/api/addresses');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSavedAddresses(data);
      } catch (err) {
        setError('Failed to fetch saved addresses.');
      }
    };
    fetchAddresses();
  }, []);

    
  
    const handleMarkerDragEnd = async (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=AIzaSyD9pfkkMBrU2XAmOfm0JvYFmmKkizD7--w`
      );
      if (!response.ok) throw new Error('Failed to fetch geocode data');
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSelectedAddress(data.results[0].formatted_address); 
      } else {
        setSelectedAddress('No address found for this location.');
      }
    } catch {
      setError('Failed to fetch the address.');
    }
  };

  const handleSaveAddress = (newAddress) => {

    if (newAddress) {
      setSavedAddresses([...savedAddresses, newAddress]);
      setFormVisible(false); 
    }
   
  };

  const handleDeleteAddress = (addressName) => {
    
    setSavedAddresses(savedAddresses.filter((address) => address.name !== addressName));
    setFormVisible(true);

  };

  
  const handleLocateMe = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter = { lat: latitude, lng: longitude };
          setMapCenter(newCenter);
          setMarkerPosition(newCenter);

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD9pfkkMBrU2XAmOfm0JvYFmmKkizD7--w`
            );
            if (!response.ok) throw new Error('Failed to fetch geocode data');
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              setSelectedAddress(data.results[0].formatted_address); 
            } else {
              setSelectedAddress('No address found for this location.');
            }
          } catch (err) {
            setError('Failed to fetch the address for your location.');
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Location access denied. Please enable location permissions in your browser.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information is unavailable. Please check your network or GPS.');
              break;
            case error.TIMEOUT:
              setError('The request to get your location timed out. Please try again.');
              break;
            default:
              setError('An unknown error occurred while fetching location.');
          }
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD9pfkkMBrU2XAmOfm0JvYFmmKkizD7--w">
      <div className="app">
        <h1>Location/Address Flow</h1>

        {error && <p className="error">{error}</p>}

        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '100%' }}
          center={mapCenter}
          zoom={15}
          onLoad={(map) => (mapRef.current = map)} 
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd} 
          />
        </GoogleMap>

        <button onClick={handleLocateMe} className="locate-me-button">
          Locate Me
        </button>

        {selectedAddress && (
          <p className="address">
            <strong>Located Address:</strong> {selectedAddress}
          </p>
        )}
          {formVisible && <AddressForm onSave={handleSaveAddress} />}

        
          <AddressManagement
            savedAddresses={savedAddresses}
            onDelete={handleDeleteAddress}
          />
        {/* )} */}
      </div>
    </LoadScript>
  );
};

export default App;


