import { useState, useEffect, useCallback } from 'react';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customUrl = null, customOptions = {}) => {
    const targetUrl = customUrl || url;
    const targetOptions = { ...options, ...customOptions };
    
    if (!targetUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(targetUrl, targetOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;