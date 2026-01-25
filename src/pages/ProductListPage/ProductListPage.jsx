import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApi } from '../../hooks/useApi.jsx';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductListPage.css';

const ProductListPage = () => {
  const { getProducts } = useApi();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProducts(controller.signal);

        if (!controller.signal.aborted) {
          setProducts(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          console.error('Error fetching products:', err);
          setError('Error loading products. Please try again later.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [getProducts]);

  // Manejar búsqueda
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Filtrar productos basado en búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const searchLower = searchTerm.toLowerCase();
    return products.filter((product) => {
      const brandMatch = product.brand?.toLowerCase().includes(searchLower);
      const modelMatch = product.model?.toLowerCase().includes(searchLower);
      return brandMatch || modelMatch;
    });
  }, [products, searchTerm]);

  if (isLoading) {
    return (
      <div className="product-list-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-page">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <div className="list-toolbar">
        <div className="list-info"></div>
        <SearchBar onSearch={handleSearch} />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <p className="no-results-text">
            No products found for "{searchTerm}"
          </p>
          <button
            className="clear-search-button"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="products-grid" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
