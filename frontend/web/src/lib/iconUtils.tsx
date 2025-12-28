import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Flame, 
  Heart, 
  Diamond, 
  Rocket, 
  AlertTriangle, 
  Brain, 
  CheckCircle, 
  BarChart3, 
  Target,
  TrendingUp as Bull,
  TrendingDown as Bear,
  Star, 
  Beaker,
  Gamepad2,
  Apple,
  Zap,
  Search,
  Square,
  Globe,
  Calendar,
  FileText,
  BarChart,
  BookOpen,
  Bell,
  Trophy,
  Users,
  Store,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
  Shield,
  Lightbulb,
  CircleDot,
  ExternalLink,
  type LucideIcon
} from "lucide-react";

export interface IconConfig {
  icon: LucideIcon;
  color?: string;
  className?: string;
}

// Emoji to Lucide icon mapping
export const emojiIconMap: Record<string, IconConfig> = {
  // Sentiment & Trading
  '📈': { icon: TrendingUp, color: '#10B981' },
  '📉': { icon: TrendingDown, color: '#EF4444' },
  '😐': { icon: Minus, color: '#6B7280' },
  '🔥': { icon: Flame, color: '#F59E0B' },
  '🚀': { icon: Rocket, color: '#DC2626' },
  '💎': { icon: Diamond, color: '#3B82F6' },
  '❤️': { icon: Heart, color: '#EF4444' },
  '⚠️': { icon: AlertTriangle, color: '#F59E0B' },
  '🧠': { icon: Brain, color: '#8B5CF6' },
  '🎯': { icon: Target, color: '#059669' },
  
  // Status Indicators
  '🟢': { icon: CircleDot, color: '#10B981' },
  '🟡': { icon: CircleDot, color: '#F59E0B' },
  '🔴': { icon: CircleDot, color: '#EF4444' },
  '✅': { icon: CheckCircle, color: '#10B981' },
  '✓': { icon: CheckCircle, color: '#10B981' },
  '✗': { icon: AlertTriangle, color: '#EF4444' },
  
  // Companies/Brands
  '🎮': { icon: Gamepad2, color: '#76D443' },
  '🍎': { icon: Apple, color: '#000000' },
  '⚡': { icon: Zap, color: '#DC2626' },
  '🔍': { icon: Search, color: '#F4F6FA' },
  '🪟': { icon: Square, color: '#0078D4' },
  '📘': { icon: ExternalLink, color: '#1877F2' },
  
  // UI Elements
  '📊': { icon: BarChart3, color: '#3B82F6' },
  '📚': { icon: BookOpen, color: '#7C3AED' },
  '📝': { icon: FileText, color: '#059669' },
  '⭐': { icon: Star, color: '#F59E0B' },
  '🧪': { icon: Beaker, color: '#6B7280' },
  '🐂': { icon: Bull, color: '#059669' },
  '🐻': { icon: Bear, color: '#DC2626' },
  '🌍': { icon: Globe, color: '#0EA5E9' },
  '📅': { icon: Calendar, color: '#6B7280' },
  '📋': { icon: FileText, color: '#6B7280' },
  '🏪': { icon: Store, color: '#7C3AED' },
  '👥': { icon: Users, color: '#6B7280' },
  '💰': { icon: DollarSign, color: '#F59E0B' },
  '📍': { icon: MapPin, color: '#EF4444' },
  '🕒': { icon: Clock, color: '#6B7280' },
  '💼': { icon: Briefcase, color: '#6B7280' },
  '🛑': { icon: Shield, color: '#EF4444' },
  '💡': { icon: Lightbulb, color: '#F59E0B' },
  '🎓': { icon: Trophy, color: '#F59E0B' },
  
  // Emotions
  '😃': { icon: TrendingUp, color: '#10B981' },
  '😡': { icon: TrendingDown, color: '#EF4444' },
  '😰': { icon: AlertTriangle, color: '#F59E0B' },
  '😎': { icon: CheckCircle, color: '#3B82F6' },
  '🤔': { icon: Brain, color: '#6B7280' },
};

export const getIconFromEmoji = (emoji: string): IconConfig => {
  return emojiIconMap[emoji] || { icon: CircleDot, color: '#6B7280' };
};

export const EmojiIcon = ({ 
  emoji, 
  className = "w-4 h-4", 
  fallbackColor 
}: { 
  emoji: string;
  className?: string;
  fallbackColor?: string;
}) => {
  const config = getIconFromEmoji(emoji);
  const Icon = config.icon;
  
  return (
    <Icon 
      className={className} 
      style={{ 
        color: fallbackColor || config.color 
      }} 
    />
  );
};

export const IconText = ({
  value,
  className = "w-4 h-4",
  textClassName,
}: {
  value: string;
  className?: string;
  textClassName?: string;
}) => {
  const mapping = emojiIconMap[value];
  if (mapping) {
    const Icon = mapping.icon;
    return <Icon className={className} style={{ color: mapping.color }} />;
  }
  if (value && value.indexOf('�') !== -1) {
    return <CircleDot className={className} />;
  }
  return <span className={textClassName}>{value}</span>;
};
