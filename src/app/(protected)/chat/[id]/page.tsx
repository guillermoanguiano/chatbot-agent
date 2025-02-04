/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatFeature } from "@/features/chat/chat-feature";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function ChatSpecificPage({ params: { id } }: PageParams) {
  // const res = await prisma.logMessage.findUnique({
  //   where: {
  //     id,
  //   },
  // });
  // if (!res) return notFound();
  // const parseResult = JsonMessagesArraySchema.parse(res.messages);
  // return <Chat id={id} messages={parseResult} />;
  console.log(id);
  return <ChatFeature />;
}
