import { type ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

interface AppShellProps {
    children: ReactNode;
    onClearConversation?: () => void;
}

function AppShell({ children, onClearConversation }: AppShellProps) {
    return (
        <Box className="h-screen flex flex-col bg-gray-50">
            {/* Fixed Header */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E5E5E5',
                    color: '#333333',
                    zIndex: 1000,
                    width: '100%',
                    '@media (min-width: 1024px)': {
                        width: '68%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }
                }}
            >
                <Toolbar className="px-4 py-3">
                    {/* AI Avatar and Name */}
                    <Box className="flex items-center space-x-3 flex-1">
                        {/* AI Avatar */}
                        <Box
                            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                            sx={{ minWidth: '40px', minHeight: '40px' }}
                        >
                            <img
                                src="/images/AI-avatar.jpg"
                                alt="AI Avatar"
                                className="w-full h-full object-cover"
                            />
                        </Box>

                        {/* Name and Status */}
                        <Box className="flex flex-col">
                            <Typography
                                variant="h6"
                                component="h1"
                                className="font-bold text-gray-800"
                                sx={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.2 }}
                            >
                                AI Chatbot
                            </Typography>
                            <Box className="flex items-center space-x-1">
                                <Box className="w-2 h-2 bg-green-500 rounded-full"></Box>
                                <Typography
                                    variant="caption"
                                    className="text-gray-600"
                                    sx={{ fontSize: '0.75rem' }}
                                >
                                    Online
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Clear Conversation Button */}
                    {onClearConversation && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={onClearConversation}
                            sx={{
                                marginRight: 2,
                                backgroundColor: 'transparent',
                                borderColor: '#000000',
                                borderWidth: '1px',
                                color: '#000000',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                padding: { xs: '4px 8px', sm: '6px 16px' },
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#F3F4F6',
                                    borderColor: '#000000',
                                    borderWidth: '2px',
                                },
                            }}
                        >
                            <span className="hidden sm:inline">Clear Conversation</span>
                            <span className="sm:hidden">Clear</span>
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Main content area with top padding to account for fixed header */}
            <Box className="flex-1 flex justify-center items-start p-4 pt-20 bg-white">
                <Box className="w-full max-w-6xl bg-white  rounded-lg shadow-sm h-full flex flex-col">
                    {/* Main content area */}
                    <Box className="flex-1 flex flex-col overflow-hidden">
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AppShell;
