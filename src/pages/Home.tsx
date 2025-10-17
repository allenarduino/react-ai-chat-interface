import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Chip, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Send, AttachFile, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type {
    Message,
    Attachment,
    ChatOptions,
    ToneType,
    ResponseLengthType,
    ModelType,
} from '../types/chat';
import {
    TONE_OPTIONS,
    RESPONSE_LENGTH_OPTIONS,
    MODEL_OPTIONS,
    DEFAULT_CHAT_OPTIONS,
    SUPPORTED_FILE_TYPES,
    MAX_ATTACHMENT_SIZE,
} from '../types/chat';
import {
    formatTimestamp,
    formatFileSize,
    generateMessageId,
    generateAttachmentId,
    getAttachmentTypeFromMime,
    validateFileSize,
    validateFileType,
} from '../utils/format';

const Home: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: generateMessageId(),
            text: 'Hello! How can I help you today?',
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
            text: 'I\'d be happy to help you with your React project! What specific issues are you facing?',
            sender: 'agent',
            timestamp: new Date(Date.now() - 180000),
            attachments: [],
            status: 'delivered'
        }
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
    const [options, setOptions] = useState<ChatOptions>(DEFAULT_CHAT_OPTIONS);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: generateMessageId(),
                text: newMessage,
                sender: 'user',
                timestamp: new Date(),
                attachments: attachedFiles,
                status: 'sending'
            };

            setMessages(prev => [...prev, message]);
            setNewMessage('');
            setAttachedFiles([]);

            // Update message status to sent
            setTimeout(() => {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === message.id ? { ...msg, status: 'sent' } : msg
                    )
                );
            }, 500);

            // Simulate agent response
            setTimeout(() => {
                const agentMessage: Message = {
                    id: generateMessageId(),
                    text: 'Thanks for your message! I\'m processing your request...',
                    sender: 'agent',
                    timestamp: new Date(),
                    attachments: [],
                    status: 'delivered'
                };
                setMessages(prev => [...prev, agentMessage]);
            }, 1000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file => {
            const isValidSize = validateFileSize(file.size, MAX_ATTACHMENT_SIZE);
            const isValidType = validateFileType(file.type, SUPPORTED_FILE_TYPES);
            return isValidSize && isValidType;
        });

        const newFiles: Attachment[] = validFiles.map(file => ({
            id: generateAttachmentId(),
            name: file.name,
            size: file.size,
            type: getAttachmentTypeFromMime(file.type),
            mimeType: file.type,
            uploadedAt: new Date()
        }));

        if (attachedFiles.length + newFiles.length <= 5) {
            setAttachedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (fileId: string) => {
        setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    };

    return (
        <Box className="flex flex-col h-full">
            {/* Chat Messages Area */}
            <Box className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <Box className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}>
                                {message.sender === 'agent' && (
                                    <Box className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                        AI
                                    </Box>
                                )}

                                <Box className="flex flex-col">
                                    <Box
                                        className={`px-4 py-2 rounded-2xl shadow-sm ${message.sender === 'user'
                                            ? 'bg-black text-white rounded-br-md'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                            }`}
                                    >
                                        <Typography variant="body1" className="whitespace-pre-wrap">
                                            {message.text}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="caption"
                                        className={`text-gray-500 text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'
                                            }`}
                                    >
                                        {formatTimestamp(message.timestamp, 'time')}
                                    </Typography>
                                </Box>

                                {message.sender === 'user' && (
                                    <Box className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium text-white">
                                        U
                                    </Box>
                                )}
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </Box>

            {/* Composer Section */}
            <Box className="border-t border-gray-200 p-4 bg-white">
                {/* Attached Files */}
                {attachedFiles.length > 0 && (
                    <Box className="mb-3 flex flex-wrap gap-2">
                        {attachedFiles.map((file) => (
                            <Chip
                                key={file.id}
                                label={`${file.name} (${formatFileSize(file.size)})`}
                                onDelete={() => removeFile(file.id)}
                                deleteIcon={<Close />}
                                size="small"
                                className="bg-gray-100"
                            />
                        ))}
                    </Box>
                )}

                {/* Options Panel */}
                <Box className="flex space-x-4 mb-3">
                    <FormControl size="small" className="min-w-24">
                        <InputLabel>Tone</InputLabel>
                        <Select
                            value={options.tone}
                            onChange={(e: SelectChangeEvent<ToneType>) =>
                                setOptions(prev => ({ ...prev, tone: e.target.value as ToneType }))}
                        >
                            {TONE_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" className="min-w-32">
                        <InputLabel>Length</InputLabel>
                        <Select
                            value={options.responseLength}
                            onChange={(e: SelectChangeEvent<ResponseLengthType>) =>
                                setOptions(prev => ({ ...prev, responseLength: e.target.value as ResponseLengthType }))}
                        >
                            {RESPONSE_LENGTH_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" className="min-w-28">
                        <InputLabel>Model</InputLabel>
                        <Select
                            value={options.model}
                            onChange={(e: SelectChangeEvent<ModelType>) =>
                                setOptions(prev => ({ ...prev, model: e.target.value as ModelType }))}
                        >
                            {MODEL_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Message Input */}
                <Box className="flex items-end space-x-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    />

                    <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={attachedFiles.length >= 5}
                    >
                        <AttachFile />
                    </IconButton>

                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#F0F0F0',
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#D1D5DB',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#9CA3AF',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: '#333333',
                                '&::placeholder': {
                                    color: '#999999',
                                    opacity: 1,
                                },
                            },
                        }}
                    />

                    <IconButton
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
                        sx={{
                            borderRadius: '12px',
                            minWidth: '48px',
                            height: '48px',
                        }}
                    >
                        <Send />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
