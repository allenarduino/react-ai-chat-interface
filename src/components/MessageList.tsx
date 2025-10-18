import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { Message } from '../types/chat';
import MessageBubble from './MessageBubble';

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const endRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle scroll events to disable animations while scrolling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);

            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Set timeout to re-enable animations after scrolling stops
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        const scrollContainer = document.querySelector('.overflow-y-auto');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, []);

    return (
        <Box
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 overflow-y-auto p-4 space-y-4"
        >
            {messages.map((m, index) => (
                <motion.div
                    key={m.id}
                    initial={isScrolling ? { opacity: 1, y: 0, scale: 1 } : (m.sender === 'agent' ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 })}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={isScrolling ? { duration: 0 } : (m.sender === 'agent' ? {
                        duration: 0.1,
                        delay: index * 0.02,
                        ease: "easeOut"
                    } : {
                        duration: 0.05,
                        ease: "easeOut"
                    })}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <MessageBubble message={m} />
                </motion.div>
            ))}
            <div ref={endRef} />
        </Box>
    );
};

export default MessageList;
