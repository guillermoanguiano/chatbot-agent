import { Bot } from "lucide-react";
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

interface WelcomeSectionProps {
  onPromptSelect: (text: string) => void;
}

export function WelcomeSection({ onPromptSelect }: WelcomeSectionProps) {
  return (
    <div className="text-center space-y-6 py-8 md:py-14">
      <div className="flex justify-center">
        <div className="p-4 rounded-full ">
          <Bot className="w-12 h-12 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          ¡Bienvenido a FitCoach!
        </h1>
        <p className="text-muted-foreground text-lg">
          Tu asistente personal de nutrición y entrenamiento
        </p>
      </div>
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
    </div>
  );
}
