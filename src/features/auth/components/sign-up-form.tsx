"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { signUpSchema, SignUpSchema } from "../schema/sign-up-schema";
import { signUpAction } from "@/actions/auth-actions";
import { toast } from "sonner";

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpSchema) {
    setError(null);
    startTransition(async () => {
      try {
        const response = await signUpAction(values);

        if (response?.error) {
          setError(response.error);
          return;
        }

        toast.success(
          "Registration successful! Please check your email to verify your account.",
          {
            duration: 5000,
          }
        );

        router.push("/verify-email");
      } catch {
        toast.error("Something went wrong during registration.");
        setError("An unexpected error occurred");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="eg. Federico Dondi"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="eg. fede@example.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type="password"
                  placeholder="••••••••"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <FormMessage>{error}</FormMessage>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
