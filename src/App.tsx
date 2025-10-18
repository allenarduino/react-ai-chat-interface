import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppShell from './components/AppShell';
import Home from './pages/Home';

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [clearConversationHandler, setClearConversationHandler] = useState<(() => void) | undefined>();

  const registerClearHandler = (handler: () => void) => {
    setClearConversationHandler(() => handler);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppShell onClearConversation={clearConversationHandler}>
          <Routes>
            <Route path="/" element={<Home onRegisterClearHandler={registerClearHandler} />} />
          </Routes>
        </AppShell>
      </Router>
    </ThemeProvider>
  );
}

export default App;
