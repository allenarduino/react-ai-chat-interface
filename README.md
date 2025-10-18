# React Chat Interface

A modern, fully-featured AI chat interface built with React, TypeScript, Material-UI, and Tailwind CSS. Features include file attachments, typing indicators, persistent conversations, and customizable response options.

## Demo

**[Live Demo](https://react-ai-chat-interface.vercel.app/)** - Try it now!

![React Chat Interface Demo](https://github.com/allenarduino/react-ai-chat-interface/blob/main/demo/demo.gif?raw=true)

*Experience the chat interface with smooth animations, file attachments, and customizable AI response options*

## Setup and Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# Navigate to http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

## Features

- **Real-time Chat**: Send and receive messages with typing indicators
- **File Attachments**: Upload up to 5 files (10MB each) - supports images, documents, videos, and more
- **Response Options**: Customize AI responses with tone, length, and model selection
- **Persistent State**: Conversations automatically save to localStorage and survive page reloads
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Smooth Animations**: Polished UI with Framer Motion transitions
- **Markdown Support**: Rich text formatting in AI responses with code blocks, lists, and links

## Response Options

Click the settings icon in the composer to customize AI responses:

### **Tone**
Controls the conversational style of AI responses:
- **Professional**: Formal, business-appropriate language
- **Friendly**: Warm, approachable tone with casual language
- **Formal**: Structured, academic-style responses
- **Creative**: Imaginative and expressive language

### **Response Length**
Determines the verbosity of AI replies:
- **Short**: Concise, to-the-point answers
- **Medium**: Balanced responses with moderate detail
- **Long**: Comprehensive, detailed explanations

### **Model Choice**
Selects the AI model (simulated in this demo):
- **GPT-3.5 Turbo**: Fast, efficient responses
- **GPT-4**: More detailed and nuanced answers
- **Claude 3.5 Sonnet**: Comprehensive, analytical responses

**Note**: Options are stored with each message, so changing settings only affects new messages, not previous ones.

## Tech Stack

- **React 18** - UI library with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **React Markdown** - Markdown rendering
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Husky** - Git hooks for code quality
- **Prettier** - Code formatting
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── __tests__/      # Component unit tests
│   ├── Attachments.tsx # File attachment handling
│   ├── Composer.tsx    # Message input with options
│   ├── MessageBubble.tsx # Individual message display
│   ├── MessageList.tsx # Message list container
│   ├── OptionsPanel.tsx # Response settings panel
│   ├── CustomDropdown.tsx # Custom select component
│   └── TypingIndicator.tsx # AI typing animation
├── pages/              # Page components
│   └── Home.tsx       # Main chat page
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # localStorage persistence
├── utils/              # Utility functions
│   ├── agent.ts       # AI response generation
│   └── format.ts      # Formatting utilities
├── types/              # TypeScript type definitions
│   └── chat.ts        # Chat-related types
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## How Response Options Affect Replies

The response options panel allows you to customize how the AI responds to your messages. Here's how each option impacts the generated replies:

### **Tone → Language Style**
- **Professional**: Uses formal language, industry-standard terminology, and structured responses
- **Friendly**: Casual, conversational tone with personal touches and emojis
- **Formal**: Academic style with precise language and proper citations format
- **Creative**: Expressive language, metaphors, and imaginative examples

### **Response Length → Detail Level**
- **Short**: Brief answers with minimal elaboration (50-100 words)
- **Medium**: Balanced explanations with key points covered (150-300 words)
- **Long**: Comprehensive responses with examples and detailed breakdowns (300-500 words)

### **Model → Response Characteristics**
- **GPT-3.5 Turbo**: Simpler explanations with 1 example
- **GPT-4**: More detailed analysis with 2 examples
- **Claude 3.5 Sonnet**: Comprehensive, analytical responses with 3 examples

**Important**: Options are saved per-message, meaning each AI response displays the settings that were active when it was generated. Changing options only affects future messages.

## Trade-offs and Design Decisions

### **What Works Well**
- **LocalStorage Persistence**: Conversations survive page reloads and work across browser tabs
- **Functional State Updates**: Prevents stale closure bugs when adding messages rapidly
- **Date Serialization**: Custom JSON parser handles Date objects correctly in localStorage
- **Responsive Design**: Mobile-first approach with proper touch targets and spacing
- **Component Separation**: Clean architecture with reusable, testable components
- **Type Safety**: Full TypeScript coverage prevents runtime errors

### **Known Limitations**
- **Simulated AI**: Responses are template-based, not real AI (uses deterministic reply generation)
- **LocalStorage Size**: Browser limits to ~5-10MB (could hit limits with many attachments)
- **File Storage**: Attachments stored as base64 in localStorage (increases size ~33%)
- **No Backend**: All state is client-side only, not synced across devices
- **Single Conversation**: No support for multiple chat threads or conversation history

### **TODOs / Future Improvements**
- **Real AI Integration**: Connect to actual LLM API (OpenAI, Anthropic, etc.)
- **Backend Integration**: Add server-side storage and authentication
- **Export Conversations**: Download chat history as JSON/PDF
- **Search Functionality**: Search through message history
- **Message Editing**: Edit or delete sent messages
- **Conversation Management**: Multiple chat threads with switching
- **File Preview**: Inline preview for images and documents
- **Voice Input**: Speech-to-text for message composition
- **Accessibility**: Enhanced keyboard navigation and screen reader support
- **Dark Mode**: Theme toggle for dark/light modes

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage**:
- Attachments component
- CustomDropdown component  
- OptionsPanel component
- useLocalStorage hook (16 comprehensive tests)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

