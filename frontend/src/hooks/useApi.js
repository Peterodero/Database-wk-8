// src/hooks/useApi.js
import { useState, useCallback } from 'react';

const useApi = (apiCall, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback( async(...args) => {
    // setLoading(true);
    setError(null);
    try {
      const response = await apiCall(...args);
      console.log(response)
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
};

export default useApi;