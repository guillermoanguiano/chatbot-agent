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
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    open,
    openMobile,
    isMobile,
    toggleSidebar,
    setChats,
    chats,
    reloadChats,
  } = useSidebar();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setMessages } = useChat();

  const handleNewChat = () => {
    setMessages([]);
    router.push("/");
  };

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat");
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [reloadChats]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full opacity-60" />
        </>
      );
    }

    if (chats.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">No hay chats disponibles</p>
          <p className="text-xs">Crea uno nuevo para comenzar</p>
        </div>
      );
    }

    return chats?.map((chat) => (
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
    ));
  };

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

        <div className="my-4 mx-auto line-clamp-1">
          {open ? (
            <Button className="flex items-center gap-2" onClick={handleNewChat}>
              <PlusCircleIcon size={24} />
              New Chat
            </Button>
          ) : (
            <PlusCircleIcon size={24} onClick={handleNewChat} />
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup className={cn({ hidden: !open && !openMobile })}>
          <SidebarGroupLabel className="mb-2">Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderContent()}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} status={status} />
      </SidebarFooter>
    </Sidebar>
  );
}
