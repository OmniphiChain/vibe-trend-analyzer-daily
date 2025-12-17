import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { MoodThemeProvider, useMoodTheme } from "@/contexts/MoodThemeContext";
import { cn } from "@/lib/utils";

import { Dashboard } from "@/components/Dashboard";
import { MarketMoodPage } from "@/components/MarketMoodPage";
import { StockScreener } from "@/components/StockScreener";
import { SentimentDashboard } from "@/components/SentimentDashboard";
import { Analytics } from "@/components/Analytics";
import { HistoricalData } from "@/components/HistoricalData";
import { CommunityWithSubtabs } from "@/components/CommunityWithSubtabs";
import { ResponsiveModernHeader } from "@/components/ResponsiveModernHeader";
import { CommunityRooms } from "@/components/social/CommunityRooms";
import { Watchlist } from "@/components/Watchlist";
import { Settings } from "@/components/Settings";
import { UserProfile } from "@/components/profile/UserProfile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DatabaseDemo } from "@/components/DatabaseDemo";
import { SocialPlatform } from "@/components/social/SocialPlatform";
import { MoorMeterDashboard } from "@/components/MoorMeterDashboard";
import { BuilderDemo } from "@/components/BuilderDemo";

import { ApiStatusIndicator } from "@/components/ApiStatusIndicator";
import { CryptoDashboard } from "@/components/crypto/CryptoDashboard";
import { PulseOfTheChain } from "@/components/crypto/PulseOfTheChain";
import { NeonSenseCryptoDashboard } from "@/components/crypto/NeonSenseCryptoDashboard";
import { AdvancedTradingChart } from "@/components/finance/AdvancedTradingChart";
import { EarningsCalendar } from "@/components/finance/EarningsCalendar";
import TrendingHub from "@/components/finance/TrendingHub";
import TradeJournalClassic from "@/components/TradeJournalClassic";
import CommunitySentimentPolls from "@/components/CommunitySentimentPolls";

import { NLPSentimentDemo } from "@/components/NLPSentimentDemo";
import { SpacyNLPDemo } from "@/components/SpacyNLPDemo";
import { MoodGptWidget } from "@/components/chat/MoodGptWidget";
import { FinnhubDemo } from "@/components/FinnhubDemo";
import { StockSentimentScoring } from "@/components/StockSentimentScoring";
import { AiSentimentExplainer } from "@/components/AiSentimentExplainer";
import { FuturisticChatDemo } from "@/components/chat/FuturisticChatDemo";
import { YFinanceDemo } from "@/components/YFinanceDemo";
import { MoodThemeDemo } from "@/components/MoodThemeDemo";
import DynamicThemeSelectorDemo from "@/components/DynamicThemeSelectorDemo";

import { BuilderFinanceDemo } from "@/components/BuilderFinanceDemo";
import { FuturisticHomepage } from "@/components/FuturisticHomepage";
import { UnifiedRoomsDemo } from "@/components/UnifiedRoomsDemo";
import SettingsPage from "@/components/user/SettingsPage";
import ViewProfilePage from "@/components/user/ViewProfilePage";
import MoorMeterMembershipPage from "@/components/membership/MoorMeterMembershipPage";
import MembershipPageSummary from "@/components/examples/MembershipPageSummary";
import { ModerationDemo } from "@/components/ModerationDemo";
import { BadgeSystemDemo } from "@/components/BadgeSystemDemo";
import { SpaceSwitcherWidget } from "@/components/community/SpaceSwitcherWidget";
import { PrivateRoomsContainer } from "@/components/privateRooms/PrivateRoomsContainer";
import { ChatInterface } from "@/components/moorMeter/ChatInterface";
import { ModerationTestingDashboard } from "@/components/testing/ModerationTestingDashboard";
import { PluginMarketplacePage } from "@/components/PluginMarketplacePage";
import { DeveloperSubmissionPage } from "@/components/plugins/DeveloperSubmissionPage";
import { CredibilityAnalyticsDashboard } from "@/components/credibility/CredibilityAnalyticsDashboard";
import { AdminCredibilityDashboard } from "@/components/credibility/AdminCredibilityDashboard";
import { TradeHub } from "@/components/TradeHub";
import { TraderProfile } from "@/components/profile/TraderProfile";
import { ChatSubcategory } from "@/components/social/ChatSubcategory";
import { Footer } from "@/components/Footer";
import SmartNewsFeedPage from "@/components/SmartNewsFeedPage";
import { RoomDetailPanelDemo } from "@/components/examples/RoomDetailPanelDemo";
import { BuilderChatRoom } from "@/components/rooms/BuilderChatRoom";
import { EnhancedSentimentFeed } from "@/components/EnhancedSentimentFeed";
import AboutUsPage from "@/components/company/AboutUsPage";
import BlogPage from "@/components/company/BlogPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const [activeSection, setActiveSection] = useState("futuristic-home");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { bodyGradient } = useMoodTheme();

  // Enhanced navigation handler to support user profile navigation
  const handleNavigation = (section: string, userId?: string) => {
    setActiveSection(section);
    if (userId) {
      setCurrentUserId(userId);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "sentiment":
        return <BuilderDemo />;
      case "analytics":
        return <Analytics />;
      // Removed "history" route - HistoricalData component retained for potential reuse
            case "community":
        return <CommunityWithSubtabs onNavigateToProfile={(userId) => handleNavigation("trader-profile", userId)} />;
      case "space":
        return <SpaceSwitcherWidget onNavigateToProfile={(userId) => handleNavigation("trader-profile", userId)} />;
      case "rooms":
        return <PrivateRoomsContainer />;
      case "chat":
        return <ChatSubcategory onNavigateToProfile={(userId) => handleNavigation("trader-profile", userId)} />;
      case "profile":
        return (
          <ProtectedRoute
            fallbackTitle="Profile Access Required"
            fallbackDescription="Please sign in to view and manage your profile."
          >
            <UserProfile />
          </ProtectedRoute>
        );
      case "settings":
        return (
          <ProtectedRoute
            fallbackTitle="Settings Access Required"
            fallbackDescription="Please sign in to access your settings."
          >
            <SettingsPage onNavigate={setActiveSection} />
          </ProtectedRoute>
        );
      case "user-settings":
        return (
          <ProtectedRoute
            fallbackTitle="Settings Access Required"
            fallbackDescription="Please sign in to access your settings."
          >
            <SettingsPage onNavigate={setActiveSection} />
          </ProtectedRoute>
        );
      case "user-profile":
        return (
          <ProtectedRoute
            fallbackTitle="Profile Access Required"
            fallbackDescription="Please sign in to view your profile."
          >
            <TraderProfile
              isCurrentUser={true}
            />
          </ProtectedRoute>
        );
      case "database":
        return <DatabaseDemo />;
      case "social":
        return <SocialPlatform />;
      case "crypto-dashboard":
        return <NeonSenseCryptoDashboard />;
      case "nlp":
        return <NLPSentimentDemo />;
      case "spacy-nlp":
        return <SpacyNLPDemo />;
      case "finnhub":
        return <FinnhubDemo />;
      // Removed "sentiment-scoring" route - StockSentimentScoring component retained for backend sentiment utilities
      case "ai-analysis":
        return <AiSentimentExplainer />;
            case "yfinance":
        return <YFinanceDemo />;
      case "theme-demo":
        return <DynamicThemeSelectorDemo />;
      case "membership":
        return <MoorMeterMembershipPage />;
      case "membership-demo":
        return <MembershipPageSummary />;
      case "moderation":
        return <ModerationDemo onNavigate={setActiveSection} />;
      case "moderation-testing":
        return <ModerationTestingDashboard />;
      case "badges":
        return <BadgeSystemDemo />;
            // Removed "builder-finance" route - BuilderFinanceDemo component retained for Builder.io integration examples
      case "futuristic-home":
        return <FuturisticHomepage onNavigate={setActiveSection} />;
      case "moorMeter":
        return <MoorMeterDashboard />;
      case "plugins":
        return <PluginMarketplacePage onNavigate={setActiveSection} />;
      case "plugin-submission":
        return <DeveloperSubmissionPage onNavigate={setActiveSection} />;
      case "credibility-analytics":
        return <CredibilityAnalyticsDashboard />;
      case "admin-credibility":
        return <AdminCredibilityDashboard />;
      case "tradehub":
        return <TradeHub onNavigate={setActiveSection} />;
      case "market-mood":
        return <MarketMoodPage />;
      case "news-feed":
        return <Analytics />;
      case "smart-news-feed":
        return <SmartNewsFeedPage />;
      case "trader-profile":
        return (
          <ProtectedRoute
            fallbackTitle="Trader Profile Access"
            fallbackDescription="Please sign in to view trader profiles and trading insights."
          >
            <TraderProfile
              userId={currentUserId || undefined}
              isCurrentUser={currentUserId === null}
              onNavigateBack={() => handleNavigation("community")}
            />
          </ProtectedRoute>
        );
      case "enhanced-chat":
        return (
          <ProtectedRoute
            fallbackTitle="Enhanced Chat Access"
            fallbackDescription="Please sign in to access the enhanced community chat with credibility features."
          >
            <ChatSubcategory />
          </ProtectedRoute>
        );
      case "futuristic-chat":
        return <FuturisticChatDemo />;
      case "unified-rooms":
        return <UnifiedRoomsDemo />;
      case "room-detail-demo":
        return <RoomDetailPanelDemo />;
      case "builder-chat-room":
        return <BuilderChatRoom onBack={() => setActiveSection("community")} />;
      case "enhanced-sentiment-feed":
        return <EnhancedSentimentFeed onNavigateToProfile={(userId) => handleNavigation("trader-profile", userId)} />;

      // Company
      case "about":
        return <AboutUsPage />;
      case "blog":
        return <BlogPage />;

      // Finance Section Routes
      case "finance":
        return <FuturisticHomepage onNavigate={setActiveSection} initialSection="finance" />;
      case "watchlist":
        return <Watchlist />;
      case "market":
        return <Analytics />;
      case "screener":
        return <StockScreener />;
      case "crypto":
        return <PulseOfTheChain />;
      case "earnings":
        return <EarningsCalendar />;
      case "trading-chart":
        return <AdvancedTradingChart onNavigate={handleNavigation} />;
      case "trending":
        return <TrendingHub />;
      case "trade-journal":
        return <TradeJournalClassic />;
      case "sentiment-polls":
        return <CommunitySentimentPolls />;

      default:
        return <FuturisticHomepage onNavigate={setActiveSection} />;
    }
  };

  const isChartPage = activeSection === "trading-chart";
  const { themeMode } = useMoodTheme();
  const isDayMode = themeMode === 'light';

  // Comprehensive body classes with day mode support
  const getBodyClasses = () => {
    if (isChartPage) return "ns-page";

    const baseClasses = "min-h-screen transition-all duration-500";
    const backgroundClasses = isDayMode ? "bg-[#FFFFFF] day-mode-container" : bodyGradient;
    const modeClasses = isDayMode ? "day-mode" : "";

    return `${baseClasses} ${backgroundClasses} ${modeClasses}`;
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div
        className={cn(getBodyClasses())}
        data-theme={themeMode}
      >
        {!isChartPage && (
          <ResponsiveModernHeader
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onNavigate={handleNavigation}
            currentMoodScore={75}
          />
        )}
        <main className={isChartPage ? "ns-main" : ""}>{renderContent()}</main>
        <Footer
          onNavigate={setActiveSection}
          compact={["trading-chart", "crypto"].includes(activeSection)}
          className={isChartPage ? "ns-footer" : ""}
        />
        <ApiStatusIndicator />
        <MoodGptWidget />
      </div>
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MoodThemeProvider>
          <AppContent />
        </MoodThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
