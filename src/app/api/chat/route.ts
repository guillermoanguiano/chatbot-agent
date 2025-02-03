import { smoothStream, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getContext } from "@/lib/context";

export async function POST(req: Request) {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    const isDietQuery = lastMessage.includes("dieta") || lastMessage.includes("alimentación");
    const context = await getContext(isDietQuery ? "diet" : "workout");

    const systemPrompt = `
        Eres "FitCoach", experto en nutrición y entrenamiento. 
        **Instrucciones:**
        1. Usa ESTA información como prioridad: 
        ${context}
        2. Si no hay datos relevantes, usa tu conocimiento general
    `;

    const stream = streamText({
        model: groq("llama3-70b-8192"),
        system: "You are FitCoach, a nutrition and training expert.",
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
        experimental_transform: smoothStream(),
    });

    return stream.toDataStreamResponse();
}