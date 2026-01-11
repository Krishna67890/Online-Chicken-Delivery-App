import React, { createContext, useContext, useState, useEffect } from 'react';
import { offerService } from '../services/offerService';

const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await offerService.getAllOffers();
      setOffers(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const value = {
    offers,
    loading,
    error,
    refreshOffers: fetchOffers
  };

  return (
    <OffersContext.Provider value={value}>
      {children}
    </OffersContext.Provider>
  );
};

export const useOffers = () => {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
};
