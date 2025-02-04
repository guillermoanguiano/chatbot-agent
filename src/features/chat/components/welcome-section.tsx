import { Bot } from "lucide-react";
import { ExamplePrompts } from "./example-prompts";

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
      <ExamplePrompts onPromptSelect={onPromptSelect} />
    </div>
  );
}
