import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types/chat';

interface MessageBubbleProps {
    message: Message;
}

type MDProps = React.HTMLAttributes<HTMLElement>;
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

// Memoize markdown components to prevent recreation on every render
const markdownComponents = {
    strong: (props: MDProps) => <strong className="font-semibold" {...props} />,
    em: (props: MDProps) => <em className="italic" {...props} />,
    code: (props: MDProps) => (
        <code
            className="px-1 py-0.5 rounded bg-[#EEEEEE] text-black font-mono text-[0.95em]"
            {...props}
        />
    ),
    a: (props: AnchorProps) => (
        <a
            className="underline hover:no-underline text-[#333333]"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    ul: (props: MDProps) => <ul className="list-disc pl-5 space-y-1" {...props} />,
    ol: (props: MDProps) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
    li: (props: MDProps) => <li className="leading-relaxed" {...props} />,
    p: (props: MDProps) => <p className="leading-relaxed break-words" {...props} />,
    pre: (props: MDProps) => (
        <pre className="bg-[#EEEEEE] text-black font-mono rounded-md p-3 overflow-auto" {...props} />
    ),
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    // Memoize timestamp formatting to avoid recalculation
    const formattedTimestamp = useMemo(() => {
        return message.timestamp instanceof Date
            ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, [message.timestamp]);

    // Memoize options text for AI messages
    const optionsText = useMemo(() => {
        if (!message.options) return null;
        return `${message.options.tone.charAt(0).toUpperCase() + message.options.tone.slice(1)} • ${message.options.responseLength.charAt(0).toUpperCase() + message.options.responseLength.slice(1)} • ${message.options.model.toUpperCase()}`;
    }, [message.options]);

    if (isUser) {
        return (
            <Box className="flex items-start space-x-3 justify-end">
                <Box className="flex flex-col items-end">
                    <Box
                        className="bg-black text-white px-4 py-3 rounded-2xl rounded-tr-md max-w-md shadow-sm"
                        aria-label="user message"
                    >
                        <Typography variant="body1" className="whitespace-pre-wrap break-words">
                            {message.text}
                        </Typography>
                    </Box>
                    <Typography
                        variant="caption"
                        className="text-xs text-gray-500 mt-1 mr-1"
                    >
                        {formattedTimestamp}
                    </Typography>
                </Box>
                <img
                    src="/images/allen-jones-image.jpeg"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                />
            </Box>
        );
    }

    // AI message styling
    return (
        <Box className="flex items-start space-x-3">
            {/* AI Avatar */}
            <img
                src="/images/AI-avatar.jpg"
                alt="AI Avatar"
                className="w-8 h-8 rounded-full"
            />

            <Box className="flex flex-col">
                {/* Options indicator */}
                {optionsText && (
                    <Typography
                        variant="caption"
                        className="text-xs text-gray-500 mb-1 ml-1"
                    >
                        {optionsText}
                    </Typography>
                )}

                {/* Message bubble */}
                <Box
                    className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-md max-w-md shadow-sm break-words"
                    aria-label="agent message"
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {message.text}
                    </ReactMarkdown>
                </Box>

                {/* Timestamp */}
                <Typography
                    variant="caption"
                    className="text-xs text-gray-500 mt-1 ml-1"
                >
                    {formattedTimestamp}
                </Typography>
            </Box>
        </Box>
    );
};

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(MessageBubble);
