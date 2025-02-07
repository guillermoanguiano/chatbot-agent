import { ChatFeature } from "@/features/chat/chat-feature";
import { prisma } from "@/lib/db";
import { Message } from "ai";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type ChatSpecificPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: ChatSpecificPageProps): Promise<Metadata> {
  const chat = await prisma.chats.findUnique({
    where: { id },
  });

  return {
    title: chat?.title,
    description: `Chat about ${chat?.title} with your AI assistant`,
  };
}

export default async function ChatSpecificPage({
  params: { id },
}: ChatSpecificPageProps) {
  const chat = await prisma.chats.findUnique({
    where: { id },
    include: {
      logMessages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat) return notFound();

  const lastMessages: Message[] = chat.logMessages.flatMap((log) => {
    const messages: Message[] = [];
    messages.push({
      id: log.id,
      content: log.messageIn,
      role: "user",
    });

    if (log.messageOut) {
      messages.push({
        id: `${log.id}-out`,
        content: log.messageOut,
        role: "assistant",
      });
    }

    return messages;
  });

  // Quiero que si solo hay un mensaje en este chat, significa que se creo recientemente y no se ha respondido, entonces quiero que el primer mensaje sea el mensaje del usuario, pero si hay mas de un mensaje, entonces el chat ya esta creado... ocupo validar si el ultimo mensaje es del usuario o del asistente para saber si mando el mensaje o no

  const firstMessage =
    lastMessages.length === 1 && lastMessages[0].role === "user"
      ? lastMessages[0]
      : undefined;

  return (
    <ChatFeature
      firstMessage={firstMessage}
      lastMessages={lastMessages}
      chatId={id}
    />
  );
}
