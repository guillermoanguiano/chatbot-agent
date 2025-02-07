'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createChat(message: string) {
    const session = await auth()

    if (!session?.user?.id) {
        return
    }

    const chat = await prisma.chats.create({
        data: {
            title: message.slice(0, 30),
            userId: session.user.id,
            logMessages: {
                create: {
                    messageIn: message,
                    messageOut: "",
                    response: "",
                    tokenRead: 0,
                    tokenGen: 0,
                },
            },
        },
    })

    revalidatePath('/chat')
    return chat

}