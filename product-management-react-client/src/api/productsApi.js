// src/api/productsApi.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // <-- !!! IMPORTANT: Change this for deployment !!!

// Function to get all products
// Corresponds to: GET /products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    // Axios automatically parses JSON response
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error so components can handle it
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new product
// Corresponds to: POST /products
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, { product: productData });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error.response ? error.response.data : error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Nest data under 'product' key
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, { product: productData });
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error.response ? error.response.data : error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    // For DELETE, there's typically no response body on success (204 No Content)
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
    return response.data; // response.data might be empty for 204, but returning allows consistent handling
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};