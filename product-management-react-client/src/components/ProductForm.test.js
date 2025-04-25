import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductForm from './ProductForm';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('ProductForm', () => {
  beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
      jest.restoreAllMocks();
  });

  test('renders "Add New Product" form', () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Price:/i)).toHaveValue(null);
    expect(screen.getByRole('checkbox', { name: /Available/i })).toBeChecked();
  });

  test('renders "Edit Product" form and populates with existing data', () => {
    const productToEdit = {
      id: 1, name: 'Existing Product', description: 'Existing Desc', price: 45.67, available: false,
    };
    render(<ProductForm product={productToEdit} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Product/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toHaveValue(productToEdit.name);
    expect(screen.getByLabelText(/Description:/i)).toHaveValue(productToEdit.description);
    expect(screen.getByLabelText(/Price:/i)).toHaveValue(productToEdit.price);
    expect(screen.getByRole('checkbox', { name: /Available/i })).not.toBeChecked();
  });

  test('updates state when input values change', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Name:/i);
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Changed Name' } });
      expect(nameInput).toHaveValue('Changed Name');

      const descriptionInput = screen.getByLabelText(/Description:/i);
       fireEvent.change(descriptionInput, { target: { name: 'description', value: 'Changed Desc' } });
       expect(descriptionInput).toHaveValue('Changed Desc');

      const priceInput = screen.getByLabelText(/Price:/i);
      fireEvent.change(priceInput, { target: { name: 'price', value: '123.45' } });
      expect(priceInput).toHaveValue(123.45);

      const availableCheckbox = screen.getByRole('checkbox', { name: /Available/i });
      fireEvent.click(availableCheckbox);
      expect(availableCheckbox).not.toBeChecked();
      fireEvent.click(availableCheckbox);
      expect(availableCheckbox).toBeChecked();
   });

   test('calls onSubmit with correct data when adding a product', () => {
      render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      fireEvent.change(screen.getByLabelText(/Name:/i), { target: { name: 'name', value: 'New Product' } });
      fireEvent.change(screen.getByLabelText(/Description:/i), { target: { name: 'description', value: 'New Desc' } });
      fireEvent.change(screen.getByLabelText(/Price:/i), { target: { name: 'price', value: '50.00' } });

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
         name: 'New Product', description: 'New Desc', price: 50.00, available: true
      });
    });

    test('calls onSubmit with correct data when updating a product', () => {
        const productToEdit = {
           id: 1, name: 'Existing Product', description: 'Existing Desc', price: 45.67, available: false,
         };
         render(<ProductForm product={productToEdit} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

         fireEvent.change(screen.getByLabelText(/Name:/i), { target: { name: 'name', value: 'Updated Name' } });
         fireEvent.change(screen.getByLabelText(/Description:/i), { target: { name: 'description', value: 'Updated Desc' } });
         fireEvent.change(screen.getByLabelText(/Price:/i), { target: { name: 'price', value: '100.99' } });
         fireEvent.click(screen.getByRole('checkbox', { name: /Available/i }));

         const form = screen.getByRole('form');
         fireEvent.submit(form);

         expect(mockOnSubmit).toHaveBeenCalledTimes(1);
         expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Updated Name', description: 'Updated Desc', price: 100.99, available: true
         });
     });

    test('prevents submission if name is empty', async () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        const form = screen.getByRole('form');
        const nameInput = screen.getByLabelText(/Name:/i);
        const priceInput = screen.getByLabelText(/Price:/i);

        fireEvent.change(nameInput, { target: { name: 'name', value: '' } });
        fireEvent.change(priceInput, { target: { name: 'price', value: '10.00' } });

        fireEvent.submit(form);

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

     test('prevents submission if price is negative', async () => {
        render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

        const form = screen.getByRole('form');
        const nameInput = screen.getByLabelText(/Name:/i);
        const priceInput = screen.getByLabelText(/Price:/i);

        fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Name' } });
        fireEvent.change(priceInput, { target: { name: 'price', value: '-5.00' } });

        fireEvent.submit(form);

        expect(mockOnSubmit).not.toHaveBeenCalled();
     });

     test('prevents submission if price is empty string', async () => {
         render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

         const form = screen.getByRole('form');
         const nameInput = screen.getByLabelText(/Name:/i);
         const priceInput = screen.getByLabelText(/Price:/i);

         fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Name' } });
         fireEvent.change(priceInput, { target: { name: 'price', value: '' } });

         fireEvent.submit(form);

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