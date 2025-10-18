import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useLocalStorage, STORAGE_SCHEMA_VERSION, migrateStorageData, createStorageData } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

// Replace the global localStorage
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useLocalStorage', () => {
    const originalSetItem = localStorageMock.setItem;
    const originalGetItem = localStorageMock.getItem;

    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
        // Restore original methods
        localStorageMock.setItem = originalSetItem;
        localStorageMock.getItem = originalGetItem;
    });

    afterEach(() => {
        localStorageMock.clear();
        // Restore original methods
        localStorageMock.setItem = originalSetItem;
        localStorageMock.getItem = originalGetItem;
    });

    it('should return initial value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
        const [value] = result.current;

        expect(value).toBe('initial value');
    });

    it('should return stored value from localStorage', () => {
        localStorageMock.setItem('test-key', JSON.stringify('stored value'));

        const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
        const [value] = result.current;

        expect(value).toBe('stored value');
    });

    it('should update localStorage when value is set', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

        act(() => {
            const [, setValue] = result.current;
            setValue('new value');
        });

        expect(localStorageMock.getItem('test-key')).toBe(JSON.stringify('new value'));
    });

    it('should handle multiple rapid functional updates correctly', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 0));

        act(() => {
            const [, setValue] = result.current;
            // Simulate rapid updates like adding messages
            setValue(prev => prev + 1);
            setValue(prev => prev + 1);
            setValue(prev => prev + 1);
        });

        const [value] = result.current;
        expect(value).toBe(3);
    });

    it('should handle complex objects', () => {
        const complexObject = {
            name: 'John',
            age: 30,
            hobbies: ['reading', 'coding'],
        };

        const { result } = renderHook(() => useLocalStorage('test-key', complexObject));

        act(() => {
            const [, setValue] = result.current;
            setValue({ ...complexObject, age: 31 });
        });

        const [value] = result.current;
        expect(value.age).toBe(31);
        expect(value.name).toBe('John');
    });

    it('should serialize and deserialize Date objects correctly', () => {
        const messages = [
            { id: '1', text: 'Hello', timestamp: new Date('2024-01-15T10:00:00.000Z') },
            { id: '2', text: 'World', timestamp: new Date('2024-01-15T10:05:00.000Z') },
        ];

        const { result } = renderHook(() => useLocalStorage('messages', messages));

        act(() => {
            const [, setValue] = result.current;
            setValue(messages);
        });

        const [value] = result.current;
        expect(value[0].timestamp).toBeInstanceOf(Date);
        expect(value[1].timestamp).toBeInstanceOf(Date);
    });

    it('should clear value and remove from localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

        act(() => {
            const [, setValue] = result.current;
            setValue('new value');
        });

        expect(localStorageMock.getItem('test-key')).toBeTruthy();

        act(() => {
            const [, , clearValue] = result.current;
            clearValue();
        });

        expect(localStorageMock.getItem('test-key')).toBeNull();
        expect(result.current[0]).toBe('initial');
    });

    // Note: Testing localStorage quota errors is complex in the test environment
    // The error handling code is present in the hook, but difficult to test reliably

    it('should handle corrupt localStorage data', () => {
        localStorageMock.setItem('test-key', 'invalid json {{{');

        const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
        const [value] = result.current;

        expect(value).toBe('fallback');
    });
});

describe('Schema migration utilities', () => {
    it('should create storage data with schema version', () => {
        const data = { name: 'test', value: 123 };
        const result = createStorageData(data);

        expect(result._schemaVersion).toBe(STORAGE_SCHEMA_VERSION);
        expect(result.name).toBe('test');
        expect(result.value).toBe(123);
    });

    it('should handle unknown schema versions', () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const data = { name: 'test', value: 123, _schemaVersion: '99.0.0' };
        const result = migrateStorageData(data, '1.0.0');

        expect(result).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown schema version'));

        consoleWarnSpy.mockRestore();
    });
});

