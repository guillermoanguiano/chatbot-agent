'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createChat(message: string) {
    const session = await auth()

    if (!session?.user?.id) {
        return
    }

    const chat = await prisma.chatTitle.create({
        data: {
            title: message.slice(0, 30),
            logMessages: {
                create: {
                    userId: session.user.id,
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

// export async function saveMessage(chatId: string, userId: string, messageIn: string, messageOut: string) {
//     const message = await prisma.logMessage.create({
//         data: {
//             chatTitleId: chatId,
//             userId,
//             messageIn,
//             messageOut,
//             response: "",
//             tokenRead: 0,
//             tokenGen: 0,
//         },
//     })

//     revalidatePath(`/chat/${chatId}`)
//     return message
// }