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
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </AppShell>
      </Router>
    </ThemeProvider>
  );
}

export default App;
