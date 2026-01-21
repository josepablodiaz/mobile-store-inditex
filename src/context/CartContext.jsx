import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi.jsx';

const CartContext = createContext();

// Persistencia en localStorage
const CART_ITEMS_KEY = 'mobile-store-cart-items';

/**
 * Provider del contexto del carrito
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export const CartProvider = ({ children }) => {
  const { addToCart: apiAddToCart } = useApi();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persistir los items cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  /**
   * Añade un producto al carrito
   * @param {object} product
   * @param {string} selectedColor
   * @param {string} selectedStorage
   */
  const addToCart = (product, selectedColor, selectedStorage) => {
    setCartItems((prevItems) => {
      // Buscar si ya existe el mismo producto con mismas opciones
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.colorCode === selectedColor.code &&
          item.storageCode === selectedStorage.code,
      );

      if (existingIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += 1;
        return newItems;
      }

      // Añadir nuevo item
      return [
        ...prevItems,
        {
          id: product.id,
          brand: product.brand,
          model: product.model,
          price: product.price,
          imgUrl: product.imgUrl,
          colorCode: selectedColor.code,
          colorName: selectedColor.name,
          storageCode: selectedStorage.code,
          storageName: selectedStorage.name,
          quantity: 1,
        },
      ];
    });

    // Llamada a la API
    apiAddToCart(product.id, selectedColor.code, selectedStorage.code).catch(
      (err) => console.error('Error syncing with API cart:', err),
    );
  };

  /**
   * Elimina un producto del carrito
   * @param {string} itemId
   * @param {number} colorCode
   * @param {number} storageCode
   */
  const removeFromCart = (itemId, colorCode, storageCode) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id === itemId &&
            item.colorCode === colorCode &&
            item.storageCode === storageCode
          ),
      ),
    );
  };

  /**
   * Actualiza la cantidad de un item
   * @param {string} itemId
   * @param {number} colorCode
   * @param {number} storageCode
   * @param {number} quantity
   */
  const updateQuantity = (itemId, colorCode, storageCode, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, colorCode, storageCode);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId &&
        item.colorCode === colorCode &&
        item.storageCode === storageCode
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  /**
   * Vacía el carrito
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Calcula el total del carrito
   */
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto del carrito
 * @returns {object} - Estado y funciones del carrito
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
