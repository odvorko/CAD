// src/components/ProductDetails.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductDetails from './ProductDetails';

// Mock product data
const mockProduct = {
    id: 1,
    name: 'Sample Product',
    description: 'This is a detailed description.',
    price: 99.50,
    available: true,
    created_at: new Date('2023-01-01T10:00:00Z').toISOString(),
    updated_at: new Date('2023-01-01T11:00:00Z').toISOString(),
};

// Mock handler function for the back button
const mockOnBack = jest.fn();

describe('ProductDetails', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('renders product details and back button', () => {
    render(<ProductDetails product={mockProduct} onBack={mockOnBack} />);

    // Check for main heading and back button
    expect(screen.getByText(`Product Details: ${mockProduct.name}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to List/i })).toBeInTheDocument();

    // Check if key pieces of text content related to product details are present in the document
    // Using toContain is more robust against specific HTML structure changes within <p> tags
    expect(document.body.textContent).toContain(`Name: ${mockProduct.name}`);
    expect(document.body.textContent).toContain(`Description: ${mockProduct.description}`);
    expect(document.body.textContent).toContain(`Price: $${mockProduct.price.toFixed(2)}`);
    expect(document.body.textContent).toContain('Available: Yes');


    // Simulate click on back button
    fireEvent.click(screen.getByRole('button', { name: /Back to List/i }));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('renders loading message if product prop is null', () => {
      render(<ProductDetails product={null} onBack={mockOnBack} />);
      expect(screen.getByText('Loading product details...')).toBeInTheDocument();
  });
});