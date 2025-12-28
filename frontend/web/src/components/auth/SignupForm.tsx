import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import type { SignupData } from "@/types/user";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const SignupForm = ({ onSwitchToLogin, onSuccess }: SignupFormProps) => {
  const { signup, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    agreeToTerms: false,
    newsletter: false,
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    agreeToTerms?: string;
  }>({});

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 25) return "Very weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: {
      email?: string;
      username?: string;
      password?: string;
      agreeToTerms?: string;
    } = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Username validation
    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 50) {
      errors.password =
        "Password is too weak. Use a mix of letters, numbers, and symbols";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms =
        "You must agree to the Terms of Service and Privacy Policy";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    clearError();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Attempt signup
    const success = await signup(formData);

    if (success && onSuccess) {
      onSuccess();
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof SignupData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Create your account
        </CardTitle>
        <CardDescription>
          Join MoodMeter to get personalized sentiment insights and track market
          trends
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${validationErrors.email ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-destructive">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) =>
                  handleInputChange("username", e.target.value.toLowerCase())
                }
                className={`pl-10 ${validationErrors.username ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
            </div>
            {validationErrors.username && (
              <p className="text-sm text-destructive">
                {validationErrors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 pr-10 ${validationErrors.password ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Password strength:
                  </span>
                  <span
                    className={`font-medium ${
                      passwordStrength >= 75
                        ? "text-green-600"
                        : passwordStrength >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <Progress value={passwordStrength} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Include lowercase, uppercase, numbers, and symbols for a
                  stronger password
                </div>
              </div>
            )}

            {validationErrors.password && (
              <p className="text-sm text-destructive">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", !!checked)
                }
                disabled={isLoading}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  disabled={isLoading}
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  disabled={isLoading}
                >
                  Privacy Policy
                </Button>
              </Label>
            </div>
            {validationErrors.agreeToTerms && (
              <p className="text-sm text-destructive">
                {validationErrors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Newsletter Subscription */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={formData.newsletter}
              onCheckedChange={(checked) =>
                handleInputChange("newsletter", !!checked)
              }
              disabled={isLoading}
            />
            <Label htmlFor="newsletter" className="text-sm">
              Subscribe to our newsletter for market insights and updates
            </Label>
          </div>

          {/* Sign Up Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Benefits */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">What you'll get:</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              <span>Personalized sentiment dashboards</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              <span>Custom watchlists and alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              <span>AI-powered market insights</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              <span>Community features and predictions</span>
            </div>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
