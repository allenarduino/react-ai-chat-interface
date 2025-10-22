import React, { useCallback } from 'react';
import { Box, IconButton, Typography, Slider } from '@mui/material';
import { Close } from '@mui/icons-material';
import { CustomDropdown, type Option } from './CustomDropdown';
import type { ChatOptions } from '../types/chat';

interface OptionsPanelProps {
    options: ChatOptions;
    onOptionsChange: (options: ChatOptions) => void;
    onClose: () => void;
    isOpen: boolean;
}

// Memoize options outside component to prevent recreation
const TONE_OPTIONS: Option[] = [
    { id: '1', value: 'professional', name: 'Professional' },
    { id: '2', value: 'friendly', name: 'Friendly' },
    { id: '3', value: 'formal', name: 'Formal' },
    { id: '4', value: 'creative', name: 'Creative' },
];

const MODEL_OPTIONS: Option[] = [
    { id: '1', value: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: '2', value: 'gpt-4', name: 'GPT-4' },
    { id: '3', value: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
];

const OptionsPanel: React.FC<OptionsPanelProps> = ({
    options,
    onOptionsChange,
    onClose,
    isOpen
}) => {
    // Memoize handlers to prevent recreation on every render
    // Must be called before any conditional returns (React Hooks rules)
    const handleToneChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onOptionsChange({
            ...options,
            tone: event.target.value as 'professional' | 'friendly' | 'formal' | 'creative'
        });
    }, [options, onOptionsChange]);

    const handleLengthChange = useCallback((_: Event, newValue: number | number[]) => {
        const lengthValue = newValue === 1 ? 'short' : newValue === 2 ? 'medium' : 'long';
        onOptionsChange({
            ...options,
            responseLength: lengthValue as 'short' | 'medium' | 'long'
        });
    }, [options, onOptionsChange]);

    const handleModelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onOptionsChange({
            ...options,
            model: event.target.value as 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3.5-sonnet'
        });
    }, [options, onOptionsChange]);

    if (!isOpen) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                right: '24px',
                bottom: '100%',
                marginBottom: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '16px',
                width: '288px',
                zIndex: 10001,
                overflow: 'visible',
            }}
        >
            {/* Header */}
            <Box className="flex items-center justify-between mb-3">
                <Typography variant="subtitle2" className="text-sm font-semibold text-gray-800">
                    Response Settings
                </Typography>
                <IconButton
                    size="small"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                    sx={{ padding: '4px' }}
                >
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            {/* Controls */}
            <Box className="space-y-4">
                {/* Tone */}
                <Box className="space-y-2">
                    <CustomDropdown
                        label="Tone"
                        options={TONE_OPTIONS}
                        value={options.tone}
                        onChange={handleToneChange}
                    />
                </Box>

                {/* Response Length */}
                <Box className="space-y-2">
                    <Typography variant="caption" className="text-xs font-medium text-gray-700 block">
                        Response Length
                    </Typography>
                    <Box className="px-1">
                        <Slider
                            value={options.responseLength === 'short' ? 1 : options.responseLength === 'medium' ? 2 : 3}
                            onChange={handleLengthChange}
                            min={1}
                            max={3}
                            step={1}
                            marks={[
                                { value: 1, label: 'Short' },
                                { value: 2, label: 'Medium' },
                                { value: 3, label: 'Long' },
                            ]}
                            sx={{
                                color: '#6B7280',
                                '& .MuiSlider-thumb': {
                                    backgroundColor: '#374151',
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: '#6B7280',
                                },
                                '& .MuiSlider-mark': {
                                    backgroundColor: '#9CA3AF',
                                },
                                '& .MuiSlider-markLabel': {
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                },
                            }}
                        />
                    </Box>
                    <Typography variant="caption" className="text-xs text-gray-600 text-center block">
                        {options.responseLength === 'short' ? 'Short' : options.responseLength === 'medium' ? 'Medium' : 'Long'}
                    </Typography>
                </Box>

                {/* Model Choice */}
                <Box className="space-y-2">
                    <CustomDropdown
                        label="Model Choice"
                        options={MODEL_OPTIONS}
                        value={options.model}
                        onChange={handleModelChange}
                    />
                </Box>
            </Box>
        </Box>
    );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(OptionsPanel);