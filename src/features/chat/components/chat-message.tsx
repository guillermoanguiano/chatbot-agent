import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import type { ChatMessageProps } from "../types";
import { useState } from "react";
import { toast } from "sonner";

export function ChatMessage({ id, content, role }: ChatMessageProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(messageId);
      setTimeout(() => setCopied(null), 2000);
      toast.success("Contenido copiado al portapapeles");
    } catch {
      toast.error("Error al copiar el contenido");
    }
  };
  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative p-4 rounded-lg max-w-[80%] group ${
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">
            {role === "user" ? "Tú" : "FitCoach"}
          </span>
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
        <div className="prose prose-sm dark:prose-invert">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-xl font-bold my-2" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-lg font-bold my-2" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-md font-bold my-2" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc pl-4 my-2" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal pl-4 my-2" {...props} />
              ),
              li: ({ ...props }) => <li className="my-1" {...props} />,
              p: ({ ...props }) => <p className="my-2" {...props} />,
              strong: ({ ...props }) => (
                <strong className="font-bold text-primary" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
