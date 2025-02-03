import { smoothStream, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getContext } from "@/lib/context";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Invalid request format" },
                { status: 400 }
            );
        }

        const lastMessage = messages[messages.length - 1].content.toLowerCase();

        const contextKeywords = {
            diet: ["dieta", "alimentación", "nutrición", "comer", "comida"],
            workout: ["ejercicio", "rutina", "entrenamiento", "gimnasio", "músculo"]
        };

        const isDietQuery = contextKeywords.diet.some(keyword => lastMessage.includes(keyword));
        const context = await getContext(isDietQuery ? "diet" : "workout");

        const systemPrompt = `
            Eres "FitCoach", un experto certificado en nutrición deportiva y entrenamiento personal.

            **Instrucciones Específicas:**
            1. Usa esta información como base principal para tus respuestas:
            ${context}

            2. Si no hay datos específicos en el contexto:
               - Proporciona recomendaciones basadas en ciencia deportiva actualizada
               - Siempre prioriza la seguridad del usuario
               - Sugiere alternativas para diferentes niveles de experiencia

            3. Formato de Respuesta:
               - Usa Markdown para estructurar tus respuestas
               - Incluye viñetas para listar puntos importantes
               - Destaca advertencias o puntos clave en **negrita**
               - Separa la información en secciones claras

            4. Consideraciones de Seguridad:
               - Incluye disclaimers cuando sea necesario
               - Recomienda consultar profesionales de la salud cuando apropiadosee
               - No des consejos médicos específicos

            5. Personalización:
               - Adapta las respuestas al nivel del usuario
               - Ofrece variantes o alternativas cuando sea posible
               - Se empático y motivador

            Usuario Actual: ${session.user.name || "Usuario"}
            Tipo de Consulta: ${isDietQuery ? "Nutrición" : "Entrenamiento"}
        `;

        const stream = streamText({
            model: groq("llama3-70b-8192"),
            system: systemPrompt,
            messages: messages,
            temperature: 0.7,
            maxTokens: 1000,
            experimental_transform: smoothStream(),
        });

        console.log(`Chat request from ${session.user.email}: ${lastMessage}`);

        return stream.toDataStreamResponse();

    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}