import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send, Tune } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { ChatOptions, Attachment } from '../types/chat';
import Attachments from './Attachments';
import OptionsPanel from './OptionsPanel';

interface ComposerProps {
    onSend: (text: string, options: ChatOptions, attachments: Attachment[]) => void;
    options: ChatOptions;
    onOptionsChange: (options: ChatOptions) => void;
    attachments: Attachment[];
    onAttachmentsChange: (attachments: Attachment[] | ((prev: Attachment[]) => Attachment[])) => void;
    disabled?: boolean;
    placeholder?: string;
}

const Composer: React.FC<ComposerProps> = ({
    onSend,
    options,
    onOptionsChange,
    attachments,
    onAttachmentsChange,
    disabled = false,
    placeholder = "Type a message..."
}) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showOptionsPanel, setShowOptionsPanel] = useState(false);
    const textareaRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        // Shift+Enter is handled by default textarea behavior (newline)
    };

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage && !disabled) {
            onSend(trimmedMessage, options, attachments);
            setMessage('');
            onAttachmentsChange([]);
        }
    };


    const canSend = message.trim().length > 0 && !disabled;


    // Handle clicking outside the options panel
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showOptionsPanel && optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptionsPanel(false);
            }
        };

        if (showOptionsPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptionsPanel]);

    return (
        <Box
            className="border-t border-gray-200 p-4 bg-white relative"
            sx={{ position: 'relative' }}
        >
            {/* Attached Files Preview */}
            {attachments.length > 0 && (
                <Box className="mb-3">
                    {/* Attachment chips */}
                    <Box className="mb-2">
                        <Attachments
                            attachments={attachments}
                            onAttachmentsChange={onAttachmentsChange}
                            disabled={disabled}
                            showOnlyChips={true}
                        />
                    </Box>
                </Box>
            )}

            {/* Options Panel */}
            <div ref={optionsRef}>
                <OptionsPanel
                    options={options}
                    onOptionsChange={onOptionsChange}
                    onClose={() => setShowOptionsPanel(false)}
                    isOpen={showOptionsPanel}
                />
            </div>

            {/* Message Input */}
            <Box className="flex items-end space-x-2">
                {/* File attachment button */}
                <Box className="flex-shrink-0">
                    <Attachments
                        attachments={attachments}
                        onAttachmentsChange={onAttachmentsChange}
                        disabled={disabled}
                        showOnlyButton={true}
                    />
                </Box>

                {/* Textarea */}
                <TextField
                    ref={textareaRef}
                    fullWidth
                    multiline
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    variant="outlined"
                    size="small"
                    disabled={disabled}
                    minRows={1}
                    maxRows={6}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#F0F0F0',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease-in-out',
                            '& fieldset': {
                                borderColor: 'transparent',
                                transition: 'border-color 0.2s ease-in-out',
                            },
                            '&:hover fieldset': {
                                borderColor: isFocused ? '#9CA3AF' : '#D1D5DB',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#9CA3AF',
                                boxShadow: '0 0 0 2px rgba(156, 163, 175, 0.2)',
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: '#333333',
                            resize: 'none',
                            '&::placeholder': {
                                color: '#999999',
                                opacity: 1,
                            },
                        },
                    }}
                    inputProps={{
                        'aria-label': 'Message input',
                        'aria-describedby': 'message-help-text',
                    }}
                />

                {/* Settings button */}
                <IconButton
                    onClick={() => setShowOptionsPanel(!showOptionsPanel)}
                    disabled={disabled}
                    className="text-gray-500 hover:text-gray-700"
                    sx={{
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label="Response settings"
                >
                    <Tune />
                </IconButton>

                {/* Send button with animation */}
                <motion.div
                    whileHover={canSend ? { scale: 1.05 } : {}}
                    whileTap={canSend ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <IconButton
                        onClick={handleSend}
                        disabled={!canSend}
                        className={`${canSend
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500'
                            }`}
                        sx={{
                            borderRadius: '12px',
                            minWidth: '48px',
                            height: '48px',
                            transition: 'all 0.2s ease-in-out',
                        }}
                        aria-label="Send message"
                    >
                        <motion.div
                            animate={canSend ? { rotate: 0 } : { rotate: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Send />
                        </motion.div>
                    </IconButton>
                </motion.div>
            </Box>

            {/* Help text */}
            <Box
                id="message-help-text"
                className="mt-2 text-xs text-gray-500"
                role="note"
                aria-live="polite"
            >
                Press Enter to send, Shift+Enter for new line
            </Box>
        </Box>
    );
};

export default Composer;
