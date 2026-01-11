import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { addressService } from '../services/addressService';

export const useAddress = () => {
  const { user, userProfile, addAddress: addAddressAuth, updateAddress: updateAddressAuth, deleteAddress: deleteAddressAuth, setDefaultAddress: setDefaultAddressAuth, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addresses = userProfile?.addresses || [];
  const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

  const refreshAddresses = useCallback(async () => {
    setLoading(true);
    try {
      await refreshUserData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [refreshUserData]);

  const addAddress = async (addressData) => {
    setLoading(true);
    try {
      const result = await addAddressAuth(addressData);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId, addressData) => {
    setLoading(true);
    try {
      const result = await updateAddressAuth(addressId, addressData);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    setLoading(true);
    try {
      const result = await deleteAddressAuth(addressId);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId) => {
    setLoading(true);
    try {
      const result = await setDefaultAddressAuth(addressId);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    error,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses
  };
};

export default useAddress;
