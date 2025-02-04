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
          <main className="flex-1 h-screen py-8 bg-background">{children}</main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
