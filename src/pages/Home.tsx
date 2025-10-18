import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import type { Message, Attachment, ChatOptions } from '../types/chat';
import { DEFAULT_CHAT_OPTIONS } from '../types/chat';
import { generateMessageId } from '../utils/format';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MessageList from '../components/MessageList';
import Composer from '../components/Composer';
import TypingIndicator from '../components/TypingIndicator';

interface HomeProps {
    onRegisterClearHandler?: (handler: () => void) => void;
}

const Home: React.FC<HomeProps> = ({ onRegisterClearHandler }) => {
    // Default initial messages
    const defaultMessages = useMemo<Message[]>(() => [
        {
            id: generateMessageId(),
            text: 'Hello! I\'m your AI assistant. How can I help you today?\n\nHere\'s what I can do:\n\n- **Explain** concepts\n- **Generate** content\n- Answer with `inline code` or links like [Tailwind](https://tailwindcss.com)\n\n1. Ask a question\n2. Share context\n3. Get an answer',
            sender: 'agent' as const,
            timestamp: new Date(Date.now() - 660000),
            attachments: [],
            status: 'delivered' as const
        },
        {
            id: generateMessageId(),
            text: 'Can you show me examples of Markdown formatting? I need to see how bold, italic, inline code, links, and lists work.',
            sender: 'user' as const,
            timestamp: new Date(Date.now() - 600000),
            attachments: [],
            status: 'delivered' as const
        },
        {
            id: generateMessageId(),
            text: 'Absolutely! Here\'s a demonstration:\n\n**Text Formatting:**\n\n- **Bold text** using double asterisks\n- *Italic text* using single asterisks\n- `Inline code` using backticks\n- [Links](https://react.dev) that underline on hover\n\n**Lists:**\n\n- First item\n- Second item\n- Third item\n\n**Numbered List:**\n\n1. Step one\n2. Step two\n3. Step three\n\n**Code Block:**\n\n```js\nfunction greetUser(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greetUser("World"));\n```',
            sender: 'agent' as const,
            timestamp: new Date(Date.now() - 540000),
            attachments: [],
            status: 'delivered' as const
        },
        {
            id: generateMessageId(),
            text: 'That\'s perfect! Can you show me a more complex example with nested lists and mixed formatting?',
            sender: 'user' as const,
            timestamp: new Date(Date.now() - 480000),
            attachments: [],
            status: 'delivered' as const
        },
        {
            id: generateMessageId(),
            text: 'Sure! Here\'s a comprehensive example:\n\n**Development Workflow:**\n\n1. **Planning Phase**\n   - Define requirements using user stories\n   - Create wireframes and mockups\n   - Review design guidelines\n\n2. **Development Phase**\n   - Set up git repository\n   - Implement core features first\n   - Write unit tests\n\n3. **Testing & Deployment**\n   - Run automated tests\n   - Deploy to staging environment\n\n**Sample Configuration (JSON):**\n\n```json\n{\n  "name": "my-project",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node server.js",\n    "test": "jest"\n  }\n}\n```',
            sender: 'agent' as const,
            timestamp: new Date(Date.now() - 420000),
            attachments: [],
            status: 'delivered' as const
        },
        {
            id: generateMessageId(),
            text: 'Can you also show inline code mixed with regular text?',
            sender: 'user' as const,
            timestamp: new Date(Date.now() - 360000),
            attachments: [],
            status: 'delivered' as const
        },
        {
            id: generateMessageId(),
            text: 'Of course! Here are some examples:\n\nTo install the package, run `npm install react` in your terminal.\n\nThe `useState` hook allows you to add state to functional components.\n\nAccess environment variables with `process.env.NODE_ENV` in Node.js.\n\nCheck the [documentation](https://react.dev) for more details about the API endpoints.\n\n**Quick Tips:**\n\n- Use `console.log()` for debugging\n- Always validate user input before processing\n- Remember to handle `async/await` errors properly',
            sender: 'agent' as const,
            timestamp: new Date(Date.now() - 300000),
            attachments: [],
            status: 'delivered' as const
        }
    ], []);

    // Use localStorage for persistence
    const STORAGE_VERSION = '3.0.0'; // Increment this to force reset
    const [messages, setMessages] = useLocalStorage<Message[]>('chat-messages', defaultMessages);
    const [attachedFiles, setAttachedFiles] = useLocalStorage<Attachment[]>('chat-attachments', []);
    const [options, setOptions] = useLocalStorage<ChatOptions>('chat-options', DEFAULT_CHAT_OPTIONS);
    const [storageVersion, setStorageVersion] = useLocalStorage<string>('chat-storage-version', STORAGE_VERSION);

    // Reset conversation if storage version changed
    useEffect(() => {
        if (storageVersion !== STORAGE_VERSION) {
            setMessages(defaultMessages);
            setAttachedFiles([]);
            setOptions(DEFAULT_CHAT_OPTIONS);
            setStorageVersion(STORAGE_VERSION);
        }
    }, [storageVersion, setMessages, setAttachedFiles, setOptions, setStorageVersion, defaultMessages]);

    const [isTyping, setIsTyping] = useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);
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

    // Clear conversation function
    const handleClearConversation = useCallback(() => {
        setMessages(defaultMessages);
        setAttachedFiles([]);
        setOptions(DEFAULT_CHAT_OPTIONS);
        setShowClearDialog(false);
    }, [defaultMessages, setMessages, setAttachedFiles, setOptions]);

    // Register clear handler with parent
    useEffect(() => {
        if (onRegisterClearHandler) {
            onRegisterClearHandler(() => setShowClearDialog(true));
        }
    }, [onRegisterClearHandler]);


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
                <Box className="max-w-6xl mx-auto px-2 sm:px-4">
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

            {/* Clear Conversation Confirmation Dialog */}
            <Dialog
                open={showClearDialog}
                onClose={() => setShowClearDialog(false)}
                aria-labelledby="clear-dialog-title"
                aria-describedby="clear-dialog-description"
            >
                <DialogTitle id="clear-dialog-title">
                    Clear Conversation
                </DialogTitle>
                <DialogContent>
                    <Typography id="clear-dialog-description">
                        Are you sure you want to clear the entire conversation? This action cannot be undone and will reset all messages.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowClearDialog(false)}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClearConversation}
                        color="error"
                        variant="contained"
                    >
                        Clear All
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Home;
