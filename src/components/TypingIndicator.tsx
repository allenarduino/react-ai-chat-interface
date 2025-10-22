import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.08 }}
        >
            <Box
                className="flex items-start space-x-3 p-4"
                role="status"
                aria-busy="true"
                aria-label="AI is typing"
            >
                {/* AI Avatar */}
                <Box
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    sx={{ minWidth: '32px', minHeight: '32px' }}
                >
                    <img
                        src="/images/AI-avatar.jpg"
                        alt="AI Avatar"
                        className="w-full h-full object-cover"
                    />
                </Box>

                {/* Typing Animation */}
                <Box className="flex-1">
                    <Box
                        className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs"
                        sx={{
                            backgroundColor: '#F3F4F6',
                            borderRadius: '18px 18px 18px 4px',
                        }}
                    >
                        <Box className="flex items-center space-x-1">
                            <Typography
                                variant="body2"
                                className="text-gray-600 text-sm"
                            >
                                AI is typing
                            </Typography>
                            <Box className="flex space-x-1">
                                {[0, 1, 2].map((index) => (
                                    <motion.div
                                        key={index}
                                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.4, 1, 0.4],
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: index * 0.05,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
}

// Memoize component since it has no props and doesn't need to re-render
export default React.memo(TypingIndicator);
