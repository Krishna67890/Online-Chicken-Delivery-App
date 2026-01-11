import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { paymentService } from '../services/paymentService';

export const usePayment = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [defaultPaymentMethod, setDefaultPaymentMethodValue] = useState(null);

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (userProfile?.paymentMethods) {
        setPaymentMethods(userProfile.paymentMethods);
        const defaultMethod = userProfile.paymentMethods.find(method => method.isDefault);
        setDefaultPaymentMethodValue(defaultMethod || userProfile.paymentMethods[0]);
      }
    };

    loadPaymentMethods();
  }, [userProfile]);

  const refreshPaymentMethods = useCallback(async () => {
    if (userProfile?.paymentMethods) {
      setPaymentMethods(userProfile.paymentMethods);
      const defaultMethod = userProfile.paymentMethods.find(method => method.isDefault);
      setDefaultPaymentMethodValue(defaultMethod || userProfile.paymentMethods[0]);
    }
  }, [userProfile]);

  const addPaymentMethod = async (paymentData) => {
    setLoading(true);
    try {
      // Add to user profile via auth context
      const updatedPaymentMethods = [...(userProfile.paymentMethods || []), { 
        id: `pm_${Date.now()}`, 
        ...paymentData, 
        isDefault: (userProfile.paymentMethods || []).length === 0 
      }];
      
      await updateUserProfile({ paymentMethods: updatedPaymentMethods });
      
      // Update local state
      setPaymentMethods(updatedPaymentMethods);
      if (!defaultPaymentMethod) {
        setDefaultPaymentMethodValue(updatedPaymentMethods[0]);
      }
      
      return updatedPaymentMethods;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async (methodId, paymentData) => {
    setLoading(true);
    try {
      const updatedPaymentMethods = paymentMethods.map(method =>
        method.id === methodId ? { ...method, ...paymentData } : method
      );

      await updateUserProfile({ paymentMethods: updatedPaymentMethods });
      
      setPaymentMethods(updatedPaymentMethods);
      
      return updatedPaymentMethods;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (methodId) => {
    setLoading(true);
    try {
      const updatedPaymentMethods = paymentMethods.filter(method => method.id !== methodId);

      await updateUserProfile({ paymentMethods: updatedPaymentMethods });
      
      setPaymentMethods(updatedPaymentMethods);
      
      // Update default method if needed
      if (defaultPaymentMethod?.id === methodId) {
        setDefaultPaymentMethodValue(updatedPaymentMethods[0] || null);
      }
      
      return updatedPaymentMethods;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMethod = async (methodId) => {
    setLoading(true);
    try {
      const updatedPaymentMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));

      await updateUserProfile({ paymentMethods: updatedPaymentMethods });
      
      setPaymentMethods(updatedPaymentMethods);
      const newDefaultMethod = updatedPaymentMethods.find(method => method.id === methodId);
      setDefaultPaymentMethodValue(newDefaultMethod);
      
      return updatedPaymentMethods;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentMethods,
    loading,
    error,
    defaultPaymentMethod,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultMethod,
    refreshPaymentMethods
  };
};