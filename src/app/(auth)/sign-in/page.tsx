import Link from "next/link";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ShoppingBag,
  Bot,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import SignInForm from "@/features/auth/components/sign-in-form";
import { SignInSocialsButton } from "@/features/auth/components/sign-in-socials-button";

export const metadata: Metadata = {
  title: "Sign In | Chatbot Agent",
  description: "Sign in to your account",
  viewport: "width=device-width, initial-scale=1",
};

type ErrorMessages = {
  [key: string]: {
    title: string;
    description: string;
  };
};

const errorMessages: ErrorMessages = {
  "invalid-token": {
    title: "Invalid verification link",
    description: "The verification link is invalid or has been tampered with.",
  },
  expired: {
    title: "Link expired",
    description: "The verification link has expired. Please request a new one.",
  },
  "already-verified": {
    title: "Already verified",
    description: "This email has already been verified. You can sign in.",
  },
  "server-error": {
    title: "Server error",
    description:
      "An error occurred during verification. Please try again later.",
  },
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: { verified?: string; error?: string };
}) {
  const isVerified = searchParams.verified === "true";
  const error = searchParams.error;
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <Bot className="h-6 w-6 text-secondary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In to ShopSmart AI
          </CardTitle>
          <CardDescription className="text-center">
            Your AI-powered shopping assistant
          </CardDescription>

          {isVerified && (
            <div className="animate-in fade-in-0 slide-in-from-top-5 duration-500">
              <Alert
                className={cn(
                  "border-green-200 bg-green-100 dark:bg-green-900/30 dark:border-green-900",
                  "flex items-center gap-2 shadow-sm"
                )}
                role="status"
                aria-live="polite"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 animate-in zoom-in-50 duration-300" />
                <div className="space-y-1">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    Email verified successfully! You can now sign in.
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}

          {errorMessage && (
            <div className="animate-in fade-in-0 slide-in-from-top-5 duration-500">
              <Alert
                variant="destructive"
                className="flex items-center gap-2 shadow-sm"
                role="alert"
              >
                {error === "already-verified" ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <div className="space-y-1">
                  <AlertTitle>{errorMessage.title}</AlertTitle>
                  <AlertDescription>
                    {errorMessage.description}
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <SignInForm />
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/sign-up"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SignInSocialsButton />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
