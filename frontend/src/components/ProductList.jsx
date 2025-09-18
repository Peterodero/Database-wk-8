// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { productsAPI } from '../services/api';
import ProductForm from './ProductForm';
import LoadingSpinner from './LoadingSpinner';
import './ProductList.css';

const ProductList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { data: products, loading, error, execute } = useApi(productsAPI.getAll, []);

  useEffect(() => {
    execute();
    console.log("fetching")
  }, [execute]);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        execute();
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = () => {
    execute();
    handleFormClose();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-list">
      <div className="header">
        <h2>Products</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          Add New Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-details">
              <span className="price">${product.price}</span>
              <span className="stock">Stock: {product.stock_quantity}</span>
            </div>
            <div className="product-actions">
              <button
                onClick={() => handleEdit(product)}
                className="btn btn-secondary"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
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

export default ProductList;