const API_BASE_URL = 'http://54.195.128.196';

const statusMessagesDiv = document.getElementById('status-messages');
const errorMessagesDiv = document.getElementById('error-messages');
const productListUl = document.getElementById('product-list');
const refreshListButton = document.getElementById('refresh-list-button');


function displayMessage(message, isError = false) {
    clearMessages();

    const targetDiv = isError ? errorMessagesDiv : statusMessagesDiv;
    if (targetDiv) {
       targetDiv.textContent = message;
    }
}

function clearMessages() {
    if (statusMessagesDiv) {
        statusMessagesDiv.textContent = '';
    }
     if (errorMessagesDiv) {
        errorMessagesDiv.textContent = '';
    }
}

function renderAvailableProductList(products) {
    productListUl.innerHTML = '';

    const availableProducts = products.filter(product => product.available === true);

    if (availableProducts.length === 0) {
        productListUl.innerHTML = '<li>No available products found.</li>';
        return;
    }

    availableProducts.forEach(product => {
        const listItem = document.createElement('li');

        const displayedPrice = (product.price != null && !isNaN(parseFloat(product.price)))
                                ? parseFloat(product.price).toFixed(2)
                                : 'N/A';

        listItem.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Description:</strong> ${product.description || 'No description provided'}</p>
            <p><strong>Price:</strong> <span class="product-price">$${displayedPrice}</span></p>
             <small>Added: ${new Date(product.created_at).toLocaleDateString()}</small>
        `;

        productListUl.appendChild(listItem);
    });
}


async function fetchAndRenderAvailableProducts() {
    displayMessage('Loading products...');

    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            const errorBody = await response.text();
            const errorMessage = `HTTP error! status: ${response.status}. Body: ${errorBody}`;
             throw new Error(errorMessage);
        }

        const products = await response.json();
        renderAvailableProductList(products);
        clearMessages();

    } catch (error) {
        console.error("Error fetching products:", error);
        displayMessage(`Failed to load products: ${error.message}`, true);
         productListUl.innerHTML = '<li>Error loading data.</li>';
    }
}


refreshListButton.addEventListener('click', fetchAndRenderAvailableProducts);


fetchAndRenderAvailableProducts();