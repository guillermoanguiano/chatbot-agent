"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import { MessageSquare } from "lucide-react";
import { ActionButtons } from "./actions-buttons";

// Dummy data for recent chats
const recentChats = [
  {
    id: 1,
    title: "React Router Implementation",
    preview: "How do I implement React Router v6...",
    date: "2024-03-10",
  },
  {
    id: 2,
    title: "NextJS API Routes",
    preview: "Creating API routes in Next.js...",
    date: "2024-03-09",
  },
  {
    id: 3,
    title: "Database Schema Design",
    preview: "Help me design a schema for...",
    date: "2024-03-08",
  },
];

export function AppSidebar() {
  const { open, openMobile, isMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
      {(open || (openMobile && isMobile)) && (
          <ActionButtons variant="sidebar" />
        )}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <a
                      href={`/chat/${chat.id}`}
                      className="flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} />
                        <span className="font-medium">{chat.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {chat.preview}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
