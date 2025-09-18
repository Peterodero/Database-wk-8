// src/components/OrderForm.js
import React, { useState } from 'react';
import useApi from '../hooks/useApi';
import { ordersAPI } from '../services/api';
import './OrderForm.css';

const OrderForm = ({ products, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    items: [{
      product_id: '',
      quantity: 1,
      price: 0
    }]
  });

  const { loading, error, execute } = useApi();

  const handleCustomerChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Update price if product is selected
    if (field === 'product_id') {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        newItems[index].price = product.price;
      }
    }

    setFormData({
      ...formData,
      items: newItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        product_id: '',
        quantity: 1,
        price: 0
      }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: newItems
      });
    }
  };

  const getTotalAmount = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await execute(() => ordersAPI.create({
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      }));
      onSubmit();
    } catch (err) {
      // Error handled by useApi
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>Create New Order</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customer_name">Customer Name *</label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleCustomerChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer_email">Customer Email *</label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleCustomerChange}
                required
              />
            </div>
          </div>

          <div className="order-items-section">
            <div className="section-header">
              <h4>Order Items</h4>
              <button type="button" onClick={addItem} className="btn btn-secondary">
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="order-item-row">
                <select
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  required
                />

                <span className="item-price">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="order-total">
            <h3>Total: ${getTotalAmount().toFixed(2)}</h3>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;