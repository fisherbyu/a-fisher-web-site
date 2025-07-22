'use client';
import { useCallback, useRef, useEffect } from 'react';

/**
 * A custom hook that returns a debounced version of the provided callback function.
 *
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback function
 */
export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): (...args: Parameters<T>) => void {
    // Use useRef to persist the timeout between renders
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Clean up the timeout when the component unmounts or when dependencies change
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Create a memoized version of the debounced function
    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set a new timeout
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    return debouncedCallback;
}
