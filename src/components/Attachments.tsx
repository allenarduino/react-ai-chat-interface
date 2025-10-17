import React, { useState, useRef, useCallback } from 'react';
import { Box, Chip, Typography, Alert, IconButton, Tooltip } from '@mui/material';
import {
    Close,
    AttachFile,
    ErrorOutline,
    ImageOutlined,
    PictureAsPdfOutlined,
    VideoFileOutlined,
    InsertDriveFileOutlined,
    AudioFileOutlined,
    DescriptionOutlined,
    CodeOutlined,
    ArchiveOutlined,
    TableChartOutlined,
    SlideshowOutlined
} from '@mui/icons-material';
import type { Attachment } from '../types/chat';
import { generateAttachmentId, getAttachmentTypeFromMime, formatFileSize, validateFileSize, validateFileType } from '../utils/format';
import { SUPPORTED_FILE_TYPES, MAX_ATTACHMENT_SIZE } from '../types/chat';

interface AttachmentsProps {
    attachments: Attachment[];
    onAttachmentsChange: (attachments: Attachment[] | ((prev: Attachment[]) => Attachment[])) => void;
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
    const buttonFileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
        const validFiles: File[] = [];
        const errors: string[] = [];


        // Check if adding all files would exceed the limit
        if (attachments.length + files.length > maxFiles) {
            const errorMsg = `Cannot add ${files.length} files. Only ${maxFiles - attachments.length} more files allowed.`;
            errors.push(errorMsg);
            return { valid: [], errors };
        }

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

            validFiles.push(file);
        });

        return { valid: validFiles, errors };
    }, [attachments.length, maxFiles, maxFileSize]);

    const processFiles = useCallback((files: File[]) => {
        const { valid, errors } = validateFiles(files);


        if (errors.length > 0) {
            setError(errors.join('; '));
            setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
            return; // Don't process any files if there are errors
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

            onAttachmentsChange((prevAttachments: Attachment[]) => {
                const updated = [...prevAttachments, ...newAttachments];
                return updated;
            });
        }
    }, [validateFiles, onAttachmentsChange]);


    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Simple check: if more than 5 files, don't attach any files
        if (attachments.length >= 5) {
            setError(`Maximum 5 files already attached. Remove a file to add more.`);
            setTimeout(() => setError(null), 5000);
            e.target.value = '';
            return;
        }

        processFiles(files);

        // Reset input value to allow selecting the same file again
        e.target.value = '';
    }, [processFiles, attachments.length]);

    const handleRemove = useCallback((attachmentId: string) => {
        onAttachmentsChange(attachments.filter(att => att.id !== attachmentId));
    }, [attachments, onAttachmentsChange]);

    // File type detection and icon mapping
    const getFileIcon = (mimeType: string, fileName: string) => {
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        // Images
        if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'].includes(fileExtension || '')) {
            return <ImageOutlined style={{ fontSize: '18px', color: '#3B82F6' }} aria-label="Image file" />;
        }

        // PDF
        if (mimeType === 'application/pdf' || fileExtension === 'pdf') {
            return <PictureAsPdfOutlined style={{ fontSize: '18px', color: '#EF4444' }} aria-label="PDF file" />;
        }

        // Videos
        if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'quicktime'].includes(fileExtension || '')) {
            return <VideoFileOutlined style={{ fontSize: '18px', color: '#8B5CF6' }} aria-label="Video file" />;
        }

        // Audio
        if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(fileExtension || '')) {
            return <AudioFileOutlined style={{ fontSize: '18px', color: '#10B981' }} aria-label="Audio file" />;
        }

        // Word documents
        if (mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            ['doc', 'docx'].includes(fileExtension || '')) {
            return <DescriptionOutlined style={{ fontSize: '18px', color: '#2563EB' }} aria-label="Word document" />;
        }

        // Excel spreadsheets
        if (mimeType === 'application/vnd.ms-excel' || mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            ['xls', 'xlsx'].includes(fileExtension || '')) {
            return <TableChartOutlined style={{ fontSize: '18px', color: '#059669' }} aria-label="Excel spreadsheet" />;
        }

        // PowerPoint presentations
        if (mimeType === 'application/vnd.ms-powerpoint' || mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            ['ppt', 'pptx'].includes(fileExtension || '')) {
            return <SlideshowOutlined style={{ fontSize: '18px', color: '#DC2626' }} aria-label="PowerPoint presentation" />;
        }

        // Code files
        if (mimeType.startsWith('text/') && ['js', 'ts', 'jsx', 'tsx', 'css', 'html', 'json', 'xml', 'py', 'java', 'c', 'cpp', 'md'].includes(fileExtension || '')) {
            return <CodeOutlined style={{ fontSize: '18px', color: '#7C3AED' }} aria-label="Code file" />;
        }

        // Archives
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z') || mimeType.includes('tar') || mimeType.includes('gzip') ||
            ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension || '')) {
            return <ArchiveOutlined style={{ fontSize: '18px', color: '#F59E0B' }} aria-label="Archive file" />;
        }

        // Default document
        return <InsertDriveFileOutlined style={{ fontSize: '18px', color: '#6B7280' }} aria-label="Document file" />;
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
                                    <span className="font-medium">{attachment.name}</span>
                                    <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
                                </Box>
                            }
                            onDelete={() => handleRemove(attachment.id)}
                            deleteIcon={<Close />}
                            disabled={disabled}
                            sx={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: '9999px',
                                padding: '8px 12px',
                                height: 'auto',
                                minHeight: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                '&:hover': {
                                    backgroundColor: '#E5E7EB',
                                },
                                '& .MuiChip-icon': {
                                    color: '#374151',
                                    fontSize: '18px',
                                    width: '18px',
                                    height: '18px',
                                    marginLeft: 0,
                                    marginRight: 0,
                                },
                                '& .MuiChip-label': {
                                    padding: 0,
                                    color: '#374151',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.25,
                                    overflow: 'visible',
                                    textOverflow: 'clip',
                                },
                                '& .MuiChip-deleteIcon': {
                                    color: '#6B7280',
                                    fontSize: '18px',
                                    width: '18px',
                                    height: '18px',
                                    margin: 0,
                                    marginLeft: '4px',
                                    '&:hover': {
                                        color: '#374151',
                                    },
                                },
                            }}
                        />
                    ))}
                </Box>

                {/* File Summary */}
                {attachments.length > 0 && (
                    <Box className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">{attachments.length}</span>/{maxFiles} files attached (max {maxFiles} files) • Total: {formatFileSize(attachments.reduce((total, file) => total + file.size, 0))}
                    </Box>
                )}
            </Box>
        );
    }

    // Show only button (for inline with input)
    if (showOnlyButton) {
        const isAtLimit = attachments.length >= maxFiles;
        const canUploadMore = attachments.length < maxFiles;

        return (
            <Box className="flex items-center justify-center">
                <input
                    ref={buttonFileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rtf,.md,.mp3,.wav,.ogg,.aac,.flac,.m4a,.mp4,.webm,.avi,.mov,.wmv,.flv,.mkv,.zip,.rar,.7z,.tar,.gz,.js,.ts,.jsx,.tsx,.css,.html,.json,.xml,.py,.java,.c,.cpp"
                    disabled={disabled || isAtLimit}
                />

                <Tooltip
                    title={
                        isAtLimit
                            ? "Maximum file upload limit (5 files) reached"
                            : "Attach files"
                    }
                    arrow
                >
                    <span>
                        <IconButton
                            onClick={() => !disabled && canUploadMore && buttonFileInputRef.current?.click()}
                            disabled={disabled || isAtLimit}
                            className={`${isAtLimit
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                                }`}
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
                    </span>
                </Tooltip>
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
                <Box className="mb-3">
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
                                className="bg-gray-100 px-4 py-4 rounded-full text-sm text-gray-700 flex items-center space-x-2 file-chip hover:bg-gray-200 transition-all duration-200 min-h-[48px]"
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
                                        marginLeft: '8px',
                                        marginRight: '8px',
                                        '&:hover': {
                                            color: '#374151',
                                        },
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    {/* File Summary */}
                    <Box className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">{attachments.length}</span>/{maxFiles} files attached (max {maxFiles} files) • Total: {formatFileSize(attachments.reduce((total, file) => total + file.size, 0))}
                    </Box>
                </Box>
            )}

            {/* File Upload Button */}
            {attachments.length < 5 && (
                <Box className="flex items-center justify-center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rtf,.md,.mp3,.wav,.ogg,.aac,.flac,.m4a,.mp4,.webm,.avi,.mov,.wmv,.flv,.mkv,.zip,.rar,.7z,.tar,.gz,.js,.ts,.jsx,.tsx,.css,.html,.json,.xml,.py,.java,.c,.cpp"
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
