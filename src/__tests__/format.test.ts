import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    formatTimestamp,
    formatFileSize,
    formatMessageStatus,
    formatAttachmentType,
    getFileExtension,
    getAttachmentTypeFromMime,
    validateFileSize,
    validateFileType,
    truncateText,
    formatMessageText,
    getRelativeTime,
    isToday,
    isYesterday,
    formatDateForGrouping,
    generateId,
    generateMessageId,
    generateUserId,
    generateAttachmentId
} from '../utils/format';
// Removed unused type imports that caused TS errors

describe('formatTimestamp', () => {
    beforeEach(() => {
        // Mock current time to 2024-01-15 12:00:00
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should format time correctly', () => {
        const date = new Date('2024-01-15T10:30:00Z');
        expect(formatTimestamp(date, 'time')).toBe('10:30 AM');
    });

    it('should format date correctly', () => {
        const date = new Date('2024-01-15T10:30:00Z');
        expect(formatTimestamp(date, 'date')).toBe('Jan 15, 2024');
    });

    it('should format datetime correctly', () => {
        const date = new Date('2024-01-15T10:30:00Z');
        expect(formatTimestamp(date, 'datetime')).toBe('Jan 15, 2024, 10:30 AM');
    });

    it('should format relative time correctly for recent times', () => {
        const recentDate = new Date('2024-01-15T11:58:00Z'); // 2 minutes ago
        expect(formatTimestamp(recentDate, 'relative')).toBe('2m ago');
    });

    it('should format relative time correctly for hours ago', () => {
        const hoursAgo = new Date('2024-01-15T09:00:00Z'); // 3 hours ago
        expect(formatTimestamp(hoursAgo, 'relative')).toBe('3h ago');
    });

    it('should format relative time correctly for days ago', () => {
        const daysAgo = new Date('2024-01-13T12:00:00Z'); // 2 days ago
        expect(formatTimestamp(daysAgo, 'relative')).toBe('2d ago');
    });

    it('should handle invalid dates', () => {
        expect(formatTimestamp('invalid-date')).toBe('Invalid date');
    });

    it('should handle string timestamps', () => {
        const dateString = '2024-01-15T10:30:00Z';
        expect(formatTimestamp(dateString, 'time')).toBe('10:30 AM');
    });
});

describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(1048576)).toBe('1 MB');
        expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle custom decimal places', () => {
        expect(formatFileSize(1536, 1)).toBe('1.5 KB');
        expect(formatFileSize(1536, 0)).toBe('2 KB');
    });

    it('should handle very large numbers', () => {
        expect(formatFileSize(1099511627776)).toBe('1 TB');
    });
});

describe('formatMessageStatus', () => {
    it('should format all message statuses correctly', () => {
        expect(formatMessageStatus('sending')).toBe('Sending...');
        expect(formatMessageStatus('sent')).toBe('Sent');
        expect(formatMessageStatus('delivered')).toBe('Delivered');
        expect(formatMessageStatus('failed')).toBe('Failed');
        expect(formatMessageStatus('read')).toBe('Read');
    });
});

describe('formatAttachmentType', () => {
    it('should format all attachment types correctly', () => {
        expect(formatAttachmentType('image')).toBe('Image');
        expect(formatAttachmentType('document')).toBe('Document');
        expect(formatAttachmentType('audio')).toBe('Audio');
        expect(formatAttachmentType('video')).toBe('Video');
        expect(formatAttachmentType('text')).toBe('Text');
        expect(formatAttachmentType('other')).toBe('File');
    });
});

describe('getFileExtension', () => {
    it('should extract file extensions correctly', () => {
        expect(getFileExtension('document.pdf')).toBe('pdf');
        expect(getFileExtension('image.jpg')).toBe('jpg');
        expect(getFileExtension('file.txt')).toBe('txt');
        expect(getFileExtension('archive.tar.gz')).toBe('gz');
    });

    it('should handle files without extensions', () => {
        expect(getFileExtension('README')).toBe('');
    });
});

describe('getAttachmentTypeFromMime', () => {
    it('should determine attachment type from MIME type', () => {
        expect(getAttachmentTypeFromMime('image/jpeg')).toBe('image');
        expect(getAttachmentTypeFromMime('video/mp4')).toBe('video');
        expect(getAttachmentTypeFromMime('audio/mpeg')).toBe('audio');
        expect(getAttachmentTypeFromMime('text/plain')).toBe('text');
        expect(getAttachmentTypeFromMime('application/pdf')).toBe('document');
        expect(getAttachmentTypeFromMime('application/unknown')).toBe('other');
    });
});

describe('validateFileSize', () => {
    it('should validate file sizes correctly', () => {
        expect(validateFileSize(1024, 2048)).toBe(true);
        expect(validateFileSize(2048, 1024)).toBe(false);
        expect(validateFileSize(1024)).toBe(true); // default 10MB limit
    });
});

describe('validateFileType', () => {
    it('should validate file types correctly', () => {
        expect(validateFileType('image/jpeg')).toBe(true);
        expect(validateFileType('application/pdf')).toBe(true);
        expect(validateFileType('text/plain')).toBe(true);
        expect(validateFileType('application/unknown')).toBe(false);
    });

    it('should work with custom allowed types', () => {
        const customTypes = ['image/jpeg', 'image/png'] as const;
        expect(validateFileType('image/jpeg', customTypes)).toBe(true);
        expect(validateFileType('image/gif', customTypes)).toBe(false);
    });
});

describe('truncateText', () => {
    it('should truncate long text correctly', () => {
        const longText = 'This is a very long text that should be truncated';
        expect(truncateText(longText, 20)).toBe('This is a very long...');
        expect(truncateText(longText, 20, '...')).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
        const shortText = 'Short text';
        expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should handle custom suffix', () => {
        const longText = 'This is a very long text';
        expect(truncateText(longText, 10, ' [more]')).toBe('This [more]');
    });
});

describe('formatMessageText', () => {
    it('should format markdown-like syntax', () => {
        const text = '**Bold** and *italic* and `code`';
        const result = formatMessageText(text);
        expect(result).toContain('<strong>Bold</strong>');
        expect(result).toContain('<em>italic</em>');
        expect(result).toContain('<code>code</code>');
    });

    it('should convert line breaks to HTML', () => {
        const text = 'Line 1\nLine 2';
        const result = formatMessageText(text);
        expect(result).toContain('<br>');
    });
});

describe('getRelativeTime', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return relative time', () => {
        const recentDate = new Date('2024-01-15T11:58:00Z');
        expect(getRelativeTime(recentDate)).toBe('2m ago');
    });
});

describe('isToday', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should identify today correctly', () => {
        const today = new Date('2024-01-15T10:00:00Z');
        expect(isToday(today)).toBe(true);
    });

    it('should identify non-today correctly', () => {
        const yesterday = new Date('2024-01-14T10:00:00Z');
        expect(isToday(yesterday)).toBe(false);
    });
});

describe('isYesterday', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should identify yesterday correctly', () => {
        const yesterday = new Date('2024-01-14T10:00:00Z');
        expect(isYesterday(yesterday)).toBe(true);
    });

    it('should identify non-yesterday correctly', () => {
        const today = new Date('2024-01-15T10:00:00Z');
        expect(isYesterday(today)).toBe(false);
    });
});

describe('formatDateForGrouping', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should format today correctly', () => {
        const today = new Date('2024-01-15T10:00:00Z');
        expect(formatDateForGrouping(today)).toBe('Today');
    });

    it('should format yesterday correctly', () => {
        const yesterday = new Date('2024-01-14T10:00:00Z');
        expect(formatDateForGrouping(yesterday)).toBe('Yesterday');
    });

    it('should format other dates correctly', () => {
        const otherDate = new Date('2024-01-10T10:00:00Z');
        const result = formatDateForGrouping(otherDate);
        expect(result).toContain('Wednesday');
        expect(result).toContain('January');
        expect(result).toContain('2024');
    });
});

describe('ID Generation', () => {
    it('should generate unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
        expect(typeof id1).toBe('string');
        expect(id1.length).toBeGreaterThan(0);
    });

    it('should generate typed IDs', () => {
        const messageId = generateMessageId();
        const userId = generateUserId();
        const attachmentId = generateAttachmentId();

        expect(typeof messageId).toBe('string');
        expect(typeof userId).toBe('string');
        expect(typeof attachmentId).toBe('string');
    });
});
