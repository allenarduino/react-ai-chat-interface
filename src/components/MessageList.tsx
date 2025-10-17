import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
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
            {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <MessageBubble message={m} />
                </div>
            ))}
            <div ref={endRef} />
        </Box>
    );
};

export default MessageList;
