// Branded types for better type safety
export type MessageId = string & { readonly __brand: 'MessageId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type AttachmentId = string & { readonly __brand: 'AttachmentId' };

// Union types for better type safety
export type SenderType = 'user' | 'agent';
export type ToneType = 'professional' | 'casual' | 'friendly' | 'formal' | 'creative';
export type ResponseLengthType = 'short' | 'medium' | 'long' | 'detailed';
export type ModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-3.5-sonnet' | 'gemini-pro';
export type AttachmentType = 'image' | 'document' | 'audio' | 'video' | 'text' | 'other';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed' | 'read';

// User interface
export interface User {
    id: UserId;
    name: string;
    avatar?: string;
    email?: string;
    preferences?: UserPreferences;
}

// User preferences
export interface UserPreferences {
    defaultTone: ToneType;
    defaultResponseLength: ResponseLengthType;
    defaultModel: ModelType;
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    autoScroll: boolean;
}

// Agent reply style configuration
export interface AgentReplyStyle {
    tone: ToneType;
    responseLength: ResponseLengthType;
    model: ModelType;
    temperature?: number; // 0-1, controls randomness
    maxTokens?: number;
    systemPrompt?: string;
    includeTimestamp?: boolean;
    includeMetadata?: boolean;
}

// File attachment interface
export interface Attachment {
    id: AttachmentId;
    name: string;
    size: number; // in bytes
    type: AttachmentType;
    mimeType: string;
    url?: string; // for uploaded files
    data?: string; // base64 data for small files
    uploadedAt: Date;
    metadata?: AttachmentMetadata;
}

// Attachment metadata
export interface AttachmentMetadata {
    width?: number; // for images/videos
    height?: number; // for images/videos
    duration?: number; // for audio/video in seconds
    pages?: number; // for documents
    encoding?: string;
    checksum?: string;
}

// Chat options interface
export interface ChatOptions {
    tone: ToneType;
    responseLength: ResponseLengthType;
    model: ModelType;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    includeContext?: boolean;
    maxAttachments?: number;
    maxAttachmentSize?: number; // in bytes
}

// Message interface - the core data structure
export interface Message {
    id: MessageId;
    sender: SenderType;
    text: string;
    timestamp: Date;
    style?: AgentReplyStyle | null;
    attachments: Attachment[];
    status: MessageStatus;
    metadata?: MessageMetadata;
    replyTo?: MessageId; // for threaded conversations
    editedAt?: Date;
    reactions?: Reaction[];
}

// Message metadata
export interface MessageMetadata {
    processingTime?: number; // in milliseconds
    tokenCount?: number;
    modelUsed?: ModelType;
    confidence?: number; // 0-1, for AI responses
    sources?: string[]; // URLs or references
    tags?: string[];
    priority?: 'low' | 'normal' | 'high';
}

// Reaction interface
export interface Reaction {
    emoji: string;
    userId: UserId;
    timestamp: Date;
}

// Chat session interface
export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    participants: User[];
    createdAt: Date;
    updatedAt: Date;
    settings: ChatOptions;
    isActive: boolean;
    tags?: string[];
}

// API response types
export interface ChatResponse {
    message: Message;
    suggestions?: string[];
    error?: string;
    metadata?: {
        processingTime: number;
        tokenCount: number;
        modelUsed: ModelType;
    };
}

// Error types
export interface ChatError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: Date;
}

// Type guards for runtime type checking
export const isUser = (obj: unknown): obj is User => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'name' in obj &&
        typeof (obj as User).id === 'string' &&
        typeof (obj as User).name === 'string'
    );
};

export const isMessage = (obj: unknown): obj is Message => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'sender' in obj &&
        'text' in obj &&
        'timestamp' in obj &&
        'attachments' in obj &&
        'status' in obj &&
        typeof (obj as Message).id === 'string' &&
        ['user', 'agent'].includes((obj as Message).sender) &&
        typeof (obj as Message).text === 'string' &&
        (obj as Message).timestamp instanceof Date &&
        Array.isArray((obj as Message).attachments) &&
        ['sending', 'sent', 'delivered', 'failed', 'read'].includes((obj as Message).status)
    );
};

export const isAttachment = (obj: unknown): obj is Attachment => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'name' in obj &&
        'size' in obj &&
        'type' in obj &&
        'mimeType' in obj &&
        'uploadedAt' in obj &&
        typeof (obj as Attachment).id === 'string' &&
        typeof (obj as Attachment).name === 'string' &&
        typeof (obj as Attachment).size === 'number' &&
        typeof (obj as Attachment).mimeType === 'string' &&
        (obj as Attachment).uploadedAt instanceof Date
    );
};

// Default values
export const DEFAULT_CHAT_OPTIONS: ChatOptions = {
    tone: 'professional',
    responseLength: 'medium',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    includeContext: true,
    maxAttachments: 5,
    maxAttachmentSize: 10 * 1024 * 1024, // 10MB
};

export const DEFAULT_AGENT_STYLE: AgentReplyStyle = {
    tone: 'professional',
    responseLength: 'medium',
    model: 'gpt-4',
    temperature: 0.7,
    includeTimestamp: true,
    includeMetadata: false,
};

// Constants
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_ATTACHMENTS = 5;
export const SUPPORTED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg',
    'audio/wav',
    'video/mp4',
    'video/webm',
] as const;

export const TONE_OPTIONS: { value: ToneType; label: string; description: string }[] = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
    { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'formal', label: 'Formal', description: 'Strictly professional and structured' },
    { value: 'creative', label: 'Creative', description: 'Imaginative and expressive' },
];

export const RESPONSE_LENGTH_OPTIONS: { value: ResponseLengthType; label: string; description: string }[] = [
    { value: 'short', label: 'Short', description: 'Brief and concise (1-2 sentences)' },
    { value: 'medium', label: 'Medium', description: 'Balanced response (2-4 sentences)' },
    { value: 'long', label: 'Long', description: 'Detailed response (4+ sentences)' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough' },
];

export const MODEL_OPTIONS: { value: ModelType; label: string; description: string }[] = [
    { value: 'gpt-4', label: 'GPT-4', description: 'Most capable, best for complex tasks' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
    { value: 'claude-3', label: 'Claude 3', description: 'Anthropic\'s advanced model' },
    { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Latest Claude model' },
    { value: 'gemini-pro', label: 'Gemini Pro', description: 'Google\'s advanced model' },
];
