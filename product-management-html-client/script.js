// product-management-html-client/script.js

// --- Configuration ---
// Define the base URL for your Rails API
// During local development: http://localhost:3000
// IMPORTANT: Change this to your AWS instance public IP or domain for deployment
const API_BASE_URL = 'http://localhost:3000'; // <--- THIS LINE MUST BE HERE AND UNCOMMENTED

// --- Get References to DOM Elements ---
const statusMessagesDiv = document.getElementById('status-messages');
const errorMessagesDiv = document.getElementById('error-messages');
const productListUl = document.getElementById('product-list');
const refreshListButton = document.getElementById('refresh-list-button');


// --- Helper Functions for UI Updates ---

// Function to display a status message
function displayMessage(message, isError = false) {
    clearMessages(); // Clear previous messages

    const targetDiv = isError ? errorMessagesDiv : statusMessagesDiv;
    targetDiv.textContent = message;
    // Optional: Add logic to fade out message after a few seconds
}

// Function to clear status and error messages
function clearMessages() {
    statusMessagesDiv.textContent = '';
    errorMessagesDiv.textContent = '';
}

// Function to render the list of products (only available ones)
function renderAvailableProductList(products) {
    productListUl.innerHTML = ''; // Clear current list content

    // Filter products to show only those marked as available
    const availableProducts = products.filter(product => product.available === true);

    if (availableProducts.length === 0) {
        productListUl.innerHTML = '<li>No available products found.</li>';
        return;
    }

    availableProducts.forEach(product => {
        const listItem = document.createElement('li');

        // Populate list item with product information for display
        // We don't add action buttons like Edit/Delete here
        // --- !!! FIX APPLIED HERE: Handle product.price being null/undefined/not a number ---
        const displayedPrice = (product.price != null && !isNaN(parseFloat(product.price)))
                                ? parseFloat(product.price).toFixed(2) // Format if it's a valid number
                                : 'N/A'; // Display N/A if not valid

        listItem.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Description:</strong> ${product.description || 'No description provided'}</p>
            <p><strong>Price:</strong> <span class="product-price">$${displayedPrice}</span></p>
            <!-- We don't explicitly show availability as we only list available ones -->
             <small>Added: ${new Date(product.created_at).toLocaleDateString()}</small>
        `;
        // --- !!! END FIX !!! ---

        // Add item to the list
        productListUl.appendChild(listItem);
    });
}


// --- API Interaction Function ---

// Function to fetch all products and render available ones (GET /products)
async function fetchAndRenderAvailableProducts() {
    displayMessage('Loading products...'); // Show loading indicator
    // Clear list content while loading (optional) - already done at the start of renderAvailableProductList


    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            // Improved error handling attempt
            const errorBody = await response.text(); // Get body as text
            const errorMessage = `HTTP error! status: ${response.status}. Body: ${errorBody}`;
             throw new Error(errorMessage);
        }

        const products = await response.json();
        renderAvailableProductList(products); // Render the filtered list
        clearMessages(); // Clear loading message on success

    } catch (error) {
        console.error("Error fetching products:", error);
        displayMessage(`Failed to load products: ${error.message}`, true); // Show error
         productListUl.innerHTML = '<li>Error loading data.</li>'; // Display error in list area (replaces initial list)
    }
}


// --- Event Listeners ---

// Add event listener to the refresh button
refreshListButton.addEventListener('click', fetchAndRenderAvailableProducts); // On click, refetch and render


// --- Initial Data Load ---
// Fetch and render the available product list when the page finishes loading (due to defer)
fetchAndRenderAvailableProducts();