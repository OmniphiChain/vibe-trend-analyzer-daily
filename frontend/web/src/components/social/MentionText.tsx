import React from "react";
import { Badge } from "@/components/ui/badge";
import { getUserIdFromUsername } from "@/utils/profileNavigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MentionTextProps {
  text: string;
  onUserClick?: (userId: string) => void;
  onTickerClick?: (symbol: string) => void;
  onHashtagClick?: (hashtag: string) => void;
  className?: string;
  enableMentions?: boolean;
  enableTickers?: boolean;
  enableHashtags?: boolean;
}

/**
 * Component that parses text for @mentions, $tickers, and #hashtags and makes them clickable
 */
export const MentionText: React.FC<MentionTextProps> = ({ 
  text, 
  onUserClick,
  onTickerClick,
  onHashtagClick,
  className = "",
  enableMentions = true,
  enableTickers = true,
  enableHashtags = true,
}) => {
  const parseText = (text: string): (string | JSX.Element)[] => {
    // Combined regex for mentions, tickers, and hashtags
    const patterns = [];
    if (enableMentions) patterns.push("@(\\w+)");
    if (enableTickers) patterns.push("\\$(\\w+)");
    if (enableHashtags) patterns.push("#(\\w+)");
    
    if (patterns.length === 0) return [text];
    
    const combinedRegex = new RegExp(`(${patterns.join("|")})`, "g");
    const parts = text.split(combinedRegex);
    
    return parts.map((part, index) => {
      if (!part) return "";
      
      // Check for mention (@username)
      if (enableMentions && part.startsWith("@") && part.length > 1) {
        const username = part.slice(1);
        const userId = getUserIdFromUsername(username);
        
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors hover:underline"
                  onClick={() => onUserClick?.(userId)}
                >
                  @{username}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View @{username}'s profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      // Check for ticker ($SYMBOL)
      if (enableTickers && part.startsWith("$") && part.length > 1) {
        const symbol = part.slice(1).toUpperCase();
        
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md font-semibold hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors text-sm"
                  onClick={() => onTickerClick?.(symbol)}
                >
                  ${symbol}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View ${symbol} details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      // Check for hashtag (#topic)
      if (enableHashtags && part.startsWith("#") && part.length > 1) {
        const hashtag = part.slice(1);
        
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors hover:underline"
                  onClick={() => onHashtagClick?.(hashtag)}
                >
                  #{hashtag}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View #{hashtag} posts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      return part;
    });
  };

  return (
    <span className={className}>
      {parseText(text)}
    </span>
  );
};

/**
 * Simple mention parser for when you only need @mentions
 */
export const MentionOnlyText: React.FC<{
  text: string;
  onUserClick?: (userId: string) => void;
  className?: string;
}> = ({ text, onUserClick, className }) => {
  return (
    <MentionText
      text={text}
      onUserClick={onUserClick}
      className={className}
      enableTickers={false}
      enableHashtags={false}
    />
  );
};

/**
 * Full-featured text parser with all features
 */
export const RichText: React.FC<MentionTextProps> = (props) => {
  return <MentionText {...props} />;
};

export default MentionText;
