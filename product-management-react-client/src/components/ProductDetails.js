import React from 'react';

const ProductDetails = ({ product, onBack }) => {
  if (!product) {
    return <div>Loading product details...</div>;
  }

  const displayPrice = (product.price != null && isFinite(parseFloat(product.price)))
                       ? parseFloat(product.price).toFixed(2)
                       : 'N/A';

  return (
    <div>
      <h2>Product Details: {product.name}</h2>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Description:</strong> {product.description || 'No description provided'}</p>
      <p><strong>Price:</strong> <span className="product-price">${displayPrice}</span></p> {/* Corrected class usage className */}
      <p><strong>Available:</strong> {product.available ? 'Yes' : 'No'}</p>
       <p><strong>Created At:</strong> {new Date(product.created_at).toLocaleString()}</p>
       <p><strong>Updated At:</strong> {new Date(product.updated_at).toLocaleString()}</p>

      <button onClick={onBack}>Back to List</button>
    </div>
  );
};

export default ProductDetails;