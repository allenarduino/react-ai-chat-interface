import React, { type ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface AppShellProps {
    children: ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
    return (
        <Box className="h-screen flex flex-col bg-gray-50">
            {/* Centered container with 80% width and gray border */}
            <Box className="flex-1 flex justify-center items-start p-4">
                <Box className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
                    {/* Header */}
                    <AppBar
                        position="static"
                        elevation={0}
                        sx={{
                            backgroundColor: '#FFFFFF',
                            borderBottom: '1px solid #E5E5E5',
                            color: '#333333',
                            borderRadius: '8px 8px 0 0'
                        }}
                    >
                        <Toolbar className="px-4 py-3">
                            <Typography
                                variant="h5"
                                component="h1"
                                className="font-bold text-gray-800 flex-1"
                                sx={{ fontWeight: 700 }}
                            >
                                AI Chat Interface
                            </Typography>

                            {/* Mode indicator and keyboard shortcut hint */}
                            <Box className="flex items-center space-x-2">
                                <Box className="flex items-center space-x-1 text-sm text-gray-500">
                                    <KeyboardIcon fontSize="small" />
                                    <span>Press / to focus</span>
                                </Box>
                                <Box className="w-2 h-2 bg-green-500 rounded-full"></Box>
                                <span className="text-sm text-gray-600">Online</span>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    {/* Main content area */}
                    <Box className="flex-1 flex flex-col overflow-hidden">
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AppShell;
