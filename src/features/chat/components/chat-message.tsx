import { Button } from "@/components/ui/button";
import { Copy, Check, Laptop } from "lucide-react";
import type { ChatMessageProps } from "../types";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

const ChatMessageComponent = ({ id, content, role }: ChatMessageProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback(
    async (content: string, messageId: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(messageId);
        setTimeout(() => setCopied(null), 2000);
        toast.success("Contenido copiado");
      } catch {
        toast.error("Error al copiar");
      }
    },
    []
  );
  return (
    <div
      className={cn(
        "flex w-full relative",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(role === "assistant" && "flex", "")}>
        {role === "assistant" && (
          <Avatar className="">
            <Laptop className="h-6 w-6" />
          </Avatar>
        )}

        <div
          className={cn(
            "relative  rounded-3xl group",
            role === "user" ? "bg-muted p-4" : "border-[0.5px] dark:border-none"
          )}
        >
          {role === "assistant" && (
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">FitCoach</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(content, id)}
              >
                {copied === id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          <div className="prose prose-sm dark:prose-invert">
            <MemoizedMarkdown id={id} content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

ChatMessageComponent.displayName = "ChatMessage";

export const ChatMessage = memo(ChatMessageComponent);
