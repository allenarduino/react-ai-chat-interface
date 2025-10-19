import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotificationSound } from '../useNotificationSound';

describe('useNotificationSound', () => {
    beforeEach(() => {
        // Mock AudioContext
        global.AudioContext = vi.fn().mockImplementation(() => ({
            currentTime: 0,
            createOscillator: vi.fn().mockReturnValue({
                connect: vi.fn(),
                start: vi.fn(),
                stop: vi.fn(),
                frequency: {
                    setValueAtTime: vi.fn(),
                },
                type: 'sine',
            }),
            createGain: vi.fn().mockReturnValue({
                connect: vi.fn(),
                gain: {
                    setValueAtTime: vi.fn(),
                    linearRampToValueAtTime: vi.fn(),
                },
            }),
            destination: {},
        })) as unknown as typeof AudioContext;
    });

    it('should return playNotificationSound function', () => {
        const { result } = renderHook(() => useNotificationSound());
        expect(result.current.playNotificationSound).toBeDefined();
        expect(typeof result.current.playNotificationSound).toBe('function');
    });

    it('should play notification sound without errors', () => {
        const { result } = renderHook(() => useNotificationSound());
        expect(() => result.current.playNotificationSound()).not.toThrow();
    });

    it('should handle AudioContext errors gracefully', () => {
        // Mock console.warn to suppress warning output
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        // Make AudioContext throw an error
        global.AudioContext = vi.fn().mockImplementation(() => {
            throw new Error('AudioContext not supported');
        }) as unknown as typeof AudioContext;

        const { result } = renderHook(() => useNotificationSound());

        // Should not throw error
        expect(() => result.current.playNotificationSound()).not.toThrow();

        // Should log warning
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'Unable to play notification sound:',
            expect.any(Error)
        );

        consoleWarnSpy.mockRestore();
    });
});

