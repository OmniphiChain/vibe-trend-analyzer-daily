import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export const AuthModal = ({
  isOpen,
  onClose,
  defaultMode = "login",
}: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  const handleSuccess = () => {
    onClose();
  };

  const switchToLogin = () => setMode("login");
  const switchToSignup = () => setMode("signup");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0">
        <VisuallyHidden>
          <DialogTitle>{mode === "login" ? "Login" : "Sign Up"}</DialogTitle>
        </VisuallyHidden>
        {mode === "login" ? (
          <LoginForm
            onSwitchToSignup={switchToSignup}
            onSuccess={handleSuccess}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={switchToLogin}
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
