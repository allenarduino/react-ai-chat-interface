import type { Message, ChatOptions, Attachment } from '../types/chat';
import { generateMessageId } from './format';

// Simple hash function for deterministic selection
const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};

// Deterministic reply styles based on hash
const REPLY_STYLES = [
    'summary',
    'bullets',
    'steps',
    'short_quip',
    'definition_example',
    'qa'
] as const;

type ReplyStyle = typeof REPLY_STYLES[number];

type ToneTemplate = {
    greeting: string;
    connector: string;
    enthusiasm: string;
    closing: string;
};

type ModelCharacteristics = {
    complexity: string;
    examples: number;
};

// Tone-based response templates
const TONE_TEMPLATES = {
    friendly: {
        greeting: "Hey there!",
        connector: "So",
        enthusiasm: "awesome",
        closing: "Hope that helps! 😊"
    },
    formal: {
        greeting: "Thank you for your inquiry.",
        connector: "Regarding your question",
        enthusiasm: "excellent",
        closing: "Please let me know if you need further assistance."
    },
    creative: {
        greeting: "What an interesting question!",
        connector: "Let me paint you a picture",
        enthusiasm: "brilliant",
        closing: "That's my creative take on it! ✨"
    },
    professional: {
        greeting: "Thank you for reaching out.",
        connector: "In response to your inquiry",
        enthusiasm: "outstanding",
        closing: "I'm here to assist with any follow-up questions."
    },
    casual: {
        greeting: "Hey!",
        connector: "So about",
        enthusiasm: "cool",
        closing: "Let me know if you need anything else!"
    }
};

// Length multipliers for different response lengths
const LENGTH_MULTIPLIERS = {
    short: 0.5,
    medium: 1.0,
    long: 1.8,
    detailed: 2.5
};

// Model-specific response characteristics
const MODEL_CHARACTERISTICS = {
    'gpt-3.5-turbo': { complexity: 'simple', examples: 1 },
    'gpt-4': { complexity: 'detailed', examples: 2 },
    'claude-3': { complexity: 'analytical', examples: 1 },
    'claude-3.5': { complexity: 'comprehensive', examples: 3 },
    'claude-3.5-sonnet': { complexity: 'comprehensive', examples: 3 },
    'gemini-pro': { complexity: 'creative', examples: 2 }
};

const generateAgentReply = (
    userText: string,
    options: ChatOptions,
    attachments: Attachment[]
): Message => {
    // Create deterministic seed from user text + options
    const seed = `${userText}-${options.tone}-${options.responseLength}-${options.model}`;
    const hash = hashString(seed);

    // Select reply style deterministically
    const styleIndex = hash % REPLY_STYLES.length;
    const style: ReplyStyle = REPLY_STYLES[styleIndex];

    const tone = TONE_TEMPLATES[options.tone] || TONE_TEMPLATES.friendly;
    const lengthMultiplier = LENGTH_MULTIPLIERS[options.responseLength] || 1.0;
    const modelChar = MODEL_CHARACTERISTICS[options.model] || MODEL_CHARACTERISTICS['gpt-3.5-turbo'];

    // Generate attachment mention if present
    const attachmentMention = attachments.length > 0
        ? `I can see you've attached ${attachments.length} file${attachments.length > 1 ? 's' : ''} (${attachments.map(a => a.name).join(', ')}). `
        : '';

    let replyText = '';

    switch (style) {
        case 'summary':
            replyText = generateSummaryReply(userText, tone, lengthMultiplier, modelChar, attachmentMention);
            break;
        case 'bullets':
            replyText = generateBulletReply(userText, tone, lengthMultiplier, modelChar, attachmentMention);
            break;
        case 'steps':
            replyText = generateStepsReply(userText, tone, lengthMultiplier, modelChar, attachmentMention);
            break;
        case 'short_quip':
            replyText = generateShortQuipReply(userText, tone, lengthMultiplier, modelChar, attachmentMention);
            break;
        case 'definition_example':
            replyText = generateDefinitionExampleReply(userText, tone, lengthMultiplier, modelChar, attachmentMention);
            break;
        case 'qa':
            replyText = generateQAReply(userText, tone, lengthMultiplier, modelChar, attachmentMention);
            break;
    }

    return {
        id: generateMessageId(),
        text: replyText,
        sender: 'agent',
        timestamp: new Date(),
        attachments: [],
        status: 'delivered'
    };
};

const generateSummaryReply = (
    userText: string,
    tone: ToneTemplate,
    lengthMultiplier: number,
    modelChar: ModelCharacteristics,
    attachmentMention: string
): string => {
    const baseLength = Math.floor(50 * lengthMultiplier);
    const complexity = modelChar.complexity === 'detailed' ? 'comprehensive' : 'concise';

    return `${tone.greeting} ${attachmentMention}${tone.connector} "${userText}", here's a ${complexity} summary:

${userText.toLowerCase().includes('help') ?
            `I'd be happy to help you with that! Based on your question, here are the key points you should know.` :
            `Let me break this down for you in a clear, organized way.`
        }

The main concept involves understanding the core principles and applying them effectively. ${baseLength > 100 ? 'There are several important aspects to consider, each building upon the previous one.' : ''}

${tone.closing}`;
};

const generateBulletReply = (
    userText: string,
    tone: ToneTemplate,
    lengthMultiplier: number,
    modelChar: ModelCharacteristics,
    attachmentMention: string
): string => {
    const bulletCount = Math.floor(3 + (lengthMultiplier * 2));
    const maxBullets = Math.min(bulletCount, 3 + modelChar.examples);

    return `${tone.greeting} ${attachmentMention}Here are the key points about "${userText}":

• **Primary consideration**: This is the most important aspect to understand
• **Secondary factors**: These elements support the main concept
• **Implementation details**: How to actually apply this knowledge
${maxBullets > 3 ? '• **Advanced concepts**: Deeper insights for better understanding\n• **Common pitfalls**: Things to avoid when working with this\n• **Best practices**: Recommended approaches for success' : ''}

${tone.closing}`;
};

const generateStepsReply = (
    userText: string,
    tone: ToneTemplate,
    lengthMultiplier: number,
    modelChar: ModelCharacteristics,
    attachmentMention: string
): string => {
    const stepCount = Math.floor(3 + lengthMultiplier);
    const maxSteps = Math.min(stepCount, 3 + modelChar.examples);

    return `${tone.greeting} ${attachmentMention}Let me walk you through "${userText}" step by step:

**Step 1: Initial Setup**
Start by understanding the basic requirements and context for ${userText}.

**Step 2: Core Implementation** 
Apply the main concepts and build the foundation for your ${userText} approach.

**Step 3: Refinement**
Polish and optimize your ${userText} implementation.
${maxSteps > 3 ? `\n**Step 4: Advanced Features**
Add sophisticated elements for better ${userText} results.

**Step 5: Testing & Validation**
Ensure your ${userText} solution works as expected.` : ''}

${tone.closing}`;
};

const generateShortQuipReply = (
    userText: string,
    tone: ToneTemplate,
    lengthMultiplier: number,
    modelChar: ModelCharacteristics,
    attachmentMention: string
): string => {
    const quips = [
        `That's a ${tone.enthusiasm} question! ${attachmentMention}The short answer: it depends on your specific needs.`,
        `Great question! ${attachmentMention}In a nutshell: focus on the fundamentals first.`,
        `Interesting! ${attachmentMention}My take: start simple, then iterate.`,
        `Love this! ${attachmentMention}Quick answer: yes, but with some caveats.`
    ];

    const hash = hashString(userText);
    const maxQuips = Math.min(quips.length, Math.floor(2 + modelChar.examples + lengthMultiplier));
    const quipIndex = hash % maxQuips;

    return quips[quipIndex];
};

const generateDefinitionExampleReply = (
    userText: string,
    tone: ToneTemplate,
    lengthMultiplier: number,
    modelChar: ModelCharacteristics,
    attachmentMention: string
): string => {
    const exampleCount = Math.min(modelChar.examples, Math.floor(modelChar.examples * lengthMultiplier));

    return `${tone.greeting} ${attachmentMention}Let me define this clearly:

**Definition**: ${userText} refers to a systematic approach that combines multiple elements to achieve a desired outcome.

**Key Characteristics**:
- Structured methodology
- Clear objectives
- Measurable results

**Examples**:
${exampleCount >= 1 ? '1. **Basic Example**: A simple implementation that demonstrates core concepts\n' : ''}${exampleCount >= 2 ? '2. **Intermediate Example**: A more complex scenario showing advanced features\n' : ''}${exampleCount >= 3 ? '3. **Advanced Example**: A sophisticated use case with multiple components\n' : ''}

${tone.closing}`;
};

const generateQAReply = (
    userText: string,
    tone: ToneTemplate,
    lengthMultiplier: number,
    modelChar: ModelCharacteristics,
    attachmentMention: string
): string => {
    const qaCount = Math.min(4, Math.floor(2 + modelChar.examples + lengthMultiplier));
    const qaPairs = [
        { q: "What exactly are you asking about?", a: `Based on "${userText}", you're looking for guidance on a specific topic or problem.` },
        { q: "What's the best approach?", a: "The optimal solution depends on your specific requirements and constraints." },
        { q: "How do you get started?", a: "Begin with the fundamentals, then gradually build complexity as needed." },
        { q: "What should you avoid?", a: "Common mistakes include overcomplicating things initially and not testing thoroughly." }
    ];

    const qaText = qaPairs.slice(0, qaCount).map(pair =>
        `**Q: ${pair.q}**\nA: ${pair.a}`
    ).join('\n\n');

    return `${tone.greeting} ${attachmentMention}Let me address your question systematically:

${qaText}

${tone.closing}`;
};

// Simulate typing delay
export const simulateTypingDelay = (): Promise<void> => {
    const delay = 300 + Math.random() * 500; // 300-800ms
    return new Promise(resolve => setTimeout(resolve, delay));
};

export { generateAgentReply };

// Sample outputs for testing
export const sampleOutputs = {
    'help with react': {
        input: 'help with react',
        options: { tone: 'friendly' as const, responseLength: 'medium' as const, model: 'gpt-4' as const },
        attachments: [],
        expectedStyles: ['summary', 'bullets', 'steps', 'short_quip', 'definition_example', 'qa']
    },
    'what is typescript': {
        input: 'what is typescript',
        options: { tone: 'formal' as const, responseLength: 'long' as const, model: 'claude-3' as const },
        attachments: [{ id: '1', name: 'code.ts', size: 1024, type: 'other', mimeType: 'text/typescript', uploadedAt: new Date() }],
        expectedStyles: ['summary', 'bullets', 'steps', 'short_quip', 'definition_example', 'qa']
    }
};
