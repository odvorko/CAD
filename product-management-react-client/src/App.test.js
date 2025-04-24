// src/App.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders the main application title', () => {
  render(<App />);
  expect(screen.getByText('Product Management')).toBeInTheDocument();
});