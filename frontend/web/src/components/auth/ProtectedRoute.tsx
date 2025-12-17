import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requirePremium?: boolean;
  requireVerified?: boolean;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const ProtectedRoute = ({
  children,
  requirePremium = false,
  requireVerified = false,
  fallbackTitle = "Authentication Required",
  fallbackDescription = "Please sign in to access this feature.",
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, hasPermission } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Check authentication
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{fallbackTitle}</CardTitle>
              <CardDescription>{fallbackDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                  className="w-full"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthModalOpen(true);
                  }}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Join MoodMeter to access:</p>
                <ul className="mt-2 space-y-1 text-left">
                  <li>• Personalized sentiment dashboards</li>
                  <li>• Custom watchlists and alerts</li>
                  <li>• AI-powered market insights</li>
                  <li>• Community features and predictions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  // Check premium requirement
  if (requirePremium && !hasPermission("premium_features")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              This feature requires a Premium subscription to access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Upgrade to Premium</Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>Premium includes:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Advanced analytics and insights</li>
                <li>• Unlimited watchlists</li>
                <li>• Priority customer support</li>
                <li>• Early access to new features</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check verified requirement
  if (requireVerified && !hasPermission("verified_features")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Verification Required</CardTitle>
            <CardDescription>
              This feature requires account verification to access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Verify Account</Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>Account verification provides:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Enhanced security</li>
                <li>• Access to advanced features</li>
                <li>• Increased account limits</li>
                <li>• Community recognition</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};
