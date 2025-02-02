"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

export const SignInSocialsButton = () => {
  const providers = [
    {
      id: "github",
      name: "GitHub",
      icon: <Github className="mr-2 h-4 w-4" />,
    },
    {
      id: "google",
      name: "Google",
      icon: <FaGoogle className="mr-2 h-4 w-4" />,
    },
  ] as const;

  return (
    <React.Fragment>
      {providers.map((provider) => (
        <Button
          key={provider.id}
          onClick={() => signIn(provider.id)}
          variant="outline"
          className={`w-full ${
            provider.id === "github"
              ? "bg-[#24292e] hover:bg-[#24292e]/90 text-white dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90 dark:text-[#24292e]"
              : provider.id === "google"
              ? "bg-background hover:bg-accent text-foreground border border-input hover:text-accent-foreground"
              : ""
          }`}
        >
          {provider.icon}
          {provider.name}
        </Button>
      ))}
    </React.Fragment>
  );
};
