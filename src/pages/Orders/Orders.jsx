import { useEffect, useState } from "react";
import OrderCard from "../../components/OrderCard/OrderCard";
import "./Orders.css";

// Sample orders data since Firebase isn't set up
const sampleOrders = [
  {
    id: "CHK-001",
    userId: "user1",
    status: "delivered",
    items: [
      { name: "Crispy Fried Chicken", quantity: 2, price: 12.99 },
      { name: "French Fries", quantity: 1, price: 3.99 }
    ],
    total: 29.97,
    createdAt: new Date('2024-01-15'),
    estimatedDelivery: new Date('2024-01-15'),
    deliveryAddress: "123 Main St, City, State 12345"
  },
  {
    id: "CHK-002",
    userId: "user1",
    status: "preparing",
    items: [
      { name: "Grilled Chicken Plate", quantity: 1, price: 14.99 },
      { name: "Coleslaw", quantity: 1, price: 2.99 }
    ],
    total: 17.98,
    createdAt: new Date('2024-01-14'),
    estimatedDelivery: new Date('2024-01-14'),
    deliveryAddress: "456 Oak Ave, City, State 12345"
  },
  {
    id: "CHK-003",
    userId: "user1",
    status: "out-for-delivery",
    items: [
      { name: "Chicken Wings", quantity: 1, price: 10.99 },
      { name: "Chicken Sandwich", quantity: 1, price: 8.99 }
    ],
    total: 19.98,
    createdAt: new Date('2024-01-13'),
    estimatedDelivery: new Date('2024-01-13'),
    deliveryAddress: "789 Pine Rd, City, State 12345"
  }
];

// Empty Orders Component
const EmptyOrders = () => (
  <div className="empty-orders">
    <div className="empty-orders-icon">🍗</div>
    <h2>No orders yet</h2>
    <p>Your delicious chicken orders will appear here once you place an order</p>
    <button 
      className="browse-menu-btn"
      onClick={() => window.location.href = '/menu'}
    >
      Browse Menu
    </button>
  </div>
);

// Order Filter Component
const OrderFilter = ({ filters, activeFilter, onFilterChange }) => (
  <div className="order-filters">
    {filters.map(filter => (
      <button
        key={filter.id}
        className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
        onClick={() => onFilterChange(filter.id)}
      >
        {filter.label}
        {filter.count > 0 && <span className="filter-count">{filter.count}</span>}
      </button>
    ))}
  </div>
);

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Order status filters
  const filters = [
    { id: "all", label: "All Orders", count: 0 },
    { id: "pending", label: "Pending", count: 0 },
    { id: "confirmed", label: "Confirmed", count: 0 },
    { id: "preparing", label: "Preparing", count: 0 },
    { id: "out-for-delivery", label: "Out for Delivery", count: 0 },
    { id: "delivered", label: "Delivered", count: 0 },
    { id: "cancelled", label: "Cancelled", count: 0 },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use sample data instead of Firebase
        setOrders(sampleOrders);
        setFilteredOrders(sampleOrders);
        
        // Update filter counts
        updateFilterCounts(sampleOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update filter counts based on orders
  const updateFilterCounts = (ordersList) => {
    const updatedFilters = filters.map(filter => {
      if (filter.id === "all") {
        return { ...filter, count: ordersList.length };
      }
      const count = ordersList.filter(order => order.status === filter.id).length;
      return { ...filter, count };
    });
    // Update filter counts (you can make filters stateful if needed)
    filters.forEach((filter, index) => {
      if (filter.id === "all") {
        filters[index].count = ordersList.length;
      } else {
        filters[index].count = ordersList.filter(order => order.status === filter.id).length;
      }
    });
  };

  // Filter orders based on active filter and search query
  useEffect(() => {
    let result = orders;
    
    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter(order => order.status === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    setFilteredOrders(result);
  }, [activeFilter, searchQuery, orders]);

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Retry fetching orders
  const handleRetry = () => {
    setError("");
    setLoading(true);
    // Re-fetch orders
    setTimeout(() => {
      setOrders(sampleOrders);
      setFilteredOrders(sampleOrders);
      updateFilterCounts(sampleOrders);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-error">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Track and manage your chicken orders</p>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          <div className="orders-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search orders or items..."
                value={searchQuery}
                onChange={handleSearch}
                className="orders-search"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <OrderFilter
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="orders-stats">
            <div className="stat-card">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {orders.filter(o => o.status === 'delivered').length}
              </span>
              <span className="stat-label">Delivered</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {orders.filter(o => ['pending', 'confirmed', 'preparing', 'out-for-delivery'].includes(o.status)).length}
              </span>
              <span className="stat-label">Active</span>
            </div>
          </div>

          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="no-orders-message">
                <div className="no-orders-icon">📋</div>
                <h3>No orders found</h3>
                <p>
                  {searchQuery 
                    ? `No orders match "${searchQuery}"`
                    : `No orders with status "${activeFilter}"`
                  }
                </p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>

          <div className="orders-help">
            <h3>Need help with an order?</h3>
            <p>Contact our support team for assistance with your orders</p>
            <div className="help-buttons">
              <button className="help-btn">
                <span className="btn-icon">📞</span>
                Call Support
              </button>
              <button className="help-btn">
                <span className="btn-icon">💬</span>
                Chat with Us
              </button>
              <button className="help-btn">
                <span className="btn-icon">📧</span>
                Email Support
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;