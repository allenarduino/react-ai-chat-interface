# React Chat Interface

A modern React + TypeScript project scaffold with Tailwind CSS, Material-UI, and essential development tools.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
npm run make:dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** - UI library with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **React Markdown** - Markdown rendering
- **Husky** - Git hooks for code quality
- **Prettier** - Code formatting
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── styles/        # Additional styles
├── App.tsx        # Main app component
├── main.tsx       # App entry point
└── index.css      # Global styles with Tailwind
```

## Styling

This project uses Tailwind CSS for utility-first styling and Material-UI for components. Both work together seamlessly:

- Tailwind for layout, spacing, colors, and responsive design
- Material-UI for complex components like dialogs, forms, and navigation

## Development Tools

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Automatic code formatting
- **Husky** - Git hooks for pre-commit checks
- **TypeScript** - Type safety and better developer experience

## Available Scripts

- `npm run dev` - Start development server
- `npm run make:dev` - Alias for dev command
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Dependencies

### Production
- `react` & `react-dom` - React library
- `@mui/material` & `@mui/icons-material` - Material-UI components
- `react-router-dom` - Client-side routing
- `framer-motion` - Animation library
- `react-markdown` - Markdown rendering
- `@emotion/react` & `@emotion/styled` - CSS-in-JS (required by MUI)

### Development
- `vite` - Build tool and dev server
- `typescript` - TypeScript support
- `tailwindcss` - CSS framework
- `eslint` - Code linting
- `prettier` - Code formatting
- `husky` - Git hooks

## Next Steps

1. Create your first component in `src/components/`
2. Add new pages in `src/pages/`
3. Create custom hooks in `src/hooks/`
4. Add utility functions in `src/utils/`
5. Customize the Material-UI theme in `src/App.tsx`
6. Configure Tailwind in `tailwind.config.js`

