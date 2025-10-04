import { useState, useEffect } from 'react';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      options
    );
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