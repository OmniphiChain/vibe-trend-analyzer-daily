import React, { useState } from 'react';
import { Heart, MessageSquare, MoreHorizontal, Reply, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface CommentData {
  id: string;
  user: {
    id: string;
    username: string;
    handle: string;
    avatar: string;
    verified?: boolean;
    credibilityScore?: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: CommentData[];
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
  tickers?: string[];
}

interface CommentThreadViewProps {
  postId: string;
  comments: CommentData[];
  onAddComment: (postId: string, content: string, parentCommentId?: string, selectedSentiment?: 'Bullish' | 'Neutral' | 'Bearish') => void;
  onLikeComment: (commentId: string) => void;
  onReplyToComment: (commentId: string, content: string) => void;
  className?: string;
}

interface CommentItemProps {
  comment: CommentData;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  depth?: number;
  postId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onLike, 
  onReply, 
  depth = 0,
  postId 
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyBox(false);
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'Bullish': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Bearish': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Neutral': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return '';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'Bullish': return <TrendingUp className="w-3 h-3" />;
      case 'Bearish': return <TrendingDown className="w-3 h-3" />;
      default: return null;
    }
  };

  const renderContent = (content: string) => {
    // Enhanced ticker detection and emoji support
    const parts = content.split(/(\$[A-Z]{1,5}|\p{Emoji})/gu);
    
    return parts.map((part, index) => {
      if (part.match(/^\$[A-Z]{1,5}$/)) {
        return (
          <span
            key={index}
            className="text-cyan-400 font-semibold hover:text-cyan-300 cursor-pointer transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </span>
        );
      } else if (part.match(/\p{Emoji}/u)) {
        return (
          <span key={index} className="animate-pulse hover:scale-110 transition-transform inline-block">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div 
      className={cn(
        "relative group transition-all duration-200",
        depth > 0 && "ml-8 border-l border-slate-600/30 pl-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection line for nested replies */}
      {depth > 0 && (
        <div className="absolute -left-0 top-6 w-4 h-px bg-slate-600/30" />
      )}
      
      <div className={cn(
        "bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/30 p-4 transition-all duration-200",
        isHovered && "bg-slate-800/60 border-slate-600/50 shadow-lg shadow-purple-500/5",
        depth > 0 && "bg-slate-800/20"
      )}>
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 ring-1 ring-slate-600/30">
            <AvatarImage src={comment.user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
              {comment.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-200 text-sm">
                {comment.user.username}
              </span>
              <span className="text-slate-400 text-xs">{comment.user.handle}</span>
              {comment.user.verified && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 border-blue-500/30">
                  ✓
                </Badge>
              )}
              {comment.user.credibilityScore && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-purple-500/30 text-purple-400">
                  {comment.user.credibilityScore}
                </Badge>
              )}
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-500 text-xs">{comment.timestamp}</span>
              {comment.sentiment && (
                <Badge className={cn("text-xs px-1.5 py-0.5 border", getSentimentColor(comment.sentiment))}>
                  {getSentimentIcon(comment.sentiment)}
                  {comment.sentiment}
                </Badge>
              )}
            </div>

            {/* Comment Content */}
            <div className="text-slate-300 text-sm leading-relaxed">
              {renderContent(comment.content)}
            </div>

            {/* Ticker tags */}
            {comment.tickers && comment.tickers.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {comment.tickers.map((ticker, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 cursor-pointer transition-colors"
                  >
                    ${ticker}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(comment.id)}
                className={cn(
                  "h-7 px-2 text-xs transition-all duration-200",
                  comment.isLiked 
                    ? "text-pink-400 hover:text-pink-300" 
                    : "text-slate-400 hover:text-pink-400"
                )}
              >
                <Heart className={cn(
                  "w-3 h-3 mr-1 transition-all duration-200",
                  comment.isLiked && "fill-current animate-pulse"
                )} />
                {comment.likes}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="h-7 px-2 text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>

              {/* More options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-slate-400 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                    Report Comment
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                    Share Comment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reply Box */}
            {showReplyBox && (
              <div className="mt-3 space-y-3 p-3 bg-slate-800/60 rounded-lg border border-slate-600/30">
                <Textarea
                  placeholder={`Reply to ${comment.user.username}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 text-sm resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{replyContent.length}/280</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReplyBox(false)}
                      className="h-8 px-3 text-xs text-slate-400 hover:text-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReplySubmit}
                      disabled={!replyContent.trim()}
                      className="h-8 px-3 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Post Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              depth={depth + 1}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentThreadView: React.FC<CommentThreadViewProps> = ({
  postId,
  comments,
  onAddComment,
  onLikeComment,
  onReplyToComment,
  className
}) => {
  const [newComment, setNewComment] = useState('');
  const [composeSentiment, setComposeSentiment] = useState<'Bullish' | 'Neutral' | 'Bearish'>('Neutral');
  const [sortBy, setSortBy] = useState<'Top' | 'Newest' | 'Most Bullish'>('Top');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(postId, newComment, undefined, composeSentiment);
      setNewComment('');
      setComposeSentiment('Neutral');
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'Top':
        return b.likes - a.likes;
      case 'Newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'Most Bullish':
        if (a.sentiment === 'Bullish' && b.sentiment !== 'Bullish') return -1;
        if (b.sentiment === 'Bullish' && a.sentiment !== 'Bullish') return 1;
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // Calculate comment sentiment summary
  const sentimentSummary = comments.reduce((acc, comment) => {
    if (comment.sentiment) acc[comment.sentiment] = (acc[comment.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalComments = comments.length;
  const bullishPercentage = totalComments > 0 ? Math.round((sentimentSummary.Bullish || 0) / totalComments * 100) : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* AI Summary Header */}
      {totalComments > 0 && (
        <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">AI Sentiment Summary</span>
            </div>
            <div className="text-sm text-slate-300">
              <span className="text-purple-300">{totalComments} comments</span> • 
              <span className="text-green-400 ml-1">{bullishPercentage}% Bullish</span> • 
              <span className="text-slate-400 ml-1">Community is {bullishPercentage > 60 ? 'optimistic' : bullishPercentage > 40 ? 'mixed' : 'cautious'}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comment Input */}
      <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/40">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts... Use $TICKER to mention stocks 💭"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sentiment:</span>
                {(['Bearish','Neutral','Bullish'] as const).map(opt => (
                  <Button
                    key={opt}
                    size="sm"
                    variant={composeSentiment === opt ? 'default' : 'ghost'}
                    onClick={() => setComposeSentiment(opt)}
                    className={cn(
                      'h-7 px-3 text-xs',
                      composeSentiment === opt
                        ? opt === 'Bullish' ? 'bg-green-600 text-white hover:bg-green-700'
                        : opt === 'Bearish' ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                    )}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{newComment.length}/500</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewComment('')}
                    className="h-8 px-3 text-xs border-slate-600 text-slate-400 hover:bg-slate-700"
                    disabled={!newComment.trim()}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="h-8 px-4 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      {comments.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          {(['Top', 'Newest', 'Most Bullish'] as const).map((option) => (
            <Button
              key={option}
              variant={sortBy === option ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy(option)}
              className={cn(
                "h-7 px-3 text-xs transition-all duration-200",
                sortBy === option 
                  ? "bg-purple-500 text-white hover:bg-purple-600" 
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
              )}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length > 0 ? (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={onLikeComment}
              onReply={onReplyToComment}
              postId={postId}
            />
          ))
        ) : (
          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/30">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-500 mb-3" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No comments yet</h3>
              <p className="text-slate-400 text-sm">Be the first to share your thoughts on this post!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
