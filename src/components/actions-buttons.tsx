import { cn } from "@/lib/utils";
import { SidebarTrigger } from "./ui/sidebar";
import { TooltipButton } from "./ui/tooltip";
import { Search, PlusCircle } from "lucide-react";

interface ActionButtonsProps {
  variant?: "navbar" | "sidebar";
}

export function ActionButtons({ variant = "navbar" }: ActionButtonsProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        variant === "navbar" && "gap-2",
        variant === "sidebar" && "justify-between w-full"
      )}
    >
      <SidebarTrigger />
      <div className={cn(variant === "navbar" && "flex gap-2")}>
        <TooltipButton
          icon={Search}
          label="Search chats"
          onClick={() => console.log("search")}
          size="md"
        />
        <TooltipButton
          icon={PlusCircle}
          label="New chat"
          onClick={() => console.log("new chat")}
          size="md"
        />
      </div>
    </div>
  );
}