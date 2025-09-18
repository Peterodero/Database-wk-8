// src/components/OrderList.js
import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { ordersAPI, productsAPI } from '../services/api';
import OrderForm from './OrderForm';
import LoadingSpinner from './LoadingSpinner';
import './OrderList.css';

const OrderList = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const { data: orders, loading, error, execute: fetchOrders } = useApi(ordersAPI.getAll, []);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [fetchOrders, fetchProducts]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await ordersAPI.updateStatus(id, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.delete(id);
        fetchOrders();
      } catch (err) {
        alert('Error deleting order');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = () => {
    fetchOrders();
    handleFormClose();
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="order-list">
      <div className="header">
        <h2>Orders</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          Create New Order
        </button>
      </div>

      {showForm && (
        <OrderForm
          products={products}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`status status-${order.status}`}>
                {order.status}
              </span>
            </div>
            
            <div className="customer-info">
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Total:</strong> ${order.total_amount}</p>
            </div>

            {order.items && (
              <div className="order-items">
                <h4>Items:</h4>
                {JSON.parse(order.items).map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{getProductName(item.product_id)}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="order-actions">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                onClick={() => handleDelete(order.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;