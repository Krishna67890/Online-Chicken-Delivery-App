// src/pages/Orders/Orders.jsx
import { useEffect, useState } from "react";
import { useCart } from "../../Contexts/CartContext";
import OrderCard from "../../components/OrderCard/OrderCard";
import "./Orders.css";

const sampleOrders = [
  {
    id: "ORD-7721",
    status: "delivered",
    orderDate: '2024-03-15T14:30:00',
    estimatedDelivery: '2024-03-15T15:10:00',
    deliveryAddress: "Matoshri Engineering College, Nashik",
    items: [
      { name: "Fried Chicken Bucket", quantity: 1, price: 24.99, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=100&fit=crop" },
      { name: "Chilled Coke", quantity: 2, price: 4.99, image: "https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=100&fit=crop" }
    ]
  },
  {
    id: "ORD-8842",
    status: "preparing",
    orderDate: '2024-03-16T12:00:00',
    estimatedDelivery: '2024-03-16T12:45:00',
    deliveryAddress: "Odha, Nashik Road",
    items: [
      { name: "Zinger Burger", quantity: 2, price: 12.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&fit=crop" }
    ]
  }
];

function Orders() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Simulated loading of past orders
    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 800);
  }, []);

  const handleCheckout = () => {
    setShowQRCode(true);
    
    // Simulate real order processing
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        status: "preparing",
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(),
        deliveryAddress: "Matoshri Engineering College, Nashik",
        items: [...cartItems] // Moving exact cart items to the order
      };

      setShowQRCode(false);
      setOrders(prev => [newOrder, ...prev]);
      setPaymentSuccess(true);
      clearCart(); // Purchase complete, clear only the purchased items
      
      setTimeout(() => setPaymentSuccess(false), 4000);
    }, 4000);
  };

  if (loading) return <div className="loading-state">Syncing with Kitchen...</div>;

  return (
    <div className="orders-page-wrapper">
      <div className="container">
        <div className="orders-grid-layout">
          
          {/* Left Column: Real-time Cart Integration */}
          <div className="orders-column-left">
            <div className="glass-card cart-card">
              <div className="card-header">
                <h2>🛒 Checkout Cart</h2>
                <span className="item-count-badge">{cartItems.length} Items</span>
              </div>
              
              <div className="cart-list">
                {cartItems.length > 0 ? cartItems.map(item => (
                  <div key={item.uniqueId || item.id} className="cart-row">
                    <img src={item.image} alt={item.name} />
                    <div className="row-info">
                      <h4>{item.name}</h4>
                      <p className="row-price-calc">${item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="row-total">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                )) : (
                  <div className="empty-cart-state">
                    <p>Your cart is empty. Please add chicken from the menu!</p>
                  </div>
                )}
              </div>

              <div className="price-summary">
                <div className="price-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="price-row"><span>Delivery Fee</span><span>$5.00</span></div>
                <div className="price-row total"><span>Order Total</span><span>${(cartTotal + 5).toFixed(2)}</span></div>
              </div>

              <button 
                className="btn-pay-now highlight-btn" 
                onClick={handleCheckout} 
                disabled={cartItems.length === 0}
              >
                Purchase These Items 🍗
              </button>
            </div>

            <div className="glass-card payment-methods-card">
              <h3>💳 Payment Method</h3>
              <div className="method-item active">
                <span className="method-label">Demo Wallet</span>
                <span className="badge">Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Order History */}
          <div className="orders-column-right">
            <div className="history-header">
              <h2>📦 Your Orders</h2>
              <div className="status-legend">
                <span className="dot prep"></span> Preparing
                <span className="dot done"></span> Delivered
              </div>
            </div>

            <div className="orders-stack">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Interactive QR Payment */}
      {showQRCode && (
        <div className="advanced-overlay">
          <div className="qr-container animate-pop">
            <div className="payment-header-mini">
              <h3>Secure Checkout</h3>
              <p>Scan to authorize purchase of ${ (cartTotal + 5).toFixed(2) }</p>
            </div>
            <div className="qr-box">
              <div className="qr-inner">
                <div className="qr-scan-line"></div>
                <span className="qr-amount-text">${(cartTotal + 5).toFixed(2)}</span>
              </div>
            </div>
            <p className="verifying-text">Connecting to secure demo server...</p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {paymentSuccess && (
        <div className="success-toast animate-slide-up">
          <span className="icon">🍗</span>
          <div className="text">
            <h4>Purchase Successful!</h4>
            <p>Check your order history for details.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;