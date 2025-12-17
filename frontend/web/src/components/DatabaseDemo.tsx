import { useState } from "react";
import {
  Database,
  Users,
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export const DatabaseDemo = () => {
  const { isAuthenticated, user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const databaseFeatures = [
    {
      title: "User Authentication",
      description: "Secure login/signup with JWT tokens and session management",
      icon: Key,
      status: "implemented",
      features: [
        "Email/password authentication",
        "Remember me functionality",
        "Password strength validation",
        "Social login ready",
      ],
    },
    {
      title: "User Profiles",
      description: "Comprehensive user profile management with preferences",
      icon: Users,
      status: "implemented",
      features: [
        "Personal information",
        "Avatar upload",
        "Bio and social links",
        "Privacy settings",
      ],
    },
    {
      title: "Database Schema",
      description: "Complete relational database design for all user data",
      icon: Database,
      status: "implemented",
      features: [
        "User tables",
        "Preferences",
        "Watchlists",
        "Saved insights",
        "Activity tracking",
      ],
    },
    {
      title: "Security & Privacy",
      description: "Enterprise-grade security with role-based access",
      icon: Shield,
      status: "implemented",
      features: [
        "Password hashing",
        "JWT tokens",
        "RBAC permissions",
        "Data encryption",
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "planned":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1F2937] via-[#3730A3] to-[#4338CA] dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 bg-clip-text text-transparent">
            Database & User Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete authentication and user management system with secure
            database integration, ready for production use.
          </p>
        </div>

        {/* Current User Status */}
        {isAuthenticated && user && (
          <Card className="border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Welcome back, {user.firstName || user.username}!
              </CardTitle>
              <CardDescription>
                You are successfully authenticated. Your session is active and
                secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.stats.totalLogins}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Logins
                  </div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.stats.accuracyRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Accuracy Rate
                  </div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.stats.totalPointsEarned}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Points Earned
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authentication Demo */}
        {!isAuthenticated && (
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Try the Authentication System
              </CardTitle>
              <CardDescription>
                Test the complete login/signup flow with validation, error
                handling, and user experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                  className="w-full"
                >
                  Try Demo Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthModalOpen(true);
                  }}
                  className="w-full"
                >
                  Create New Account
                </Button>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Demo Credentials:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Email: demo@moodmeter.com | Password: demo123
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {databaseFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {feature.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(feature.status)}
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Database Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              MCP Database Integration Ready
            </CardTitle>
            <CardDescription>
              Connect to your preferred database service through Builder.io MCP
              integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🗄️ Recommended: Neon</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Serverless PostgreSQL with instant branching and
                  scale-to-zero.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Auto-scaling and cost-effective</li>
                  <li>• Built-in connection pooling</li>
                  <li>• Branch database for development</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">
                  🔧 Alternative: Prisma Postgres
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Type-safe database ORM with excellent developer experience.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Auto-generated types</li>
                  <li>• Database migrations</li>
                  <li>• Advanced query optimization</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>To connect:</strong> Click the "MCP Servers" button
                below the chat input, select your database provider, and update
                the environment variables in your project settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
            <CardDescription>
              Built with modern best practices and production-ready architecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Frontend Stack</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• React 18 with TypeScript</li>
                  <li>• Context API for state management</li>
                  <li>• shadcn/ui component library</li>
                  <li>• React Hook Form validation</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Security Features</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• JWT token authentication</li>
                  <li>• Password strength validation</li>
                  <li>• Session management</li>
                  <li>• Protected routes</li>
                  <li>• RBAC permissions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Database Design</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Normalized relational schema</li>
                  <li>• User preferences & settings</li>
                  <li>• Watchlists & saved insights</li>
                  <li>• Activity tracking</li>
                  <li>• Premium subscriptions</li>
                </ul>
              </div>
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
};
