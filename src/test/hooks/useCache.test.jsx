import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCache, CACHE_KEYS } from '../../hooks/useCache';

describe('useCache', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('guarda y recupera datos', () => {
        const { result } = renderHook(() => useCache());
        const testData = { id: 1, name: 'Test' };

        act(() => {
            result.current.setCache('test-key', testData);
        });

        expect(result.current.getCache('test-key')).toEqual(testData);
    });

    it('expira después de 1 hora', () => {
        const { result } = renderHook(() => useCache());

        act(() => {
            result.current.setCache('test-key', { data: 'test' });
        });

        act(() => {
            vi.advanceTimersByTime(60 * 60 * 1000 + 1);
        });

        expect(result.current.getCache('test-key')).toBeNull();
    });

    it('no expira antes de 1 hora', () => {
        const { result } = renderHook(() => useCache());

        act(() => {
            result.current.setCache('test-key', { data: 'test' });
        });

        act(() => {
            vi.advanceTimersByTime(30 * 60 * 1000);
        });

        expect(result.current.getCache('test-key')).toEqual({ data: 'test' });
    });

    it('elimina items', () => {
        const { result } = renderHook(() => useCache());

        act(() => {
            result.current.setCache('test-key', { data: 'test' });
            result.current.removeCache('test-key');
        });

        expect(result.current.getCache('test-key')).toBeNull();
    });

    it('maneja errores de JSON.parse', () => {
        const { result } = renderHook(() => useCache());
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        localStorage.setItem('test-key', 'invalid-json{');

        expect(result.current.getCache('test-key')).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    it('keys correctas', () => {
        expect(CACHE_KEYS.PRODUCTS).toBe('mobile-store-products');
        expect(CACHE_KEYS.PRODUCT_DETAIL('123')).toBe('mobile-store-product-123');
    });
});
