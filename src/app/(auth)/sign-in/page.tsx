import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ShoppingBag, Bot } from "lucide-react";

import SignInForm from "@/features/auth/components/sign-in-form";
import { SignInSocialsButton } from "../../../features/auth/components/sign-in-socials-button";

export default function LoginPage() {
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
              <SignInSocialsButton />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
