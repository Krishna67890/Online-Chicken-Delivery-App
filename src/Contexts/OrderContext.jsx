import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user || !user.uid) return;
    
    setLoading(true);
    try {
      const data = await orderService.getUserOrders(user.uid);
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]); // Changed dependency to user.uid to prevent infinite loop

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getOrderById = (id) => orders.find(o => o.id === id);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    orders,
    loading,
    error,
    refreshOrders: fetchOrders,
    getOrderById,
    updateOrderStatus
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
