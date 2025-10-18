import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { Message } from '../types/chat';
import MessageBubble from './MessageBubble';

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const endRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
                    initial={m.sender === 'agent' ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={m.sender === 'agent' ? {
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut"
                    } : {
                        duration: 0.2,
                        ease: "easeOut"
                    }}
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
