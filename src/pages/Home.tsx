import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Chip, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { Send, AttachFile, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

interface AttachedFile {
    id: string;
    name: string;
    size: number;
}

const Home: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            sender: 'agent',
            timestamp: new Date(Date.now() - 300000)
        },
        {
            id: '2',
            text: 'Hi! I need help with my React project.',
            sender: 'user',
            timestamp: new Date(Date.now() - 240000)
        },
        {
            id: '3',
            text: 'I\'d be happy to help you with your React project! What specific issues are you facing?',
            sender: 'agent',
            timestamp: new Date(Date.now() - 180000)
        }
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [tone, setTone] = useState('professional');
    const [responseLength, setResponseLength] = useState('medium');
    const [model, setModel] = useState('gpt-4');

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
                id: Date.now().toString(),
                text: newMessage,
                sender: 'user',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, message]);
            setNewMessage('');

            // Simulate agent response
            setTimeout(() => {
                const agentMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'Thanks for your message! I\'m processing your request...',
                    sender: 'agent',
                    timestamp: new Date()
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
        const newFiles: AttachedFile[] = files.map(file => ({
            id: Date.now().toString() + Math.random(),
            name: file.name,
            size: file.size
        }));

        if (attachedFiles.length + newFiles.length <= 5) {
            setAttachedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (fileId: string) => {
        setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                                        {formatTime(message.timestamp)}
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
                        <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                            <MenuItem value="professional">Professional</MenuItem>
                            <MenuItem value="casual">Casual</MenuItem>
                            <MenuItem value="friendly">Friendly</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" className="min-w-32">
                        <InputLabel>Length</InputLabel>
                        <Select value={responseLength} onChange={(e) => setResponseLength(e.target.value)}>
                            <MenuItem value="short">Short</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="long">Long</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" className="min-w-28">
                        <InputLabel>Model</InputLabel>
                        <Select value={model} onChange={(e) => setModel(e.target.value)}>
                            <MenuItem value="gpt-4">GPT-4</MenuItem>
                            <MenuItem value="gpt-3.5">GPT-3.5</MenuItem>
                            <MenuItem value="claude">Claude</MenuItem>
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
