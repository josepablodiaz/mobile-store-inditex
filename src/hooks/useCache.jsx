import { useCallback } from 'react';

const CACHE_DURATION = 60 * 60 * 1000;

export const useCache = () => {
  /**
   * Guarda datos en el caché con timestamp
   */
  const setCache = useCallback((key, data) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, []);

  /**
   * Obtiene datos del caché si no han expirado
   */
  const getCache = useCallback((key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);
      const now = Date.now();

      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }, []);

  /**
   * Elimina un elemento específico del caché
   */
  const removeCache = useCallback((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }, []);

  return { getCache, setCache, removeCache };
};

export const CACHE_KEYS = {
  PRODUCTS: 'mobile-store-products',
  PRODUCT_DETAIL: (id) => `mobile-store-product-${id}`,
  CART_COUNT: 'mobile-store-cart-count',
};
