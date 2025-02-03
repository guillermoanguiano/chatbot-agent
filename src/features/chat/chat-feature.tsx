"use client";

import { useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ChatMessage } from "./components/chat-message";
import { WelcomeSection } from "./components/welcome-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, StopCircle, ArrowDown } from "lucide-react";
import { useChatScroll } from "./hooks/use-chat-scroll";

export function ChatFeature() {
  const { data: session } = useSession();
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      onError: () =>
        toast.error(
          "Error al procesar tu mensaje. Por favor, intenta de nuevo."
        ),
    });

  const {
    scrollAreaRef,
    showScrollButton,
    scrollToBottom,
    isScrolledToBottom,
  } = useChatScroll();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await handleSubmit(e);
    } catch {
      toast.error("Error al enviar el mensaje");
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div
        className="flex-1 h-[calc(100vh-160px)] overflow-auto"
        ref={scrollAreaRef}
      >
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          {messages.length === 0 ? (
            <WelcomeSection
              userName={session?.user?.name}
              onPromptSelect={(text) =>
                handleInputChange({
                  target: { value: text },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  role={message.role as "user" | "assistant"}
                />
              ))}
            </div>
          )}
        </div>
        {(showScrollButton || !isScrolledToBottom) && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-20 right-[50%] rounded-full shadow-lg animate-bounce"
            size="icon"
            variant="secondary"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={handleInputChange}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type={isLoading ? "button" : "submit"}
              size="icon"
              disabled={!input.trim()}
              variant={isLoading ? "destructive" : "default"}
              onClick={isLoading ? stop : undefined}
            >
              {isLoading ? (
                <StopCircle className="h-4 w-4 animate-pulse" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              Presiona Enter para enviar. El asistente puede cometer errores.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
