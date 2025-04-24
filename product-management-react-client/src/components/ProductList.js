import React, { useState } from 'react';

const ProductList = ({ products, onAdd, onEdit, onDelete, onViewDetails }) => {
  const [filterAvailable, setFilterAvailable] = useState(false);

  const filteredProducts = products.filter(product => {
    const isAvailable = product && product.available === true;
    return filterAvailable ? isAvailable : true;
  });

  return (
    <div>
      <h2>Product List</h2>

      <div>
         <label>
            <input
              type="checkbox"
              checked={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.checked)}
            />
            Show only available
         </label>
      </div>

      <button onClick={onAdd}>Add New Product</button>

      {filteredProducts.length === 0 ? (
         filterAvailable ? (
            <div>No available products found matching the filter.</div>
         ) : (
            <div>No products found.</div>
         )
      ) : (
         <ul>
           {filteredProducts.map(product => (
             <li key={product.id} data-testid={`product-item-${product.id}`}>
               {product.name} - ${' '}
               <span data-testid={`price-${product.id}`}>
                 {product.price != null && !isNaN(parseFloat(product.price)) ?
                 parseFloat(product.price).toFixed(2) :
                 'N/A'
               }</span>{' '}
               ({product.available ? 'Available' : 'Not Available'})

               <button onClick={() => onViewDetails(product)}>View</button>
               <button onClick={() => onEdit(product)}>Edit</button>
               <button onClick={() => onDelete(product.id)}>Delete</button>
             </li>
           ))}
         </ul>
      )}
    </div>
  );
};

export default ProductList;