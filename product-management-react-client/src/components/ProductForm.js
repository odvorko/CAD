// src/components/ProductForm.js

import React, { useState, useEffect } from 'react';

// Component for the Product Form (used for both Add and Edit)
// It receives a 'product' prop (for editing) and 'onSubmit'/'onCancel' callbacks
const ProductForm = ({ product, onSubmit, onCancel }) => {
  // State to hold form data.
  // Initialize with product data if provided (editing), otherwise use empty/default values.
  const [formData, setFormData] = useState({
    name: product ? product.name : '',
    description: product ? product.description : '',
    // Ensure price is a string for input value, convert decimal if needed
    price: product ? (product.price != null ? String(product.price) : '') : '',
    // Ensure available is boolean
    available: product ? product.available : true, // Default to true for new products
  });

  // Use useEffect to update form data if the 'product' prop changes
  // This is important if the same form component is reused for different products
  useEffect(() => {
     setFormData({
        name: product ? product.name : '',
        description: product ? product.description : '',
        price: product ? (product.price != null ? String(product.price) : '') : '',
        available: product ? product.available : true,
     });
  }, [product]); // Dependency array: run this effect whenever the 'product' prop changes


  // Function to handle changes in form input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For checkbox inputs, use 'checked' value; otherwise, use 'value'
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData, // Copy existing form data
      [name]: newValue, // Update the specific field by its name
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form submission

    // Basic client-side validation (can be expanded)
    if (!formData.name.trim()) {
      alert("Product name is required.");
      return;
    }
     if (formData.price.trim() === '' || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
       alert("Valid price (non-negative number) is required.");
       return;
     }
     // More complex validation would go here

    // Call the onSubmit function passed from the parent component.
    // Pass a copy of form data, converting price to a Number (decimal in Rails).
    // Using unary plus `+formData.price` or `parseFloat(formData.price)` converts the string to number.
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) // Ensure price is sent as a number
    });
  };

  return (
    <div>
      {/* Determine form title based on whether a product is being edited */}
      <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>

      {/* Product Form */}
      <form onSubmit={handleSubmit}>
        {/* Input for Product Name */}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name" // Match name attribute to formData key
            value={formData.name}
            onChange={handleChange} // Attach the change handler
            required // HTML5 validation
          />
        </div>

        {/* Input for Product Description (Textarea) */}
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Input for Product Price */}
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01" // Allows two decimal places
            value={formData.price}
            onChange={handleChange}
            required // HTML5 validation
          />
        </div>

        {/* Input for Product Availability (Checkbox) */}
        <div>
          <label htmlFor="available">Available:</label>
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available} // Use 'checked' prop for checkboxes
            onChange={handleChange} // Handle changes
          />
        </div>

        {/* Submit Button */}
        <button type="submit">{product ? 'Update Product' : 'Add Product'}</button>

        {/* Cancel Button (Only show in Edit mode or when displayed as modal) */}
        {/* We'll add a simple button for now, can hide for 'Add New' if preferred */}
        <button type="button" onClick={onCancel}>Cancel</button>

      </form>
    </div>
  );
};

export default ProductForm; // Export the component