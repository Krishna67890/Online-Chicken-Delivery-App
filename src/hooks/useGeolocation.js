import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by this browser.';
        setError(msg);
        reject(new Error(msg));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(locationData);
          setLoading(false);
          resolve(locationData);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
          reject(error);
        },
        options
      );
    });
  };

  useEffect(() => {
    if (options.autoGet) {
      getCurrentPosition();
    }
  }, [options.autoGet]);

  return {
    location,
    error,
    loading,
    getCurrentPosition,
  };
};

export default useGeolocation;