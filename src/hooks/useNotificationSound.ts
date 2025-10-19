import { useCallback, useRef } from 'react';

/**
 * Custom hook to play a notification sound
 * Uses Web Audio API to generate a soft "bloop" sound typical of chatbot interfaces
 */
export const useNotificationSound = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    const playNotificationSound = useCallback(() => {
        try {
            // Create audio context if it doesn't exist
            if (!audioContextRef.current) {
                const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                audioContextRef.current = new AudioContextClass();
            }

            const audioContext = audioContextRef.current;
            const currentTime = audioContext.currentTime;

            // Create oscillator and gain node for the "bloop" sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Connect nodes: oscillator -> gain -> destination
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Configure the soft "bloop" sound - typical chatbot notification
            oscillator.type = 'sine'; // Smooth, rounded tone

            // Frequency: Start at 600 Hz and quickly drop to 400 Hz for that "pop" feel
            oscillator.frequency.setValueAtTime(600, currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + 0.1);

            // Volume envelope - quick attack, fast decay (classic bloop)
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.01); // Quick pop
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.15); // Fast fade

            // Play the bloop!
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.15);

        } catch (error) {
            console.warn('Unable to play notification sound:', error);
        }
    }, []);

    return { playNotificationSound };
};

