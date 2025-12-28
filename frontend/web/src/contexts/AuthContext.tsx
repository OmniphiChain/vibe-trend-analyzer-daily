import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import type {
  User,
  LoginCredentials,
  SignupData,
  AuthResponse,
} from "@/types/user";
import { mockDatabaseService } from "@/services/database";
import { useToast } from "@/hooks/use-toast";

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS"; payload: { user: User; token: string } }
  | { type: "SIGNUP_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };

    case "LOGIN_FAILURE":
    case "SIGNUP_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...initialState,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Auth context interface
interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;

  // Utility functions
  hasPermission: (permission: string) => boolean;
  isPremium: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  // Check for stored auth data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("moodmeter_token");
    const storedUser = localStorage.getItem("moodmeter_user");

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: storedToken },
        });
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("moodmeter_token");
        localStorage.removeItem("moodmeter_user");
      }
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Use mock service for now - replace with real API when MCP is connected
      const response = await mockDatabaseService.mockLogin(
        credentials.email,
        credentials.password,
      );

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store auth data
        if (credentials.rememberMe) {
          localStorage.setItem("moodmeter_token", token);
          localStorage.setItem("moodmeter_user", JSON.stringify(user));
        }

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });

        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${user.firstName || user.username}!`,
        });

        return true;
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: response.error || "Login failed",
        });

        toast({
          title: "Login failed",
          description:
            response.error || "Please check your credentials and try again.",
          variant: "destructive",
        });

        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });

      toast({
        title: "Login error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  };

  // Signup function
  const signup = async (userData: SignupData): Promise<boolean> => {
    dispatch({ type: "SIGNUP_START" });

    try {
      // Use mock service for now - replace with real API when MCP is connected
      const response = await mockDatabaseService.mockSignup(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store auth data
        localStorage.setItem("moodmeter_token", token);
        localStorage.setItem("moodmeter_user", JSON.stringify(user));

        dispatch({
          type: "SIGNUP_SUCCESS",
          payload: { user, token },
        });

        toast({
          title: "Welcome to MoodMeter!",
          description: `Account created successfully. Welcome, ${user.firstName || user.username}!`,
        });

        return true;
      } else {
        dispatch({
          type: "SIGNUP_FAILURE",
          payload: response.error || "Signup failed",
        });

        toast({
          title: "Signup failed",
          description: response.error || "Please try again.",
          variant: "destructive",
        });

        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      dispatch({
        type: "SIGNUP_FAILURE",
        payload: errorMessage,
      });

      toast({
        title: "Signup error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem("moodmeter_token");
    localStorage.removeItem("moodmeter_user");

    // Update mock service
    mockDatabaseService.logout();

    dispatch({ type: "LOGOUT" });

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!state.user || !state.token) {
      return false;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // In a real app, this would call the API to update user data
      const updatedUser = { ...state.user, ...userData };

      // Update stored user data
      localStorage.setItem("moodmeter_user", JSON.stringify(updatedUser));

      dispatch({ type: "UPDATE_USER", payload: updatedUser });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";

      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Utility function to check permissions
  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;

    // Basic permission system - extend as needed
    switch (permission) {
      case "premium_features":
        return state.user.isPremium;
      case "verified_features":
        return state.user.isVerified;
      case "basic_features":
        return true;
      default:
        return false;
    }
  };

  // Check if user has premium subscription
  const isPremium = (): boolean => {
    return state.user?.isPremium || false;
  };

  // Context value
  const value: AuthContextType = {
    // State
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,

    // Actions
    login,
    signup,
    logout,
    updateUser,
    clearError,

    // Utilities
    hasPermission,
    isPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// HOC for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requirePremium?: boolean;
  requireVerified?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null,
  requirePremium = false,
  requireVerified = false,
}) => {
  const { isAuthenticated, user, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return fallback;
  }

  if (requirePremium && !hasPermission("premium_features")) {
    return fallback;
  }

  if (requireVerified && !hasPermission("verified_features")) {
    return fallback;
  }

  return <>{children}</>;
};

// Export hook for checking auth status
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated,
    isPremium: user?.isPremium || false,
    isVerified: user?.isVerified || false,
  };
};
