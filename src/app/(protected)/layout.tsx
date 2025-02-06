import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Chat | Chatbot Agent",
  description: "Chat with your AI assistant",
};

export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden w-screen">
          <AppSidebar />
          <div className="flex-1 h-screen py-8 px-2 bg-background">
            {children}
            <footer className="flex justify-center items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Presiona Enter para enviar. El asistente puede cometer errores.
              </p>
            </footer>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
