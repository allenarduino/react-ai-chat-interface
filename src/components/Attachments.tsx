import React, { useState, useRef, useCallback } from 'react';
import { Box, Chip, Typography, Alert, IconButton } from '@mui/material';
import {
    Close,
    AttachFile,
    ErrorOutline,
    ImageOutlined,
    PictureAsPdfOutlined,
    VideoFileOutlined,
    InsertDriveFileOutlined
} from '@mui/icons-material';
import type { Attachment } from '../types/chat';
import { generateAttachmentId, getAttachmentTypeFromMime, formatFileSize, validateFileSize, validateFileType } from '../utils/format';
import { SUPPORTED_FILE_TYPES, MAX_ATTACHMENT_SIZE } from '../types/chat';

interface AttachmentsProps {
    attachments: Attachment[];
    onAttachmentsChange: (attachments: Attachment[]) => void;
    maxFiles?: number;
    maxFileSize?: number;
    disabled?: boolean;
    showOnlyChips?: boolean;
    showOnlyButton?: boolean;
}

const Attachments: React.FC<AttachmentsProps> = ({
    attachments,
    onAttachmentsChange,
    maxFiles = 5,
    maxFileSize = MAX_ATTACHMENT_SIZE,
    disabled = false,
    showOnlyChips = false,
    showOnlyButton = false
}) => {
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
        const validFiles: File[] = [];
        const errors: string[] = [];

        files.forEach(file => {
            // Check file size
            if (!validateFileSize(file.size, maxFileSize)) {
                errors.push(`${file.name}: File size exceeds ${formatFileSize(maxFileSize)} limit`);
                return;
            }

            // Check file type
            if (!validateFileType(file.type, SUPPORTED_FILE_TYPES)) {
                errors.push(`${file.name}: Unsupported file type. Allowed: ${SUPPORTED_FILE_TYPES.join(', ')}`);
                return;
            }

            // Check total file count
            if (attachments.length + validFiles.length >= maxFiles) {
                errors.push(`Maximum ${maxFiles} files allowed`);
                return;
            }

            validFiles.push(file);
        });

        return { valid: validFiles, errors };
    }, [attachments.length, maxFiles, maxFileSize]);

    const processFiles = useCallback((files: File[]) => {
        const { valid, errors } = validateFiles(files);

        if (errors.length > 0) {
            setError(errors.join('; '));
            setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
        }

        if (valid.length > 0) {
            const newAttachments: Attachment[] = valid.map(file => ({
                id: generateAttachmentId(),
                name: file.name,
                size: file.size,
                type: getAttachmentTypeFromMime(file.type),
                mimeType: file.type,
                uploadedAt: new Date()
            }));

            onAttachmentsChange([...attachments, ...newAttachments]);
        }
    }, [attachments, validateFiles, onAttachmentsChange]);


    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        processFiles(files);

        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [processFiles]);

    const handleRemove = useCallback((attachmentId: string) => {
        onAttachmentsChange(attachments.filter(att => att.id !== attachmentId));
    }, [attachments, onAttachmentsChange]);

    // File type detection and icon mapping
    const getFileIcon = (mimeType: string, fileName: string) => {
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        // Check MIME type first, then fallback to extension
        if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension || '')) {
            return <ImageOutlined style={{ fontSize: '18px', color: '#374151' }} aria-label="Image file" />;
        }

        if (mimeType === 'application/pdf' || fileExtension === 'pdf') {
            return <PictureAsPdfOutlined style={{ fontSize: '18px', color: '#374151' }} aria-label="PDF file" />;
        }

        if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(fileExtension || '')) {
            return <VideoFileOutlined style={{ fontSize: '18px', color: '#374151' }} aria-label="Video file" />;
        }

        return <InsertDriveFileOutlined style={{ fontSize: '18px', color: '#374151' }} aria-label="Document file" />;
    };

    const isNearLimit = attachments.length >= maxFiles - 1;
    const isAtLimit = attachments.length >= maxFiles;

    // Show only chips (for file preview above input)
    if (showOnlyChips) {
        return (
            <Box className="w-full">
                {/* Error Messages */}
                {error && (
                    <Alert
                        severity="error"
                        icon={<ErrorOutline />}
                        className="mb-3"
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {/* Attached Files Chips */}
                <Box className="flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                        <Chip
                            key={attachment.id}
                            icon={getFileIcon(attachment.mimeType, attachment.name)}
                            label={
                                <Box className="flex flex-col items-start">
                                    <span className="text-sm font-medium">{attachment.name}</span>
                                    <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
                                </Box>
                            }
                            onDelete={() => handleRemove(attachment.id)}
                            deleteIcon={<Close />}
                            size="small"
                            disabled={disabled}
                            className="bg-gray-100 px-4 py-3 rounded-full text-sm text-gray-700 flex items-center space-x-2 file-chip hover:bg-gray-200 transition-all duration-200"
                            sx={{
                                '& .MuiChip-icon': {
                                    color: '#374151',
                                    fontSize: '18px',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                '& .MuiChip-label': {
                                    color: '#374151',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    lineHeight: 1.2,
                                },
                                '& .MuiChip-deleteIcon': {
                                    color: '#6B7280',
                                    fontSize: '16px',
                                    width: '16px',
                                    height: '16px',
                                    '&:hover': {
                                        color: '#374151',
                                    },
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>
        );
    }

    // Show only button (for inline with input)
    if (showOnlyButton) {
        return (
            <Box className="flex items-center justify-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept={SUPPORTED_FILE_TYPES.map(type => `.${type.split('/')[1]}`).join(',')}
                    disabled={disabled}
                />

                <IconButton
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    disabled={disabled}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                    sx={{
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label="Attach files"
                >
                    <AttachFile />
                </IconButton>
            </Box>
        );
    }

    // Full component (default behavior)
    return (
        <Box className="w-full">
            {/* Error Messages */}
            {error && (
                <Alert
                    severity="error"
                    icon={<ErrorOutline />}
                    className="mb-3"
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* Warning for approaching limit */}
            {isNearLimit && !isAtLimit && (
                <Alert severity="warning" className="mb-3">
                    {maxFiles - attachments.length} file{maxFiles - attachments.length === 1 ? '' : 's'} remaining
                </Alert>
            )}

            {/* Attached Files Chips */}
            {attachments.length > 0 && (
                <Box className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                        <Chip
                            key={attachment.id}
                            icon={getFileIcon(attachment.mimeType, attachment.name)}
                            label={
                                <Box className="flex flex-col items-start">
                                    <span className="text-sm font-medium">{attachment.name}</span>
                                    <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
                                </Box>
                            }
                            onDelete={() => handleRemove(attachment.id)}
                            deleteIcon={<Close />}
                            size="small"
                            disabled={disabled}
                            className="bg-gray-100 px-4 py-3 rounded-full text-sm text-gray-700 flex items-center space-x-2 file-chip hover:bg-gray-200 transition-all duration-200"
                            sx={{
                                '& .MuiChip-icon': {
                                    color: '#374151',
                                    fontSize: '18px',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                '& .MuiChip-label': {
                                    color: '#374151',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    lineHeight: 1.2,
                                },
                                '& .MuiChip-deleteIcon': {
                                    color: '#6B7280',
                                    fontSize: '16px',
                                    width: '16px',
                                    height: '16px',
                                    '&:hover': {
                                        color: '#374151',
                                    },
                                },
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* File Upload Button */}
            {!isAtLimit && (
                <Box className="flex items-center justify-center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept={SUPPORTED_FILE_TYPES.map(type => `.${type.split('/')[1]}`).join(',')}
                        disabled={disabled}
                    />

                    <IconButton
                        onClick={() => !disabled && fileInputRef.current?.click()}
                        disabled={disabled}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                        sx={{
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            transition: 'all 0.2s ease-in-out',
                        }}
                        aria-label="Attach files"
                    >
                        <AttachFile />
                    </IconButton>
                </Box>
            )}

            {/* Limit Reached Message */}
            {isAtLimit && (
                <Box className="border border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                    <Typography variant="body2" className="text-gray-600">
                        Maximum {maxFiles} files reached. Remove a file to add more.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Attachments;
