// src/hooks/useApiCall.js
import { useState } from 'react';

const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiFunction) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      throw err; // Re-throw to handle in the component if needed
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { loading, error, execute, clearError };
};

export default useApiCall;