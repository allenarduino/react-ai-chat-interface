import React from 'react';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import type { ChangeEvent } from 'react';

export type Option = {
    id: string;
    value: string;
    name: string;
};

export interface CustomDropdownProps extends Omit<TextFieldProps, 'helperText' | 'value' | 'onChange'> {
    label: string;
    options: Option[];
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    helperText,
    error = false,
    disabled = false,
    className = "",
    ...props
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
                variant="caption"
                sx={{
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '4px'
                }}
            >
                {label}
            </Typography>
            <TextField
                className={className}
                variant="outlined"
                select
                fullWidth
                size="small"
                disabled={disabled}
                error={error}
                value={value}
                onChange={onChange}
                InputProps={{
                    className: "CustomDropdownInput",
                }}
                SelectProps={{
                    MenuProps: {
                        className: "CustomDropdownMenu",
                        disablePortal: true,
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                                zIndex: 10002,
                                position: 'absolute',
                            },
                        },
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                        },
                    },
                    renderValue: (val: unknown) => (
                        <div
                            className="CustomDropdownDisplayValue"
                            style={{
                                color: disabled ? "rgb(156, 163, 175)" : "rgb(55, 65, 81)",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                            }}
                        >
                            {options.find(opt => opt.value === (val as string))?.name || ''}
                        </div>
                    ),
                    autoWidth: false,
                    IconComponent: disabled ? () => null : undefined,
                }}
                helperText={helperText || " "}
                FormHelperTextProps={{ component: "div" }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        '& fieldset': {
                            borderColor: error ? '#ef4444' : '#E5E7EB',
                            transition: 'border-color 0.2s ease-in-out',
                        },
                        '&:hover fieldset': {
                            borderColor: error ? '#ef4444' : '#D1D5DB',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: error ? '#ef4444' : '#9CA3AF',
                            boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 0 0 2px rgba(156, 163, 175, 0.2)',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#333333',
                        '&::placeholder': {
                            color: '#999999',
                            opacity: 1,
                        },
                    },
                    '& .MuiFormHelperText-root': {
                        color: error ? '#ef4444' : '#6B7280',
                        fontSize: '11px',
                        marginTop: '4px',
                    },
                }}
                {...props}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.value}
                        className="CustomDropdownMenuItem"
                        sx={{
                            fontSize: '14px',
                            color: '#374151',
                            '&:hover': {
                                backgroundColor: '#F3F4F6',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#E5E7EB',
                                '&:hover': {
                                    backgroundColor: '#D1D5DB',
                                },
                            },
                        }}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};
