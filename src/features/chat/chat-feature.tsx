"use client";

import { useChat } from "ai/react";
import { toast } from "sonner";
import { ChatMessage } from "./components/chat-message";
import { WelcomeSection } from "./components/welcome-section";
import { Button } from "@/components/ui/button";
import {
  StopCircle,
  ArrowDown,
  Send,
  SendHorizonal,
  SendHorizonalIcon,
  SendIcon,
} from "lucide-react";
import { useChatScroll } from "./hooks/use-chat-scroll";
import { cn } from "@/lib/utils";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

export function ChatFeature() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      onError: () =>
        toast.error(
          "Error al procesar tu mensaje. Por favor, intenta de nuevo."
        ),
    });

  const { scrollAreaRef, showScrollButton, scrollToBottom } = useChatScroll();

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
    <div
      className={cn(
        "flex flex-col h-full relative bg-background",
        messages.length === 0 && "justify-center h-auto mt-14"
      )}
    >
      <div
        className={cn("overflow-auto", messages.length > 0 && "h-dvh")}
        ref={scrollAreaRef}
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeSection
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
        <br />

        <Button
          onClick={scrollToBottom}
          className={cn(
            "absolute bottom-28 right-[50%] rounded-full shadow-lg animate-bounce",
            {
              hidden: !showScrollButton,
            }
          )}
          size="icon"
          variant="secondary"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <AutosizeTextarea
              placeholder="Escribe un mensaje a tu asistente"
              value={input}
              onChange={handleInputChange}
              className="flex-1 pr-12 textarea"
              disabled={isLoading}
              rows={3}
              maxHeight={250}
            />
            <Button
              type={isLoading ? "button" : "submit"}
              size="icon"
              disabled={!input.trim()}
              variant={isLoading ? "destructive" : "default"}
              onClick={isLoading ? stop : undefined}
              className="absolute right-2.5 bottom-2.5"
            >
              {isLoading ? (
                <StopCircle className="h-4 w-4 animate-pulse" />
              ) : (
                <SendIcon className="h-4 w-4" />
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
