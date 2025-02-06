"use client";

import { FormEvent, useState } from "react";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { WelcomeSection } from "@/features/chat/components/welcome-section";
import { SendIcon } from "lucide-react";
import { createChat } from "@/actions/chat-actions";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { reloadChats, setReloadChats } = useSidebar();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const chat = await createChat(input);

      if (!chat) {
        return toast.error("No se pudo enviar el mensaje");
      }

      setReloadChats(!reloadChats);
      setInput("");
      router.push(`/chat/${chat.id}`);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-background">
      <div>
        <div className="max-w-4xl mx-auto">
          <WelcomeSection onPromptSelect={(text) => setInput(text)} />
        </div>
        <br />
      </div>

      <div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <AutosizeTextarea
              placeholder="Escribe un mensaje a tu asistente"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              name="message"
              className="flex-1 pr-12 textarea"
              rows={3}
              maxHeight={250}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2.5 bottom-2.5"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
