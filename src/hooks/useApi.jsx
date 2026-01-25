import { useCallback } from 'react';
import { useCache, CACHE_KEYS } from './useCache';

const API_BASE = 'https://itx-frontend-test.onrender.com';

const fetchWithError = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} at ${url}`);
  }
  return response.json();
};

export const useApi = () => {
  const { getCache, setCache } = useCache();

  const getProducts = useCallback(async (signal = null) => {
    const cachedProducts = getCache(CACHE_KEYS.PRODUCTS);
    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await fetchWithError(`${API_BASE}/api/product`, {
      signal,
    });
    setCache(CACHE_KEYS.PRODUCTS, products);
    return products;
  }, [getCache, setCache]);

  const getProductById = useCallback(
    async (id, signal = null) => {
      const cacheKey = CACHE_KEYS.PRODUCT_DETAIL(id);
      const cachedProduct = getCache(cacheKey);
      if (cachedProduct) {
        return cachedProduct;
      }

      const product = await fetchWithError(`${API_BASE}/api/product/${id}`, {
        signal,
      });
      setCache(cacheKey, product);
      return product;
    },
    [getCache, setCache],
  );

  /**
   * Añade un producto al carrito (API)
   */
  const addToCart = useCallback(async (id, colorCode, storageCode) => {
    const response = await fetchWithError(`${API_BASE}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        colorCode,
        storageCode,
      }),
    });
    return response;
  }, []);

  return { getProducts, getProductById, addToCart };
};
