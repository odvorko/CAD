import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetails from './components/ProductDetails';

import { getProducts, createProduct, updateProduct, deleteProduct } from './api/productsApi';

import './App.css';


function App() {
  const [currentView, setCurrentView] = useState('list');
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Could not load products.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleAddNew = () => {
    setProductToEdit(null);
    setCurrentView('add');
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setCurrentView('edit');
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setCurrentView('details');
  };


  const handleDelete = async (productId) => {
     if (window.confirm('Are you sure you want to delete this product?')) {
       try {
          setIsLoading(true);
          setError(null);
          await deleteProduct(productId);
          console.log(`Product with ID ${productId} deleted.`);
          await fetchProducts();
          if (selectedProduct && selectedProduct.id === productId) {
              handleCancel();
          }
       } catch (err) {
           console.error("Failed to delete product:", err);
           setError(`Could not delete product ${productId}.`);
       } finally {
          setIsLoading(false);
       }
     }
  };

  const handleCancel = () => {
    setProductToEdit(null);
    setSelectedProduct(null);
    setCurrentView('list');
    clearMessages();
  };

  const handleSubmit = async (productData) => {
     try {
        setIsLoading(true);
        setError(null);

        let savedProduct;
        if (productToEdit) {
          savedProduct = await updateProduct(productToEdit.id, productData);
          console.log("Product updated:", savedProduct);
        } else {
          savedProduct = await createProduct(productData);
          console.log("New product created:", savedProduct);
        }

        await fetchProducts();
        setCurrentView('list');
        setProductToEdit(null);
        setSelectedProduct(null);

     } catch (err) {
         console.error("Error saving product:", err.response ? err.response.data : err);
         if (err.response && err.response.status === 422 && err.response.data) {
            const errorMessages = Object.entries(err.response.data).map(([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
            ).join('\n');
            setError(`Validation failed:\n${errorMessages}`);
         } else {
            setError("Failed to save product. Please try again.");
         }
     } finally {
         setIsLoading(false);
     }
  };
  const clearMessages = () => {

  };


  const renderContent = () => {
    if (error) {
        return <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>Error: {error}</div>;
    }

    if (isLoading) {
        return <div style={{ fontWeight: 'bold' }}>Loading...</div>;
    }

    switch (currentView) {
      case 'list':
        return (
           <ProductList
             products={products}
             onAdd={handleAddNew}
             onEdit={handleEdit}
             onDelete={handleDelete}
             onViewDetails={handleViewDetails}
           />
        );
      case 'add':
        return (
          <ProductForm
            product={null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        );
      case 'edit':
         if (!productToEdit) return <div style={{color: 'red'}}>Error: No product selected for editing.</div>;
        return (
          <ProductForm
            product={productToEdit}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        );
      case 'details':
         if (!selectedProduct) return <div style={{color: 'red'}}>Error: No product selected for details.</div>;
        return (
           <ProductDetails
             product={selectedProduct}
             onBack={handleCancel}
           />
        );
      default:
        return <div>Unknown application state.</div>;
    }
  };


  return (
    <div className="App">
       <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
           <a href="../product-management-html-client/index.html" style={{ marginRight: '15px', textDecoration: 'none' }}>HTML Catalog Client</a>
           {' | '}
           <a href="./" style={{ marginLeft: '15px', textDecoration: 'none' }}>React Management Client</a>
       </nav>

       <h1>Product Management</h1>
      {renderContent()}
    </div>
  );
}

export default App;