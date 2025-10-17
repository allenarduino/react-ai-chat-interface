import React, { useState, useRef, useCallback } from 'react';
import { Box, Chip, Typography, Alert, IconButton } from '@mui/material';
import { Close, CloudUpload, ErrorOutline } from '@mui/icons-material';
import type { Attachment } from '../types/chat';
import { generateAttachmentId, getAttachmentTypeFromMime, formatFileSize, validateFileSize, validateFileType } from '../utils/format';
import { SUPPORTED_FILE_TYPES, MAX_ATTACHMENT_SIZE } from '../types/chat';

interface AttachmentsProps {
    attachments: Attachment[];
    onAttachmentsChange: (attachments: Attachment[]) => void;
    maxFiles?: number;
    maxFileSize?: number;
    disabled?: boolean;
}

const Attachments: React.FC<AttachmentsProps> = ({
    attachments,
    onAttachmentsChange,
    maxFiles = 5,
    maxFileSize = MAX_ATTACHMENT_SIZE,
    disabled = false
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
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

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }, [disabled, processFiles]);

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

    const isNearLimit = attachments.length >= maxFiles - 1;
    const isAtLimit = attachments.length >= maxFiles;

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
                            label={`${attachment.name} (${formatFileSize(attachment.size)})`}
                            onDelete={() => handleRemove(attachment.id)}
                            deleteIcon={<Close />}
                            size="small"
                            disabled={disabled}
                            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                            sx={{
                                '& .MuiChip-deleteIcon': {
                                    color: '#666666',
                                    '&:hover': {
                                        color: '#333333',
                                    },
                                },
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Drag & Drop Area */}
            {!isAtLimit && (
                <Box
                    className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragOver
                            ? 'border-black bg-gray-100'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-label="Upload files by clicking or dragging and dropping"
                    onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                            e.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept={SUPPORTED_FILE_TYPES.map(type => `.${type.split('/')[1]}`).join(',')}
                        disabled={disabled}
                    />

                    <CloudUpload
                        className={`text-4xl mb-2 ${isDragOver ? 'text-black' : 'text-gray-400'}`}
                    />

                    <Typography
                        variant="body2"
                        className={`font-medium ${isDragOver ? 'text-black' : 'text-gray-600'}`}
                    >
                        {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
                    </Typography>

                    <Typography
                        variant="caption"
                        className="text-gray-500 mt-1 block"
                    >
                        Max {maxFiles} files, {formatFileSize(maxFileSize)} each
                    </Typography>

                    <Typography
                        variant="caption"
                        className="text-gray-400 mt-1 block"
                    >
                        {SUPPORTED_FILE_TYPES.join(', ')}
                    </Typography>
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
