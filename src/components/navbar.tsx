"use client";

import { ModeToggle } from "./theme-toggle-button";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

// Dummy user data
const user = {
  name: "John Doe",
  email: "john@example.com",
  image: null,
};

export default function Navbar() {
  const { open } = useSidebar();
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4">
      {!open && <SidebarTrigger />}

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="ghost" size="icon">
          <UserCircle className="h-6 w-6" />
        </Button>

        <ModeToggle />
      </div>
    </header>
  );
}
