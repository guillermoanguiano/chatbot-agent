"use client";

import { Message, useChat } from "ai/react";
import { ChatMessage } from "./components/chat-message";
import { Button } from "@/components/ui/button";
import { StopCircle, ArrowDown, SendIcon } from "lucide-react";
import { useChatScroll } from "./hooks/use-chat-scroll";
import { cn } from "@/lib/utils";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { toast } from "sonner";
import { ChatMessageSkeleton } from "./components/chat-message-skeleton";
import { useEffect, useState } from "react";

interface ChatFeatureProps {
  firstMessage?: Message;
  lastMessages: Message[];
  chatId: string;
}

export function ChatFeature({ lastMessages, chatId }: ChatFeatureProps) {
  const [hasInitialSubmit, setHasInitialSubmit] = useState(false);
  const {
    messages,
    input,
    reload,
    handleInputChange,
    handleSubmit: handleSubmitAI,
    isLoading,
    stop,
  } = useChat({
    onError: (error) => {
      toast.error(error.message);
    },
    id: chatId,
    initialMessages: lastMessages,
  });
  const { scrollAreaRef, showScrollButton, scrollToBottom } = useChatScroll();

  useEffect(() => {
    const submitInitialMessage = async () => {
      if (hasInitialSubmit) return;

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role !== "user") return;

      try {
        await reload();
        setHasInitialSubmit(true);
      } catch (error) {
        console.error("Failed to send initial message:", error);
      }
    };

    if (messages.length === 1) {
      submitInitialMessage();
    }

    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await handleSubmitAI(e);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-background">
      <div className="overflow-auto h-dvh" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <>
                <ChatMessageSkeleton direction="right" />
                <ChatMessageSkeleton direction="left" />
                <ChatMessageSkeleton direction="right" />
              </>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  role={message.role as "user" | "assistant"}
                />
              ))
            )}
          </div>
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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <AutosizeTextarea
              placeholder="Escribe un mensaje a tu asistente"
              value={input}
              onChange={handleInputChange}
              name="message"
              className="flex-1 pr-12 textarea"
              disabled={isLoading}
              rows={3}
              maxHeight={250}
            />
            {isLoading ? (
              <Button
                type={isLoading ? "button" : "submit"}
                size="icon"
                disabled={!input.trim()}
                variant="destructive"
                onClick={stop}
                className="absolute right-2.5 bottom-2.5"
              >
                <StopCircle className="h-4 w-4 animate-pulse" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                variant="default"
                className="absolute right-2.5 bottom-2.5"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
