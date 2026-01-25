import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useApi } from '../../hooks/useApi.jsx';
import ProductImage from '../../components/ProductImage/ProductImage';
import ProductDescription from '../../components/ProductDescription/ProductDescription';
import ProductActions from '../../components/ProductActions/ProductActions';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { getProductById } = useApi();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProductById(id, controller.signal);

        if (!controller.signal.aborted) {
          setProduct(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          console.error('Error fetching product:', err);
          setError('Error loading product details. Please try again later.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id, getProductById]);

  // Renderizar loading
  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Renderizar error
  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <svg
            className="error-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="error-text">{error || 'Product not found'}</p>
          <Link to="/" className="back-link">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link" data-testid="back-link">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 12H5m0 0l6 6m-6-6l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Products
      </Link>

      <div className="product-detail-content">
        <div className="product-detail-left">
          <ProductImage
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
          />
        </div>

        <div className="product-detail-right">
          <ProductDescription product={product} />

          {product.options && (
            <ProductActions product={product} options={product.options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
