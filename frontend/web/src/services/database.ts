// Database service layer - connects to your chosen MCP database (Neon/Prisma)
import type {
  User,
  UserPreferences,
  UserWatchlist,
  UserAlert,
  UserSavedInsight,
  LoginCredentials,
  SignupData,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
} from "@/types/user";

// Database configuration - will be set up with MCP integration
class DatabaseService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    // These will be configured with your MCP database connection
    this.baseUrl =
      import.meta.env.VITE_DATABASE_URL || "http://localhost:3001/api";
    this.apiKey = import.meta.env.VITE_API_KEY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Database request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Authentication methods
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(token: string): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async resetPassword(email: string): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // User management methods
  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    return this.request<User>("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateUser(
    userId: string,
    userData: Partial<User>,
    token: string,
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string, token: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // User preferences methods
  async getUserPreferences(
    userId: string,
    token: string,
  ): Promise<ApiResponse<UserPreferences>> {
    return this.request<UserPreferences>(`/users/${userId}/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>,
    token: string,
  ): Promise<ApiResponse<UserPreferences>> {
    return this.request<UserPreferences>(`/users/${userId}/preferences`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(preferences),
    });
  }

  // Watchlist methods
  async getUserWatchlists(
    userId: string,
    token: string,
  ): Promise<ApiResponse<UserWatchlist[]>> {
    return this.request<UserWatchlist[]>(`/users/${userId}/watchlists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createWatchlist(
    userId: string,
    watchlistData: Omit<
      UserWatchlist,
      "id" | "userId" | "createdAt" | "updatedAt"
    >,
    token: string,
  ): Promise<ApiResponse<UserWatchlist>> {
    return this.request<UserWatchlist>(`/users/${userId}/watchlists`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(watchlistData),
    });
  }

  async updateWatchlist(
    watchlistId: string,
    watchlistData: Partial<UserWatchlist>,
    token: string,
  ): Promise<ApiResponse<UserWatchlist>> {
    return this.request<UserWatchlist>(`/watchlists/${watchlistId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(watchlistData),
    });
  }

  async deleteWatchlist(
    watchlistId: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/watchlists/${watchlistId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Alerts methods
  async getUserAlerts(
    userId: string,
    token: string,
    page = 1,
    limit = 20,
  ): Promise<ApiResponse<PaginatedResponse<UserAlert>>> {
    return this.request<PaginatedResponse<UserAlert>>(
      `/users/${userId}/alerts?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  async markAlertAsRead(
    alertId: string,
    token: string,
  ): Promise<ApiResponse<UserAlert>> {
    return this.request<UserAlert>(`/alerts/${alertId}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async deleteAlert(
    alertId: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/alerts/${alertId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Saved insights methods
  async getUserInsights(
    userId: string,
    token: string,
    page = 1,
    limit = 20,
  ): Promise<ApiResponse<PaginatedResponse<UserSavedInsight>>> {
    return this.request<PaginatedResponse<UserSavedInsight>>(
      `/users/${userId}/insights?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  async saveInsight(
    userId: string,
    insightData: Omit<
      UserSavedInsight,
      "id" | "userId" | "likes" | "createdAt" | "updatedAt"
    >,
    token: string,
  ): Promise<ApiResponse<UserSavedInsight>> {
    return this.request<UserSavedInsight>(`/users/${userId}/insights`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(insightData),
    });
  }

  async updateInsight(
    insightId: string,
    insightData: Partial<UserSavedInsight>,
    token: string,
  ): Promise<ApiResponse<UserSavedInsight>> {
    return this.request<UserSavedInsight>(`/insights/${insightId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(insightData),
    });
  }

  async deleteInsight(
    insightId: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/insights/${insightId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Search methods
  async searchUsers(
    query: string,
    token: string,
  ): Promise<ApiResponse<User[]>> {
    return this.request<User[]>(
      `/search/users?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  async searchInsights(
    query: string,
    token: string,
  ): Promise<ApiResponse<UserSavedInsight[]>> {
    return this.request<UserSavedInsight[]>(
      `/search/insights?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }
}

// Create and export singleton instance
export const databaseService = new DatabaseService();

// Mock data service for development (until MCP database is connected)
export class MockDatabaseService {
  private users: Map<string, User> = new Map();
  private currentUserId: string | null = null;

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockUser: User = {
      id: "user-1",
      email: "demo@moodmeter.com",
      username: "demo_user",
      firstName: "Demo",
      lastName: "User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      bio: "MoodMeter enthusiast tracking market sentiment trends",
      location: "San Francisco, CA",
      website: "https://demo.moodmeter.com",
      isVerified: true,
      isPremium: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        id: "pref-1",
        userId: "user-1",
        defaultRegion: "GLOBAL",
        defaultTopics: ["technology", "finance"],
        realTimeUpdates: true,
        darkMode: false,
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        alertThreshold: 75,
        profileVisibility: "public",
        showStatsPublicly: true,
        dataSharing: false,
        updatedAt: new Date(),
      },
      stats: {
        id: "stats-1",
        userId: "user-1",
        totalLogins: 45,
        totalPredictions: 23,
        accurateePredictions: 18,
        accuracyRate: 78.3,
        currentStreak: 5,
        longestStreak: 12,
        totalPointsEarned: 1250,
        badgesEarned: ["early_adopter", "accurate_predictor", "trend_spotter"],
        lastPredictionAt: new Date(),
        updatedAt: new Date(),
      },
    };

    this.users.set(mockUser.id, mockUser);
  }

  async mockLogin(
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthResponse>> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);

    if (!user || password !== "demo123") {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    this.currentUserId = user.id;

    return {
      success: true,
      data: {
        user,
        token: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    };
  }

  async mockSignup(userData: SignupData): Promise<ApiResponse<AuthResponse>> {
    const existingUser = Array.from(this.users.values()).find(
      (u) => u.email === userData.email,
    );

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isVerified: false,
      isPremium: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        id: `pref-${Date.now()}`,
        userId: `user-${Date.now()}`,
        defaultRegion: "GLOBAL",
        defaultTopics: [],
        realTimeUpdates: true,
        darkMode: false,
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        alertThreshold: 70,
        profileVisibility: "public",
        showStatsPublicly: true,
        dataSharing: false,
        updatedAt: new Date(),
      },
      stats: {
        id: `stats-${Date.now()}`,
        userId: `user-${Date.now()}`,
        totalLogins: 1,
        totalPredictions: 0,
        accurateePredictions: 0,
        accuracyRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalPointsEarned: 0,
        badgesEarned: ["new_member"],
        updatedAt: new Date(),
      },
    };

    this.users.set(newUser.id, newUser);
    this.currentUserId = newUser.id;

    return {
      success: true,
      data: {
        user: newUser,
        token: "mock-jwt-token-new",
        refreshToken: "mock-refresh-token-new",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    };
  }

  getCurrentUser(): User | null {
    return this.currentUserId
      ? this.users.get(this.currentUserId) || null
      : null;
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }

  logout(): void {
    this.currentUserId = null;
  }
}

// Export mock service for development
export const mockDatabaseService = new MockDatabaseService();
