import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, LogIn, LogOut, Settings } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';

interface UserAuthenticationToggleProps {
  onNavigate?: (section: string) => void;
}

export const UserAuthenticationToggle: React.FC<UserAuthenticationToggleProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'JD';
  };

  if (!isAuthenticated) {
    // Show generic person icon when not signed in
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-purple-500/10 rounded-xl group transition-all duration-300"
            >
              <UserCircle className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black/95 backdrop-blur-xl border-purple-500/30 text-white animate-in fade-in-0 zoom-in-95 transition-all duration-300"
          >
            <DropdownMenuItem
              onClick={() => openAuthModal("login")}
              className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer transition-colors duration-200"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openAuthModal("signup")}
              className="hover:bg-pink-500/20 focus:bg-pink-500/20 cursor-pointer transition-colors duration-200"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Sign Up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  // Show user avatar with initials when signed in
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-transparent rounded-full group transition-all duration-300"
        >
          <Avatar className="w-10 h-10 ring-2 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all duration-300">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-black/95 backdrop-blur-xl border-purple-500/30 text-white animate-in fade-in-0 zoom-in-95 transition-all duration-300"
      >
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.username}
          </div>
          <div className="text-xs text-gray-400">{user?.email}</div>
        </div>
        <div className="border-t border-purple-500/20 my-1"></div>
        <DropdownMenuItem
          onClick={() => onNavigate?.('user-profile')}
          className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer transition-colors duration-200"
        >
          <UserCircle className="w-4 h-4 mr-2" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onNavigate?.('user-settings')}
          className="hover:bg-blue-500/20 focus:bg-blue-500/20 cursor-pointer transition-colors duration-200"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <div className="border-t border-purple-500/20 my-1"></div>
        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer transition-colors duration-200 text-red-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
