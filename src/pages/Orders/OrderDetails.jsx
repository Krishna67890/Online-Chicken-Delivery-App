import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const data = getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-details-page">
      <button onClick={() => navigate(-1)} className="btn-back">← Back to Orders</button>
      <h1>Order Details</h1>
      <div className="order-summary">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span className={`status-${order.status}`}>{order.status}</span></p>
        <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
      </div>
      
      <h3>Items</h3>
      <ul className="order-items-list">
        {order.items?.map((item, index) => (
          <li key={index}>
            {item.name} x {item.quantity} - ${item.price?.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;