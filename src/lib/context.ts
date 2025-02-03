import fs from "fs/promises";

export async function getContext(topic: "diet" | "workout") {
    try {
        const filePath = `data/${topic}.md`;
        const content = await fs.readFile(filePath, "utf-8");
        return content;
    } catch {
        return "";
    }
}