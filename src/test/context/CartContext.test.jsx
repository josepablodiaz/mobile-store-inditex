import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';
import * as useApiModule from '../../hooks/useApi';

vi.mock('../../hooks/useApi', () => ({
    useApi: vi.fn(),
}));

describe('CartContext', () => {
    let mockApiAddToCart;

    beforeEach(() => {
        localStorage.clear();
        mockApiAddToCart = vi.fn();
        useApiModule.useApi.mockReturnValue({
            addToCart: mockApiAddToCart,
        });
    });

    const createProduct = (overrides = {}) => ({
        id: '1',
        brand: 'Apple',
        model: 'iPhone 14',
        price: '999',
        imgUrl: 'test.jpg',
        ...overrides,
    });

    const createOptions = () => ({
        color: { code: 1, name: 'Black' },
        storage: { code: 2, name: '128GB' },
    });

    it('añade producto al carrito', async () => {
        mockApiAddToCart.mockResolvedValue({ success: true });
        const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
        const { result } = renderHook(() => useCart(), { wrapper });

        await act(async () => {
            await result.current.addToCart(createProduct(), createOptions().color, createOptions().storage);
        });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartCount).toBe(1);
        expect(mockApiAddToCart).toHaveBeenCalledWith('1', 1, 2);
    });

    it('incrementa cantidad si ya existe', async () => {
        mockApiAddToCart.mockResolvedValue({ success: true });
        const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
        const { result } = renderHook(() => useCart(), { wrapper });
        const product = createProduct();
        const { color, storage } = createOptions();

        await act(async () => {
            await result.current.addToCart(product, color, storage);
            await result.current.addToCart(product, color, storage);
        });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('revierte si falla la API', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        try {
            mockApiAddToCart.mockRejectedValue(new Error('API Error'));
            const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
            const { result } = renderHook(() => useCart(), { wrapper });

            await expect(async () => {
                await act(async () => {
                    await result.current.addToCart(createProduct(), createOptions().color, createOptions().storage);
                });
            }).rejects.toThrow('Failed to add item to cart');

            expect(result.current.cartItems).toHaveLength(0);
        } finally {
            spy.mockRestore();
        }
    });

    it('mantiene items previos si falla', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        try {
            mockApiAddToCart
                .mockResolvedValueOnce({ success: true })
                .mockRejectedValueOnce(new Error('API Error'));

            const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
            const { result } = renderHook(() => useCart(), { wrapper });
            const { color, storage } = createOptions();

            await act(async () => {
                await result.current.addToCart(createProduct({ id: '1' }), color, storage);
            });

            await expect(async () => {
                await act(async () => {
                    await result.current.addToCart(createProduct({ id: '2' }), color, storage);
                });
            }).rejects.toThrow();

            expect(result.current.cartItems).toHaveLength(1);
            expect(result.current.cartItems[0].id).toBe('1');
        } finally {
            spy.mockRestore();
        }
    });

    it('guarda en localStorage', async () => {
        mockApiAddToCart.mockResolvedValue({ success: true });
        const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
        const { result } = renderHook(() => useCart(), { wrapper });

        await act(async () => {
            await result.current.addToCart(createProduct(), createOptions().color, createOptions().storage);
        });

        await waitFor(() => {
            const stored = localStorage.getItem('mobile-store-cart-items');
            expect(stored).not.toBeNull();
            expect(JSON.parse(stored)).toHaveLength(1);
        });
    });

    it('carga de localStorage', () => {
        const items = [{ id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'test.jpg', colorCode: 1, colorName: 'Black', storageCode: 2, storageName: '128GB', quantity: 2 }];
        localStorage.setItem('mobile-store-cart-items', JSON.stringify(items));

        const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartCount).toBe(2);
    });

    it('elimina item', async () => {
        mockApiAddToCart.mockResolvedValue({ success: true });
        const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
        const { result } = renderHook(() => useCart(), { wrapper });

        await act(async () => {
            await result.current.addToCart(createProduct(), createOptions().color, createOptions().storage);
        });

        act(() => {
            result.current.removeFromCart('1', 1, 2);
        });

        expect(result.current.cartItems).toHaveLength(0);
    });

    it('calcula el total', async () => {
        mockApiAddToCart.mockResolvedValue({ success: true });
        const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
        const { result } = renderHook(() => useCart(), { wrapper });
        const { color, storage } = createOptions();

        await act(async () => {
            await result.current.addToCart(createProduct({ id: '1', price: '999' }), color, storage);
            await result.current.addToCart(createProduct({ id: '2', price: '500' }), color, storage);
        });

        expect(result.current.getCartTotal()).toBe(1499);
    });
});
