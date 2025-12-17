import React, { createContext, useContext, ReactNode } from "react";
import { navigateToUserProfile, navigateToOwnProfile } from "@/utils/profileNavigation";

interface ProfileNavigationContextType {
  navigateToProfile: (userId: string) => void;
  navigateToOwnProfile: () => void;
  navigateToTicker: (symbol: string) => void;
  navigateToHashtag: (hashtag: string) => void;
  handleFollow: (userId: string) => void;
  handleUnfollow: (userId: string) => void;
  handleToggleAlerts: (userId: string) => void;
}

const ProfileNavigationContext = createContext<ProfileNavigationContextType | null>(null);

interface ProfileNavigationProviderProps {
  children: ReactNode;
  onNavigate: (section: string, userId?: string) => void;
  onTickerClick?: (symbol: string) => void;
  onHashtagClick?: (hashtag: string) => void;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onToggleAlerts?: (userId: string) => void;
}

export const ProfileNavigationProvider: React.FC<ProfileNavigationProviderProps> = ({
  children,
  onNavigate,
  onTickerClick,
  onHashtagClick,
  onFollow,
  onUnfollow,
  onToggleAlerts,
}) => {
  const navigateToProfile = (userId: string) => {
    navigateToUserProfile(onNavigate, userId);
  };

  const navigateToOwnProfile = () => {
    navigateToOwnProfile(onNavigate);
  };

  const navigateToTicker = (symbol: string) => {
    onTickerClick?.(symbol);
    console.log(`Navigate to ticker: ${symbol}`);
  };

  const navigateToHashtag = (hashtag: string) => {
    onHashtagClick?.(hashtag);
    console.log(`Navigate to hashtag: ${hashtag}`);
  };

  const handleFollow = (userId: string) => {
    onFollow?.(userId);
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    onUnfollow?.(userId);
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string) => {
    onToggleAlerts?.(userId);
    console.log(`Toggling alerts for user: ${userId}`);
  };

  const contextValue: ProfileNavigationContextType = {
    navigateToProfile,
    navigateToOwnProfile,
    navigateToTicker,
    navigateToHashtag,
    handleFollow,
    handleUnfollow,
    handleToggleAlerts,
  };

  return (
    <ProfileNavigationContext.Provider value={contextValue}>
      {children}
    </ProfileNavigationContext.Provider>
  );
};

export const useProfileNavigation = (): ProfileNavigationContextType => {
  const context = useContext(ProfileNavigationContext);
  if (!context) {
    throw new Error("useProfileNavigation must be used within a ProfileNavigationProvider");
  }
  return context;
};

export default ProfileNavigationProvider;
