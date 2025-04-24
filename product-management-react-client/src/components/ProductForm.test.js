import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductForm from './ProductForm';

// Mock handler functions
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('ProductForm', () => {
  // Setup/cleanup for mocks and window.alert
  beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert to prevent real browser dialog
  });

  afterEach(() => {
      jest.restoreAllMocks(); // Restore mocks after each test
  });

  test('renders "Add New Product" form', () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Available:/i)).toBeChecked();
  });

  test('renders "Edit Product" form and populates with existing data', () => {
    const productToEdit = {
      id: 1, name: 'Existing Product', description: 'Existing Desc', price: 45.67, available: false,
    };
    render(<ProductForm product={productToEdit} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Product/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toHaveValue(productToEdit.name);
    expect(screen.getByLabelText(/Price:/i)).toHaveValue(productToEdit.price);
    expect(screen.getByLabelText(/Available:/i)).not.toBeChecked();
  });

  test('updates state when input values change', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Name:/i);
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Changed Name' } }); // Simulate change event
      expect(nameInput).toHaveValue('Changed Name');

      const priceInput = screen.getByLabelText(/Price:/i);
      fireEvent.change(priceInput, { target: { name: 'price', value: '123.45' } });
      expect(priceInput).toHaveValue(123.45);
   });

   test('calls onSubmit with correct data when adding a product', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByLabelText(/Name:/i), { target: { name: 'name', value: 'New Product' } });
      fireEvent.change(screen.getByLabelText(/Price:/i), { target: { name: 'price', value: '50.00' } });

      const submitButton = screen.getByRole('button', { name: /Add Product/i });
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
         name: 'New Product', description: '', price: 50.00, available: true // Expect default/empty values for other fields
      });
    });

    test('calls onSubmit with correct data when updating a product', () => {
        const productToEdit = {
           id: 1, name: 'Existing Product', description: 'Existing Desc', price: 45.67, available: false,
         };
         render(<ProductForm product={productToEdit} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

         fireEvent.change(screen.getByLabelText(/Name:/i), { target: { name: 'name', value: 'Updated Name' } });
         fireEvent.change(screen.getByLabelText(/Price:/i), { target: { name: 'price', value: '100.99' } });
         fireEvent.click(screen.getByLabelText(/Available:/i));

         const submitButton = screen.getByRole('button', { name: /Update Product/i });
         fireEvent.click(submitButton);

         expect(mockOnSubmit).toHaveBeenCalledTimes(1);
         expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Updated Name', description: 'Existing Desc', price: 100.99, available: true
         });
     });

    test('prevents submission and shows alert if name is empty', () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
        fireEvent.change(screen.getByLabelText(/Price:/i), { target: { name: 'price', value: '10.00' } });
        const submitButton = screen.getByRole('button', { name: /Add Product/i });
        fireEvent.click(submitButton);

        expect(window.alert).toHaveBeenCalledTimes(1);
        expect(window.alert).toHaveBeenCalledWith('Product name is required.');
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

     test('prevents submission and shows alert if price is negative', () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
        fireEvent.change(screen.getByLabelText(/Name:/i), { target: { name: 'name', value: 'Test Name' } });
        fireEvent.change(screen.getByLabelText(/Price:/i), { target: { name: 'price', value: '-5.00' } });
        const submitButton = screen.getByRole('button', { name: /Add Product/i });
        fireEvent.click(submitButton);

        expect(window.alert).toHaveBeenCalledTimes(1);
        expect(window.alert).toHaveBeenCalledWith('Valid price (non-negative number) is required.');
        expect(mockOnSubmit).not.toHaveBeenCalled();
     });

     test('prevents submission and shows alert if price is empty string', () => {
         render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
         fireEvent.change(screen.getByLabelText(/Name:/i), { target: { name: 'name', value: 'Test Name' } });
         fireEvent.change(screen.getByLabelText(/Price:/i), { target: { name: 'price', value: '' } });
         const submitButton = screen.getByRole('button', { name: /Add Product/i });
         fireEvent.click(submitButton);

         expect(window.alert).toHaveBeenCalledTimes(1);
         expect(window.alert).toHaveBeenCalledWith('Valid price (non-negative number) is required.');
         expect(mockOnSubmit).not.toHaveBeenCalled();
     });

     test('calls onCancel when cancel button is clicked', () => {
         render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
         const cancelButton = screen.getByRole('button', { name: /Cancel/i });
         fireEvent.click(cancelButton);

         expect(mockOnCancel).toHaveBeenCalledTimes(1);
         expect(mockOnSubmit).not.toHaveBeenCalled();
     });
});