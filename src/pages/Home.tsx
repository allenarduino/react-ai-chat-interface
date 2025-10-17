import React, { useState } from 'react';
import { Box } from '@mui/material';
import type { Message, Attachment, ChatOptions } from '../types/chat';
import { DEFAULT_CHAT_OPTIONS } from '../types/chat';
import { generateMessageId } from '../utils/format';
import MessageList from '../components/MessageList';
import Composer from '../components/Composer';

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

    const handleSendMessage = (text: string, options: ChatOptions, attachments: Attachment[]) => {
        const message: Message = {
            id: generateMessageId(),
            text,
            sender: 'user',
            timestamp: new Date(),
            attachments,
            status: 'sending'
        };

        setMessages(prev => [...prev, message]);
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
                text: `Thanks for your message! I'm processing your request with ${options.tone} tone and ${options.responseLength} length using ${options.model}...`,
                sender: 'agent',
                timestamp: new Date(),
                attachments: [],
                status: 'delivered'
            };
            setMessages(prev => [...prev, agentMessage]);
        }, 1000);
    };


    return (
        <Box className="flex flex-col h-full">
            {/* Chat Messages Area */}
            <MessageList messages={messages} />

            {/* Composer Section */}
            <Composer
                onSend={handleSendMessage}
                options={options}
                onOptionsChange={setOptions}
                attachments={attachedFiles}
                onAttachmentsChange={setAttachedFiles}
            />
        </Box>
    );
};

export default Home;
