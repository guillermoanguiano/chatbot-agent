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
  SidebarFooter,
} from "./ui/sidebar";
import { MessageSquare, PanelLeft, PlusCircleIcon } from "lucide-react";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { FaDumbbell } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const recentChats = [
  {
    id: 1,
    title: "Diet Plan for Weight Loss",
    date: "2024-03-10",
  },
  {
    id: 2,
    title: "Workout Plan for Beginners",
    date: "2024-03-09",
  },
  {
    id: 3,
    title: "Diet Plan for Muscle Gain",
    date: "2024-03-08",
  },
];

export function AppSidebar() {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar();
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <Sidebar
      collapsible="icon"
      className="duration-100"
      style={
        {
          "--sidebar-width-icon": "68px",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="p-3">
        <div
          className={cn("flex items-center justify-between w-full", {
            "flex-col gap-6": !open,
          })}
        >
          <div className="flex items-center justify-center gap-2 text-nowrap line-clamp-1">
            {(open || (openMobile && isMobile)) && (
              <h1 className="text-xl font-bold">Fitbo AI</h1>
            )}
            <FaDumbbell size={36} />
          </div>
          <PanelLeft
            className="cursor-pointer"
            onClick={toggleSidebar}
            size={24}
          />
        </div>

        <div className="mt-6 mx-auto line-clamp-1">
          {open ? (
            <Button
              className="flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <PlusCircleIcon size={24} />
              New Chat
            </Button>
          ) : (
            <PlusCircleIcon size={24} onClick={() => router.push("/")} />
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup className={cn({ hidden: !open && !openMobile })}>
          <SidebarGroupLabel className="mb-2">Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/chat/${chat.id}`}
                      className="flex justify-start !items-start"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} />
                        <span className="font-medium">{chat.title}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} status={status} />
      </SidebarFooter>
    </Sidebar>
  );
}
