import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import type { Message, Attachment, ChatOptions } from '../types/chat';
import { DEFAULT_CHAT_OPTIONS } from '../types/chat';
import { generateMessageId } from '../utils/format';
import MessageList from '../components/MessageList';
import Composer from '../components/Composer';
import TypingIndicator from '../components/TypingIndicator';

const Home: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: generateMessageId(),
            text: 'Hello! I\'m your AI assistant. How can I help you today?\n\nHere\'s what I can do:\n\n- **Explain** concepts\n- **Generate** content\n- Answer with `inline code` or links like [Tailwind](https://tailwindcss.com)\n\n1. Ask a question\n2. Share context\n3. Get an answer',
            sender: 'agent',
            timestamp: new Date(Date.now() - 300000),
            attachments: [],
            status: 'delivered'
        },
        {
            id: generateMessageId(),
            text: 'Hi! I need help with my React project.',
            sender: 'user',
            timestamp: new Date(Date.now() - 240000),
            attachments: [],
            status: 'delivered'
        },
        {
            id: generateMessageId(),
            text: 'I\'d be happy to help with your React project!\n\nTry this next:\n\n- Create a component named **MessageBubble**\n- Support `inline code` and lists\n\n```js\nconst x = 42;\nconsole.log(x);\n```',
            sender: 'agent',
            timestamp: new Date(Date.now() - 180000),
            attachments: [],
            status: 'delivered'
        }
    ]);

    const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
    const [options, setOptions] = useState<ChatOptions>(DEFAULT_CHAT_OPTIONS);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (text: string, options: ChatOptions, attachments: Attachment[]) => {
        // Add user message immediately
        const userMessage: Message = {
            id: generateMessageId(),
            text,
            sender: 'user',
            timestamp: new Date(),
            attachments,
            status: 'sent',
            options: options
        };

        setMessages(prev => [...prev, userMessage]);
        setAttachedFiles([]);

        // Show typing indicator
        setIsTyping(true);

        // Generate random delay between 300-800ms
        const typingDelay = Math.random() * 500 + 300;

        setTimeout(() => {
            // Hide typing indicator
            setIsTyping(false);

            // Generate AI response
            const agentMessage: Message = {
                id: generateMessageId(),
                text: `Thanks for your message! I'm processing your request with ${options.tone} tone and ${options.responseLength} length using ${options.model}...`,
                sender: 'agent',
                timestamp: new Date(),
                attachments: [],
                status: 'delivered',
                options: options
            };

            setMessages(prev => [...prev, agentMessage]);
        }, typingDelay);
    };


    return (
        <Box className="flex flex-col h-full relative">
            {/* Chat Messages Area - Scrollable */}
            <Box className={`flex-1 overflow-y-auto ${attachedFiles.length > 0 ? 'pb-48' : 'pb-28'}`}>
                <MessageList messages={messages} />

                {/* Typing Indicator */}
                <AnimatePresence>
                    {isTyping && <TypingIndicator />}
                </AnimatePresence>

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </Box>

            {/* Fixed Composer Section at Bottom */}
            <Box className="fixed bottom-0 left-0 right-0 z-50">
                <Box className="max-w-6xl mx-auto px-4">
                    <Box className="bg-white border-t border-gray-200 rounded-t-lg shadow-lg">
                        <Composer
                            onSend={handleSendMessage}
                            options={options}
                            onOptionsChange={setOptions}
                            attachments={attachedFiles}
                            onAttachmentsChange={setAttachedFiles}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
