import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types/chat';

interface MessageBubbleProps {
    message: Message;
}

type MDProps = React.HTMLAttributes<HTMLElement>;
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

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
    p: (props: MDProps) => <p className="leading-relaxed" {...props} />,
    pre: (props: MDProps) => (
        <pre className="bg-[#EEEEEE] text-black font-mono rounded-md p-3 overflow-auto" {...props} />
    ),
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    const bubbleClasses = isUser
        ? 'bg-black text-white rounded-2xl rounded-br-md'
        : 'bg-[#F5F5F5] text-[#333333] rounded-2xl rounded-bl-md';

    return (
        <Box className={`flex items-start space-x-2 max-w-xl ${isUser ? 'justify-end flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <Avatar sx={{ width: 32, height: 32 }}>
                {isUser ? 'U' : 'AI'}
            </Avatar>

            {/* Bubble */}
            <Box className={`px-4 py-2 shadow-sm ${bubbleClasses}`} aria-label={`${message.sender} message`}>
                {isUser ? (
                    <Typography variant="body1" className="whitespace-pre-wrap">
                        {message.text}
                    </Typography>
                ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {message.text}
                    </ReactMarkdown>
                )}

                <Typography variant="caption" className={`mt-1 block text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
            </Box>
        </Box>
    );
};

export default MessageBubble;
