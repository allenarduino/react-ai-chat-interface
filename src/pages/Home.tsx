import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import type { Message, Attachment, ChatOptions } from '../types/chat';
import { DEFAULT_CHAT_OPTIONS } from '../types/chat';
import { generateMessageId } from '../utils/format';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotificationSound } from '../hooks/useNotificationSound';
import { generateAgentReply } from '../utils/agent';
import MessageList from '../components/MessageList';
import Composer from '../components/Composer';
import TypingIndicator from '../components/TypingIndicator';

interface HomeProps {
    onRegisterClearHandler?: (handler: () => void) => void;
}

const Home: React.FC<HomeProps> = ({ onRegisterClearHandler }) => {
    // Notification sound hook
    const { playNotificationSound } = useNotificationSound();
    const hasPlayedInitialSound = useRef(false);
    const hasUpdatedInitialTimestamp = useRef(false);

    // Default initial message
    const defaultMessages = useMemo<Message[]>(() => [
        {
            id: generateMessageId(),
            text: 'Hello! 👋 I\'m your AI assistant. How can I help you today?\n\n**Here\'s what I support:**\n\n- **Bold text** and *italic text*\n- `Inline code` snippets\n- [Hyperlinks](https://react.dev) that you can click\n- Bulleted and numbered lists\n- Code blocks with syntax highlighting\n\n**Example Code Block:**\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n```\n\n**Numbered Steps:**\n\n1. Ask me anything\n2. Customize response options (tone, length, model)\n3. Attach files if needed\n4. Get instant responses\n\nFeel free to explore the interface and start chatting!',
            sender: 'agent' as const,
            timestamp: new Date(),
            attachments: [],
            status: 'delivered' as const
        }
    ], []);

    // Use localStorage for persistence
    const STORAGE_VERSION = '4.0.0'; // Increment this to force reset
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

    // Update timestamp and play sound for the initial welcome message
    useEffect(() => {
        // Only process when there's exactly one message (the default welcome message)
        if (messages.length === 1 && messages[0].sender === 'agent' && !hasUpdatedInitialTimestamp.current) {
            hasUpdatedInitialTimestamp.current = true;

            // Update the timestamp to current time
            const updatedMessage = { ...messages[0], timestamp: new Date() };
            setMessages([updatedMessage]);

            // Play sound once
            if (!hasPlayedInitialSound.current) {
                hasPlayedInitialSound.current = true;
                // Delay slightly to ensure the component is mounted
                const timer = setTimeout(() => {
                    playNotificationSound();
                }, 500);

                return () => clearTimeout(timer);
            }
        }
    }, [messages, playNotificationSound, setMessages]);

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
        // Function to truncate file names
        const truncateFileName = (fileName: string, maxLength: number = 15) => {
            if (fileName.length <= maxLength) {
                return fileName;
            }
            const extension = fileName.split('.').pop();
            const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
            const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 4); // -4 for "..."
            return `${truncatedName}...${extension}`;
        };

        // Generate file-only message text
        const generateFileMessage = (attachments: Attachment[]) => {
            if (attachments.length === 1) {
                return `Sent file: ${truncateFileName(attachments[0].name)}`;
            } else if (attachments.length <= 3) {
                const fileNames = attachments.map(att => truncateFileName(att.name)).join(', ');
                return `Sent ${attachments.length} files: ${fileNames}`;
            } else {
                const firstFiles = attachments.slice(0, 2).map(att => truncateFileName(att.name)).join(', ');
                return `Sent ${attachments.length} files: ${firstFiles} and ${attachments.length - 2} more`;
            }
        };

        // Add user message immediately
        const userMessage: Message = {
            id: generateMessageId(),
            text: text || (attachments.length > 0 ? generateFileMessage(attachments) : ''),
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

            // Generate realistic AI response based on options
            const agentMessage = generateAgentReply(text, options, attachments);
            agentMessage.options = options; // Add options to the message

            setMessages(prev => [...prev, agentMessage]);

            // Play notification sound when AI responds
            playNotificationSound();
        }, typingDelay);
    };

    // Clear conversation function
    const handleClearConversation = useCallback(() => {
        setMessages(defaultMessages);
        setAttachedFiles([]);
        setOptions(DEFAULT_CHAT_OPTIONS);
        setShowClearDialog(false);
        // Reset the flags so the welcome sound and timestamp update happen again
        hasPlayedInitialSound.current = false;
        hasUpdatedInitialTimestamp.current = false;
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
