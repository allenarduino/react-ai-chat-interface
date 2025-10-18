import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            if (!item) return initialValue;

            // Parse and revive Date objects
            const parsed = JSON.parse(item, (_key, value) => {
                // Check if the value looks like a date string
                if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                    return new Date(value);
                }
                return value;
            });

            return parsed;
        } catch (error) {
            // If error also return initialValue
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: SetValue<T>) => {
        try {
            // Use functional update to ensure we have the latest state
            setStoredValue((prevValue) => {
                // Allow value to be a function so we have the same API as useState
                const valueToStore = value instanceof Function ? value(prevValue) : value;
                // Save to local storage
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
                return valueToStore;
            });
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Clear the value from localStorage
    const clearValue = () => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`Error clearing localStorage key "${key}":`, error);
        }
    };

    // Listen for changes to this localStorage key from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    // Parse and revive Date objects
                    const parsed = JSON.parse(e.newValue, (_key, value) => {
                        // Check if the value looks like a date string
                        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                            return new Date(value);
                        }
                        return value;
                    });
                    setStoredValue(parsed);
                } catch (error) {
                    console.warn(`Error parsing localStorage key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, clearValue];
}

// Schema version for migration handling
export const STORAGE_SCHEMA_VERSION = '1.0.0';

// Helper function to check and migrate data if needed
export function migrateStorageData<T>(data: unknown, expectedVersion: string): T | null {
    try {
        // Type guard to check if data has _schemaVersion property
        if (!data || typeof data !== 'object' || !('_schemaVersion' in data)) {
            return data as T;
        }

        const versionedData = data as Record<string, unknown>;

        // If versions match, return the data
        if (versionedData._schemaVersion === expectedVersion) {
            return data as T;
        }

        // Handle different schema versions
        switch (versionedData._schemaVersion) {
            case '0.9.0':
                // Example migration from 0.9.0 to 1.0.0
                // Add any necessary transformations here
                console.log('Migrating data from schema version 0.9.0 to 1.0.0');
                return {
                    ...versionedData,
                    _schemaVersion: expectedVersion,
                    // Add any new required fields with defaults
                } as T;
            default:
                console.warn(`Unknown schema version: ${versionedData._schemaVersion}`);
                return null;
        }
    } catch (error) {
        console.warn('Error migrating storage data:', error);
        return null;
    }
}

// Helper function to create storage data with schema version
export function createStorageData<T>(data: T): T & { _schemaVersion: string } {
    return {
        ...data,
        _schemaVersion: STORAGE_SCHEMA_VERSION,
    };
}
