import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Tooltip } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { ChatOptions, ToneType, ResponseLengthType, ModelType } from '../types/chat';

interface OptionsPanelProps {
    options: ChatOptions;
    onChange: (options: ChatOptions) => void;
    disabled?: boolean;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
    options,
    onChange,
    disabled = false
}) => {
    const handleToneChange = (e: SelectChangeEvent<ToneType>) => {
        onChange({ ...options, tone: e.target.value as ToneType });
    };


    const handleModelChange = (e: SelectChangeEvent<ModelType>) => {
        onChange({ ...options, model: e.target.value as ModelType });
    };

    const handleLengthSliderChange = (_e: Event, value: number | number[]) => {
        const lengthMap = [0, 1, 2, 3]; // short, medium, long, detailed
        const lengthValues: ResponseLengthType[] = ['short', 'medium', 'long', 'detailed'];
        const selectedIndex = lengthMap.indexOf(value as number);
        if (selectedIndex !== -1) {
            onChange({ ...options, responseLength: lengthValues[selectedIndex] });
        }
    };

    const getSliderValue = () => {
        const lengthMap: Record<ResponseLengthType, number> = {
            'short': 0,
            'medium': 1,
            'long': 2,
            'detailed': 3
        };
        return lengthMap[options.responseLength];
    };

    return (
        <Box className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
            <Box className="flex flex-wrap gap-6 items-center">
                {/* Tone Selection */}
                <Tooltip
                    title="Choose the conversational style for AI responses"
                    placement="top"
                    arrow
                >
                    <FormControl size="small" className="min-w-32">
                        <InputLabel id="tone-label">Tone</InputLabel>
                        <Select
                            labelId="tone-label"
                            value={options.tone}
                            onChange={handleToneChange}
                            disabled={disabled}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: '8px',
                                },
                                '& .MuiSelect-select': {
                                    color: '#333333',
                                }
                            }}
                        >
                            <MenuItem value="friendly">Friendly</MenuItem>
                            <MenuItem value="formal">Formal</MenuItem>
                            <MenuItem value="creative">Witty</MenuItem>
                        </Select>
                    </FormControl>
                </Tooltip>

                {/* Response Length Slider */}
                <Tooltip
                    title="Adjust the detail level of AI responses"
                    placement="top"
                    arrow
                >
                    <Box className="min-w-48">
                        <Typography variant="body2" className="text-gray-700 mb-2 font-medium">
                            Response Length
                        </Typography>
                        <Slider
                            value={getSliderValue()}
                            onChange={handleLengthSliderChange}
                            disabled={disabled}
                            min={0}
                            max={3}
                            step={1}
                            marks={[
                                { value: 0, label: 'Short' },
                                { value: 1, label: 'Medium' },
                                { value: 2, label: 'Long' },
                            ]}
                            sx={{
                                color: '#333333',
                                '& .MuiSlider-thumb': {
                                    backgroundColor: '#333333',
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: '#333333',
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: '#E5E5E5',
                                },
                                '& .MuiSlider-markLabel': {
                                    color: '#666666',
                                    fontSize: '0.75rem',
                                }
                            }}
                        />
                    </Box>
                </Tooltip>

                {/* Model Choice */}
                <Tooltip
                    title="Select the AI model for generating responses"
                    placement="top"
                    arrow
                >
                    <FormControl size="small" className="min-w-32">
                        <InputLabel id="model-label">Model</InputLabel>
                        <Select
                            labelId="model-label"
                            value={options.model}
                            onChange={handleModelChange}
                            disabled={disabled}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: '8px',
                                },
                                '& .MuiSelect-select': {
                                    color: '#333333',
                                }
                            }}
                        >
                            <MenuItem value="gpt-3.5-turbo">GPT-3</MenuItem>
                            <MenuItem value="gpt-4">GPT-4</MenuItem>
                            <MenuItem value="claude-3">Custom</MenuItem>
                        </Select>
                    </FormControl>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default OptionsPanel;
