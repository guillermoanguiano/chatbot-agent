import { Card } from "@/components/ui/card";
import { Code, MessageSquare, Sparkles, Wand2 } from "lucide-react";
import type { ExamplePrompt } from "../types";

const examplePrompts: ExamplePrompt[] = [
  {
    icon: <Code className="w-4 h-4" />,
    text: "Dame una rutina de ejercicios para principiantes",
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    text: "¿Qué dieta me recomiendas para ganar masa muscular?",
  },
  {
    icon: <Wand2 className="w-4 h-4" />,
    text: "Necesito ejercicios para mejorar mi resistencia",
  },
];

interface ExamplePromptsProps {
  onPromptSelect: (text: string) => void;
}

export function ExamplePrompts({ onPromptSelect }: ExamplePromptsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
      {examplePrompts.map((prompt, index) => (
        <Card
          key={index}
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onPromptSelect(prompt.text)}
        >
          <div className="flex items-center gap-2 mb-2">
            {prompt.icon}
            <Sparkles className="w-3 h-3" />
          </div>
          <p className="text-sm text-left">{prompt.text}</p>
        </Card>
      ))}
    </div>
  );
}
