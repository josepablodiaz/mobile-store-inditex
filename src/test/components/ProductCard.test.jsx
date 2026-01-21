import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductCard', () => {
  const mockProduct = {
    id: 'test-123',
    brand: 'TestBrand',
    model: 'TestModel X',
    price: '299',
    imgUrl: 'https://example.com/image.jpg',
  };

  it('should render product information correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    expect(screen.getByText('TestBrand')).toBeInTheDocument();
    expect(screen.getByText('TestModel X')).toBeInTheDocument();
    expect(screen.getByText('299€')).toBeInTheDocument();
  });

  it('should render image with correct alt text', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('TestBrand TestModel X');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should link to product detail page', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const link = screen.getByTestId('product-card');
    expect(link).toHaveAttribute('href', '/product/test-123');
  });

  it('should show "Price not available" when price is empty', () => {
    const productWithoutPrice = { ...mockProduct, price: '' };
    renderWithRouter(<ProductCard product={productWithoutPrice} />);

    expect(screen.getByText('Price not available')).toBeInTheDocument();
  });
});
