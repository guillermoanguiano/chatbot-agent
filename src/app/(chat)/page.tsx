"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, MessageSquare, Code, Wand2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Aquí iría la lógica para enviar el mensaje
    setMessage("");
  };

  const examplePrompts = [
    {
      icon: <Code className="w-4 h-4" />,
      text: "Explícame cómo implementar autenticación en Next.js",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      text: "¿Puedes ayudarme a mejorar la arquitectura de mi aplicación?",
    },
    {
      icon: <Wand2 className="w-4 h-4" />,
      text: "Genera un componente de React para una galería de imágenes",
    },
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          {/* Empty State Welcome Section */}
          <div className="text-center space-y-6 py-8 md:py-14">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Bot className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                ¡Bienvenido a tu Asistente AI!
              </h1>
              <p className="text-muted-foreground text-lg">
                Estoy aquí para ayudarte con cualquier pregunta o tarea
              </p>
            </div>

            {/* Example Cards */}
            <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
              {examplePrompts.map((prompt, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setMessage(prompt.text)}
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
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Presiona Enter para enviar. El asistente puede cometer errores.
            Considera verificar información importante.
          </p>
        </form>
      </div>
    </div>
  );
}
