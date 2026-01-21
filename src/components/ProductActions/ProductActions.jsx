import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import './ProductActions.css';

/**
 * @param {object} props
 * @param {object} props.product
 * @param {object} props.options
 */
const ProductActions = ({ product, options }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const colors = useMemo(() => options?.colors || [], [options?.colors]);
  const storages = useMemo(() => options?.storages || [], [options?.storages]);

  // Seleccionar si solo hay una opción
  useEffect(() => {
    if (colors.length === 1 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
    if (storages.length === 1 && !selectedStorage) {
      setSelectedStorage(storages[0]);
    }
  }, [colors, storages, selectedColor, selectedStorage]);

  // Verificar si se puede añadir al carrito
  const canAddToCart = selectedColor !== null && selectedStorage !== null;

  //  Añadir al carrito
  const handleAddToCart = async () => {
    if (!canAddToCart || isLoading) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Añadir al carrito (CartContext manejar estado y API)
      addToCart(product, selectedColor, selectedStorage);

      setMessage({ type: 'success', text: 'Added to cart!' });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({
        type: 'error',
        text: 'Error adding to cart. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-actions" data-testid="product-actions">
      <div className="action-group">
        <label className="action-label">Storage</label>
        <div className="action-options">
          {storages.map((storage) => (
            <button
              key={storage.code}
              className={`action-option ${selectedStorage?.code === storage.code ? 'selected' : ''}`}
              onClick={() => setSelectedStorage(storage)}
              type="button"
            >
              {storage.name}
            </button>
          ))}
        </div>
      </div>

      <div className="action-group">
        <label className="action-label">Color</label>
        <div className="action-options">
          {colors.map((color) => (
            <button
              key={color.code}
              className={`action-option ${selectedColor?.code === color.code ? 'selected' : ''}`}
              onClick={() => setSelectedColor(color)}
              type="button"
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <button
        className={`add-to-cart-button ${!canAddToCart ? 'disabled' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handleAddToCart}
        disabled={!canAddToCart || isLoading}
        type="button"
      >
        {isLoading ? (
          <span className="button-loading">
            <span className="spinner" />
            Adding...
          </span>
        ) : (
          <>
            <svg
              className="cart-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 2H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            Add to Cart
          </>
        )}
      </button>

      {message && (
        <div className={`action-message ${message.type}`}>
          {message.type === 'success' && (
            <svg className="message-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ProductActions;
