import { convertToCoreMessages, Message, smoothStream, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getContext } from "@/lib/context";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || !session.user?.id) {
            redirect("/sign-in");
        }
        const { messages, id }: { messages: Message[], id: string } = await req.json();

        const lastMessage = messages[messages.length - 1].content;

        const context1 = await getContext("diet");
        const context2 = await getContext("workout");

        const existingMessage = await prisma.logMessage.findFirst({
            where: {
                chatId: id,
                messageIn: lastMessage,
            }
        });

        const logMessage = existingMessage || await prisma.logMessage.create({
            data: {
                chatId: id,
                messageIn: lastMessage,
                messageOut: "",
                response: "",
                tokenRead: 0,
                tokenGen: 0,
            },
        });

        const systemPrompt = `Eres Fitbo un assistente profesiona sobre nutrición deportiva y entrenamiento personal.
            Comportate como entrenador personal y responde a las preguntas de tus clientes.
            Si necesitas informacion sobre un cliente, puedes preguntar.

            Basa tus respuestas en esta informacion para dar la mejor respuesta posible.
            ${context1}
            ${context2}

            Usuario: ${session.user.name}

            ${lastMessage}
        `;

        const stream = streamText({
            model: groq("llama3-70b-8192"),
            system: systemPrompt,
            messages: convertToCoreMessages(messages),
            temperature: 0,
            maxTokens: 1000,
            abortSignal: req.signal,
            experimental_transform: smoothStream(),
            async onFinish({ response, usage }) {
                const aiResponse = response.messages[response.messages.length - 1].content[0] as { text?: string };
                await prisma.logMessage.update({
                    where: { id: logMessage.id },
                    data: {
                        messageOut: aiResponse?.text || "",
                        response: response.modelId || "",
                        tokenRead: usage.totalTokens ?? 0,
                        tokenGen: usage.completionTokens ?? 0,
                    },
                });
            },
        })

        return stream.toDataStreamResponse();

    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            redirect("/sign-in");
        }

        const chats = await prisma.chats.findMany({
            select: {
                id: true,
                title: true,
            },
            where: {
                userId: session?.user.id,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10,
        });

        return NextResponse.json(chats);
    } catch (error) {
        console.error("Failed to fetch chats:", error);
        return NextResponse.error();
    }
}