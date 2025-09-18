// src/components/ProductForm.js
import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import useApiCall from '../hooks/useApiCall';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: ''
  });

  const { loading, error, execute, clearError } = useApiCall();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString()
      });
    }
  }, [product]);

  const handleChange = (e) => {
    if (error) clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.price) {
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0
      };

      if (product) {
        // Update existing product
        await execute(() => productsAPI.update(product.id, productData));
      } else {
        // Create new product
        await execute(() => productsAPI.create(productData));
      }
      
      onSubmit(); // Refresh the product list and close form
    } catch (err) {
      // Error is already handled by useApiCall
      console.error('API Error:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Create Product'}</h3>
          <button 
            onClick={onClose} 
            className="close-btn"
            disabled={loading}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              placeholder="Product description (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                disabled={loading}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock_quantity">Stock Quantity</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                min="0"
                disabled={loading}
                placeholder="0"
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.price}
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;


// // src/components/ProductForm.js
// import React, { useState, useEffect } from 'react';
// import useApi from '../hooks/useApi';
// import { productsAPI } from '../services/api';
// import './ProductForm.css';

// const ProductForm = ({ product, onSubmit, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock_quantity: ''
//   });

//   // Initialize useApi with null since we'll use execute with different API calls
//   const { loading, error, execute } = useApi(() => Promise.resolve(), null);

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name,
//         description: product.description || '',
//         price: product.price,
//         stock_quantity: product.stock_quantity
//       });
//     }
//   }, [product]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (product) {
//         console.log(product)
//         // Use execute with the update API call
//         await execute(() => productsAPI.update(product.id, {
//           ...formData,
//           price: parseFloat(formData.price),
//           stock_quantity: parseInt(formData.stock_quantity)
//         }));
//       } else {
//         // Use execute with the create API call
//         await execute(() => productsAPI.create({
//           ...formData,
//           price: parseFloat(formData.price),
//           stock_quantity: parseInt(formData.stock_quantity)
//         }));
//       }
//       onSubmit();
//     } catch (err) {
//       // Error handled by useApi
//       console.error('Form submission error:', err);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <div className="modal-header">
//           <h3>{product ? 'Edit Product' : 'Create Product'}</h3>
//           <button onClick={onClose} className="close-btn">&times;</button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="product-form">
//           <div className="form-group">
//             <label htmlFor="name">Product Name *</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="description">Description</label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="3"
//               disabled={loading}
//             />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="price">Price *</label>
//               <input
//                 type="number"
//                 id="price"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 step="0.01"
//                 min="0"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="stock_quantity">Stock Quantity</label>
//               <input
//                 type="number"
//                 id="stock_quantity"
//                 name="stock_quantity"
//                 value={formData.stock_quantity}
//                 onChange={handleChange}
//                 min="0"
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={onClose}
//               className="btn btn-secondary"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary"
//             >
//               {loading ? 'Saving...' : (product ? 'Update' : 'Create')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;