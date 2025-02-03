/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useChat } from "ai/react";
import { Bot, Code, MessageSquare, Wand2, Sparkles, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const examplePrompts = [
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

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          {messages.length === 0 ? (
            // Empty State Welcome Section
            <div className="text-center space-y-6 py-8 md:py-14">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
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

              {/* Example Cards */}
              <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
                {examplePrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      handleInputChange({
                        target: { value: prompt.text },
                      } as any)
                    }
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
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="font-medium mb-1">
                      {message.role === "user" ? "Tú" : "FitCoach"}
                    </div>
                    <div className="prose prose-sm dark:prose-invert">
                      {message.content}
                    </div>
                    {message.annotations && (
                      <pre className="p-4 text-sm bg-gray-100">
                        {JSON.stringify(message.annotations, null, 2)}
                      </pre>
                    )}
                    <br />
                    <br />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      {/* Chat Input */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={handleInputChange}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
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
