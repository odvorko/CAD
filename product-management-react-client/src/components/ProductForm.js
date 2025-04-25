import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price != null ? String(product.price) : '',
    available: product?.available ?? true,
  });
  const [errors, setErrors] = useState({ name: '', price: '' });

  useEffect(() => {
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price != null ? String(product.price) : '',
      available: product?.available ?? true,
    });
    setErrors({ name: '', price: '' });
  }, [product]);

  const validateField = (name, value) => {
    if (name === 'name') {
      return value.trim() ? '' : 'Product name is required.';
    }
    if (name === 'price') {
      if (value.trim() === '') return 'Price is required.';
      if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
        return 'Price must be a non-negative number.';
      }
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateField('name', formData.name);
    const priceError = validateField('price', formData.price);

    if (nameError || priceError) {
      setErrors({ name: nameError, price: priceError });
      return;
    }

    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <div className="section-block product-form-container">
      <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
          {errors.price && <div className="error-message">{errors.price}</div>}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {product ? 'Update Product' : 'Add Product'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;