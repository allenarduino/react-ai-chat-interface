import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                  React Chat Interface
                </h1>
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                      Welcome to your React + TypeScript + Tailwind + MUI project!
                    </h2>
                    <p className="text-gray-600 mb-4">
                      This project is set up with:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Vite for fast development and building</li>
                      <li>React 18 with TypeScript</li>
                      <li>Tailwind CSS for utility-first styling</li>
                      <li>Material-UI for component library</li>
                      <li>React Router for navigation</li>
                      <li>Framer Motion for animations</li>
                      <li>React Markdown for markdown rendering</li>
                      <li>Husky, Prettier, and ESLint for code quality</li>
                    </ul>
                    <div className="mt-6">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
