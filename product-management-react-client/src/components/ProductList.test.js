// src/components/ProductList.test.js

import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductList from './ProductList';

// Mock product data
const mockProducts = [
  { id: 1, name: 'Product A', description: 'Desc A', price: 10.00, available: true },
  { id: 2, name: 'Product B', description: 'Desc B', price: 20.00, available: false },
  { id: 3, name: 'Product C', description: 'Desc C', price: 30.00, available: true },
  // Products with null/undefined price needed for the last test only
  { id: 4, name: 'Product D', description: 'Desc D', price: null, available: true },
  { id: 5, name: 'Product E', description: 'Desc E', price: undefined, available: false },
];

// Mock handler functions
const mockOnAdd = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockOnViewDetails = jest.fn();


describe('ProductList', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  // Test case for empty list state
  test('renders "No products found." message when list is empty', () => {
    render(<ProductList products={[]} onAdd={mockOnAdd} onEdit={mockOnEdit} onDelete={mockOnDelete} onViewDetails={mockOnViewDetails} />);
    expect(screen.getByText('No products found.')).toBeInTheDocument();
    // Ensure no product items are rendered using their test IDs
    expect(screen.queryByTestId('product-item-1')).not.toBeInTheDocument();
  });

  // Test case for rendering a non-empty list
  test('renders product list items and action buttons when list is not empty', () => {
      // Render with a subset of products that should render correctly
      render(<ProductList products={mockProducts.slice(0, 3)} onAdd={mockOnAdd} onEdit={mockOnEdit} onDelete={mockOnDelete} onViewDetails={mockOnViewDetails} />);

      // Check that the product list items are rendered using their test IDs
      expect(screen.getByTestId('product-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-item-3')).toBeInTheDocument();
      // Check that the empty message is NOT displayed
      expect(screen.queryByText('No products found.')).not.toBeInTheDocument();

      // Check that action buttons exist within at least one list item
      const item1 = screen.getByTestId('product-item-1');
      expect(within(item1).getByRole('button', { name: /View/i })).toBeInTheDocument();
      expect(within(item1).getByRole('button', { name: /Edit/i })).toBeInTheDocument();
      expect(within(item1).getByRole('button', { name: /Delete/i })).toBeInTheDocument();

       // Check specific text content within the first item using toContain
       expect(item1.textContent).toContain('Product A');
       expect(item1.textContent).toContain('10.00');
       expect(item1.textContent).toContain('(Available)');

   });

   // Test filter functionality
   test('toggles filter and changes displayed products', () => {
       render(<ProductList products={mockProducts.slice(0, 3)} onAdd={mockOnAdd} onEdit={mockOnEdit} onDelete={mockOnDelete} onViewDetails={mockOnViewDetails} />);

       const filterCheckbox = screen.getByLabelText(/Show only available/i);

       // Initially, all items from the subset are rendered
       expect(screen.getByTestId('product-item-1')).toBeInTheDocument(); // Available
       expect(screen.getByTestId('product-item-2')).toBeInTheDocument(); // Not Available
       expect(screen.getByTestId('product-item-3')).toBeInTheDocument(); // Available

       // Click the filter
       fireEvent.click(filterCheckbox);

       // After filtering, only available items should be rendered
       expect(screen.getByTestId('product-item-1')).toBeInTheDocument();
       expect(screen.queryByTestId('product-item-2')).not.toBeInTheDocument(); // Should be hidden
       expect(screen.getByTestId('product-item-3')).toBeInTheDocument();
   });

   // Test click handlers (simplified to just check if handler is called)
   test('action buttons trigger parent handlers', () => {
       render(<ProductList products={mockProducts.slice(0, 3)} onAdd={mockOnAdd} onEdit={mockOnEdit} onDelete={mockOnDelete} onViewDetails={mockOnViewDetails} />);

       // Test Add button click (simple unique button)
       const addButton = screen.getByRole('button', { name: /Add New Product/i });
       fireEvent.click(addButton);
       expect(mockOnAdd).toHaveBeenCalledTimes(1);

        // Find buttons within a specific item and test clicks
       const item1 = screen.getByTestId('product-item-1'); // Item for Product A
       const editButton1 = within(item1).getByRole('button', { name: /Edit/i });
       const viewButton1 = within(item1).getByRole('button', { name: /View/i });

       fireEvent.click(editButton1);
       expect(mockOnEdit).toHaveBeenCalledTimes(1); // Just check call count

       fireEvent.click(viewButton1);
       expect(mockOnViewDetails).toHaveBeenCalledTimes(1);

        const item2 = screen.getByTestId('product-item-2'); // Item for Product B
       const deleteButton2 = within(item2).getByRole('button', { name: /Delete/i });

       fireEvent.click(deleteButton2);
       expect(mockOnDelete).toHaveBeenCalledTimes(1);

       // Check total call counts across actions tested in this block (should all be 1)
       expect(mockOnAdd).toHaveBeenCalledTimes(1);
       expect(mockOnEdit).toHaveBeenCalledTimes(1);
       expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
       expect(mockOnDelete).toHaveBeenCalledTimes(1);
   });


  // Test handling of null/undefined price
 test('handles products with null/undefined price correctly using data-testid', () => {
      // Use the subset of products with null/undefined price
      render(<ProductList products={mockProducts.slice(3)} onAdd={mockOnAdd} onEdit={mockOnEdit} onDelete={mockOnDelete} onViewDetails={mockOnViewDetails} />);

      // Check the text content of the price spans for these products
      expect(screen.getByTestId('price-4')).toHaveTextContent('N/A');
      expect(screen.getByTestId('price-5')).toHaveTextContent('N/A');

       // Optional: check surrounding text content using toContain
        const item4 = screen.getByTestId('product-item-4');
        expect(item4.textContent).toContain('Product D');
        expect(item4.textContent).toContain('(Available)');
    });
});