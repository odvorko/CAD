import React, { useState } from 'react';
import './ProductList.css';

const ProductList = ({ products, onAdd, onEdit, onDelete, onViewDetails }) => {
  const [filterAvailable, setFilterAvailable] = useState(false);

  const filteredProducts = products.filter(product => {
    const isAvailable = product && product.available === true;
    return filterAvailable ? isAvailable : true;
  });

  return (
    <div className="section-block product-list-container">
      <h2>Product List</h2>

      <div className="filter-options">
         <label>
            <input
              type="checkbox"
              checked={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.checked)}
            />
            Show only available
         </label>
      </div>

      <button onClick={onAdd} className="btn btn-primary" style={{ marginBottom: '1rem' }}>Add New Product</button>

      {filteredProducts.length === 0 ? (
         filterAvailable ? (
            <div className="no-products-message">No available products found matching the filter.</div>
         ) : (
            <div className="no-products-message">No products found.</div>
         )
      ) : (
         <ul className="product-list">
           {filteredProducts.map(product => (
             <li key={product.id} data-testid={`product-item-${product.id}`}>
               <div className="product-list-item-details">
                 {product.name} - ${' '}
                 <span className="product-price" data-testid={`price-${product.id}`}>
                   {product.price != null && !isNaN(parseFloat(product.price)) ?
                   parseFloat(product.price).toFixed(2) :
                   'N/A'
                 }</span>{' '}
                 ({product.available ? 'Available' : 'Not Available'})
               </div>

               <div>
                 <button onClick={() => onViewDetails(product)} className="btn">View</button>
                 <button onClick={() => onEdit(product)} className="btn">Edit</button>
                 <button onClick={() => onDelete(product.id)} className="btn btn-danger">Delete</button>
               </div>
             </li>
           ))}
         </ul>
      )}
    </div>
  );
};

export default ProductList;