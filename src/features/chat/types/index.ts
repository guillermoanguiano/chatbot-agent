export interface ExamplePrompt {
    icon: React.ReactNode;
    text: string;
}

export interface ChatMessageProps {
    id: string;
    content: string;
    role: 'user' | 'assistant';
}