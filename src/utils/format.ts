import type {
    MessageId,
    UserId,
    AttachmentId,
    MessageStatus,
    AttachmentType
} from '../types/chat';

/**
 * Generate a unique ID with proper typing
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a typed MessageId
 */
export function generateMessageId(): MessageId {
    return generateId() as MessageId;
}

/**
 * Generate a typed UserId
 */
export function generateUserId(): UserId {
    return generateId() as UserId;
}

/**
 * Generate a typed AttachmentId
 */
export function generateAttachmentId(): AttachmentId {
    return generateId() as AttachmentId;
}

/**
 * Format timestamp for display
 * @param timestamp - Date object or ISO string
 * @param format - Display format ('time', 'date', 'datetime', 'relative')
 * @returns Formatted timestamp string
 */
export function formatTimestamp(
    timestamp: Date | string,
    format: 'time' | 'date' | 'datetime' | 'relative' = 'time'
): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    switch (format) {
        case 'time':
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

        case 'date':
            return date.toLocaleDateString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

        case 'datetime':
            return date.toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

        case 'relative':
            if (diffInSeconds < 60) {
                return 'Just now';
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `${minutes}m ago`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `${hours}h ago`;
            } else if (diffInSeconds < 604800) {
                const days = Math.floor(diffInSeconds / 86400);
                return `${days}d ago`;
            } else {
                return date.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric'
                });
            }

        default:
            return date.toLocaleTimeString();
    }
}

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format message status for display
 * @param status - Message status
 * @returns Human-readable status string
 */
export function formatMessageStatus(status: MessageStatus): string {
    const statusMap: Record<MessageStatus, string> = {
        sending: 'Sending...',
        sent: 'Sent',
        delivered: 'Delivered',
        failed: 'Failed',
        read: 'Read'
    };

    return statusMap[status] || 'Unknown';
}

/**
 * Format attachment type for display
 * @param type - Attachment type
 * @returns Human-readable type string
 */
export function formatAttachmentType(type: AttachmentType): string {
    const typeMap: Record<AttachmentType, string> = {
        image: 'Image',
        document: 'Document',
        audio: 'Audio',
        video: 'Video',
        text: 'Text',
        other: 'File'
    };

    return typeMap[type] || 'Unknown';
}

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns File extension (without dot)
 */
export function getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Determine attachment type from MIME type
 * @param mimeType - MIME type string
 * @returns Attachment type
 */
export function getAttachmentTypeFromMime(mimeType: string): AttachmentType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) return 'document';
    return 'other';
}

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSize - Maximum allowed size in bytes
 * @returns True if valid, false otherwise
 */
export function validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
    return size <= maxSize;
}

/**
 * Validate file type
 * @param mimeType - MIME type string
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if valid, false otherwise
 */
export function validateFileType(
    mimeType: string,
    allowedTypes: readonly string[] = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'audio/mpeg', 'audio/wav',
        'video/mp4', 'video/webm'
    ]
): boolean {
    return allowedTypes.includes(mimeType);
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncating
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 100, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Format message text for display (handle line breaks, etc.)
 * @param text - Message text
 * @returns Formatted text
 */
export function formatMessageText(text: string): string {
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
}

/**
 * Get relative time string for a date
 * @param date - Date object
 * @returns Relative time string
 */
export function getRelativeTime(date: Date): string {
    return formatTimestamp(date, 'relative');
}

/**
 * Check if a date is today
 * @param date - Date object
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is yesterday
 * @param date - Date object
 * @returns True if date is yesterday
 */
export function isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}

/**
 * Format date for message grouping
 * @param date - Date object
 * @returns Formatted date string for grouping
 */
export function formatDateForGrouping(date: Date): string {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return date.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
