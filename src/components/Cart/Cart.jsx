import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        window.innerWidth > 500
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquear scroll body en móvil
  useEffect(() => {
    if (isOpen && window.innerWidth <= 500) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Simular compra
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        clearCart();
        setIsOpen(false);
        setIsSuccess(false);
        navigate('/');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, clearCart, navigate]);

  const toggleCart = () => setIsOpen(!isOpen);
  const closeCart = () => setIsOpen(false);

  const handleCheckout = () => {
    setIsSuccess(true);
  };

  return (
    <div className="cart" ref={cartRef}>
      <button
        className="cart-button"
        onClick={toggleCart}
        aria-label={isOpen ? 'Close cart' : 'Open cart'}
      >
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
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      {isOpen && (
        <div className="cart-dropdown">
          {isSuccess ? (
            <div className="cart-success">
              <div className="success-icon-container">
                <svg className="success-icon" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="success-title">Thank you for your purchase!</h3>
              <p className="success-message">
                Your order has been processed successfully.
              </p>
              <p className="success-redirect">Redirecting to home...</p>
            </div>
          ) : (
            <>
              <div className="cart-dropdown-header">
                <h3 className="cart-dropdown-title">Cart ({cartCount})</h3>

                <button
                  className="mobile-close-btn"
                  onClick={closeCart}
                >
                  ×
                </button>

                {cartItems.length > 0 && window.innerWidth > 500 && (
                  <button className="cart-clear-btn" onClick={clearCart}>
                    Clear
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <svg
                    className="cart-empty-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 2H2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>Your bag is empty</p>
                  <Link
                    to="/"
                    className="cart-continue-btn"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.id}-${item.colorCode}-${item.storageCode}`}
                        className="cart-item"
                      >
                        <img
                          src={item.imgUrl}
                          alt={item.model}
                          className="cart-item-image"
                        />
                        <div className="cart-item-details">
                          <Link
                            to={`/product/${item.id}`}
                            className="cart-item-name"
                            onClick={closeCart}
                          >
                            {item.brand} {item.model}
                          </Link>
                          <p className="cart-item-options">
                            {item.storageName} | {item.colorName}
                          </p>
                          <p className="cart-item-price">{item.price}€</p>
                        </div>
                        <div className="cart-item-actions">
                          <div className="cart-quantity">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.colorCode,
                                  item.storageCode,
                                  item.quantity - 1,
                                )
                              }
                            >
                              −
                            </button>
                            <span className="quantity-value">
                              {item.quantity}
                            </span>
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.colorCode,
                                  item.storageCode,
                                  item.quantity + 1,
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="cart-item-remove"
                            onClick={() =>
                              removeFromCart(
                                item.id,
                                item.colorCode,
                                item.storageCode,
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total</span>
                      <span>{getCartTotal().toFixed(2)}€</span>
                    </div>
                    <button
                      className="cart-checkout-btn"
                      onClick={handleCheckout}
                    >
                      Process Order
                    </button>
                    <button
                      className="cart-clear-btn"
                      onClick={clearCart}
                      style={{
                        display: 'block',
                        margin: '1rem auto 0',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      Empty Cart
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
