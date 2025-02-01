import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ShoppingBag, Bot, Github } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import { providerMap } from "@/auth";
import { signInWithProvider } from "@/actions/auth";
import SignInForm from "@/features/auth/sign-in/components/sign-in-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <Bot className="h-6 w-6 text-secondary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Login to ShopSmart AI
          </CardTitle>
          <CardDescription className="text-center">
            Your AI-powered shopping assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
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
              {Object.values(providerMap).map((provider) => (
                <form
                  action={signInWithProvider.bind(
                    null,
                    provider.id,
                    searchParams?.callbackUrl || "/"
                  )}
                  key={provider.id}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className={`w-full ${
                      provider.id === "github"
                        ? "bg-[#24292e] hover:bg-[#24292e]/90 text-white dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90 dark:text-[#24292e]"
                        : provider.id === "google"
                        ? "bg-background hover:bg-accent text-foreground border border-input hover:text-accent-foreground"
                        : ""
                    }`}
                  >
                    {provider.id === "github" ? (
                      <Github className="mr-2 h-4 w-4" />
                    ) : provider.id === "google" ? (
                      <FaGoogle className="mr-2 h-4 w-4" />
                    ) : null}
                    {provider.name}
                  </Button>
                </form>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
