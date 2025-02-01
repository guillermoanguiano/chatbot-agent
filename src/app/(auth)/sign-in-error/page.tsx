"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

enum Error {
  Configuration = "Configuration",
  Unauthorized = "Unauthorized",
  AccessDenied = "AccessDenied",
  CredentialsSignin = "CredentialsSignin",
}

const errorMap: Record<Error, { title: string; message: string }> = {
  [Error.Configuration]: {
    title: "Configuration Error",
    message:
      "There was a problem with the authentication configuration. Please contact support if this error persists.",
  },
  [Error.Unauthorized]: {
    title: "Unauthorized",
    message:
      "You are not authorized to access this resource. Please check your credentials and try again.",
  },
  [Error.AccessDenied]: {
    title: "Access Denied",
    message:
      "You don't have permission to access this resource. If you believe this is an error, please contact support.",
  },
  [Error.CredentialsSignin]: {
    title: "Invalid Credentials",
    message:
      "The email or password you entered is incorrect. Please try again.",
  },
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;
  const errorDetails = errorMap[error] || {
    title: "Unknown Error",
    message:
      "An unexpected error occurred. Please try again or contact support.",
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-bold text-primary">
            <AlertCircle className="h-6 w-6" />
            <span>{errorDetails.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {errorDetails.message}
          </p>
          {error && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Error code:</p>
              <code className="rounded-md bg-secondary px-2 py-1 text-xs">
                {error}
              </code>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/sign-in">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
