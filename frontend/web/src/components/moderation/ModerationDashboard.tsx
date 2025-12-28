import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Flag,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Users,
  MessageSquare,
  Zap,
  TrendingUp,
  TrendingDown,
  Filter,
  Eye,
  Ban,
  Archive,
  RefreshCw,
} from "lucide-react";
import type { 
  ModerationQueueItem, 
  ModerationStats, 
  FlagReasonType,
  ModerationStatus 
} from "@/types/moderation";

// Mock data for demonstration
const mockModerationStats: ModerationStats = {
  totalFlags: 127,
  pendingReviews: 23,
  resolvedToday: 45,
  spamDetected: 12,
  usersBanned: 3,
  postsRemoved: 18,
  queueBreakdown: {
    spam: 45,
    misinformation: 23,
    harassment: 18,
    inappropriate_content: 15,
    scam: 12,
    hate_speech: 8,
    off_topic: 4,
    duplicate: 2,
    self_promotion: 0,
    other: 0,
  },
  averageResponseTime: 24,
  urgentItemsCount: 5,
  periodChange: {
    flags: 12,
    spam: 8,
    resolutions: 15,
  },
  generatedAt: new Date(),
};

const mockQueueItems: ModerationQueueItem[] = [
  {
    id: "queue-1",
    type: "flagged_post",
    priority: "high",
    postId: "post-123",
    flags: [
      {
        id: "flag-1",
        postId: "post-123",
        reporterId: "user-456",
        reporterUsername: "SafetyFirst",
        reason: "misinformation",
        description: "This post contains false information about market predictions",
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ],
    totalFlags: 3,
    uniqueReporters: 3,
    aiSpamScore: 0.15,
    aiRiskLevel: "medium",
    aiTags: ["misinformation", "unverified"],
    status: "pending",
    firstFlaggedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lastFlaggedAt: new Date(Date.now() - 30 * 60 * 1000),
    reviewDeadline: new Date(Date.now() + 20 * 60 * 60 * 1000),
  },
  {
    id: "queue-2",
    type: "spam_detection",
    priority: "urgent",
    postId: "post-456",
    flags: [],
    totalFlags: 0,
    uniqueReporters: 0,
    aiSpamScore: 0.92,
    aiRiskLevel: "high",
    aiTags: ["spam", "promotional", "duplicate"],
    status: "pending",
    firstFlaggedAt: new Date(Date.now() - 15 * 60 * 1000),
    lastFlaggedAt: new Date(Date.now() - 15 * 60 * 1000),
    autoHiddenAt: new Date(Date.now() - 15 * 60 * 1000),
  },
];

interface ModerationDashboardProps {
  className?: string;
}

export const ModerationDashboard: React.FC<ModerationDashboardProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [stats, setStats] = useState<ModerationStats>(mockModerationStats);
  const [queueItems, setQueueItems] = useState<ModerationQueueItem[]>(mockQueueItems);
  const [selectedStatus, setSelectedStatus] = useState<ModerationStatus | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const getStatusColor = (status: ModerationStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flagged_post":
        return <Flag className="w-4 h-4" />;
      case "spam_detection":
        return <Zap className="w-4 h-4" />;
      case "user_report":
        return <Users className="w-4 h-4" />;
      case "ai_alert":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const filteredItems = queueItems.filter(item => {
    const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
    const priorityMatch = selectedPriority === "all" || item.priority === selectedPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-bold",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            Moderation Dashboard
          </h1>
          <p className={cn(
            "text-sm mt-1",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
          )}>
            Monitor and manage community content
          </p>
        </div>
        
        <Button 
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.spamDetected}</p>
                <p className="text-sm text-muted-foreground">Spam Detected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.resolvedToday}</p>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.averageResponseTime}m</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Moderation Queue</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="ml-auto text-sm text-muted-foreground">
                  Showing {filteredItems.length} of {queueItems.length} items
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queue Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Moderation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="capitalize text-sm">
                            {item.type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate">
                            Post ID: {item.postId}
                          </p>
                          {item.aiTags && item.aiTags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {item.aiTags.slice(0, 2).map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.totalFlags > 0 && (
                            <Badge variant="outline">
                              {item.totalFlags} flags
                            </Badge>
                          )}
                          {item.aiSpamScore && item.aiSpamScore > 0.5 && (
                            <Badge variant="destructive" className="text-xs">
                              AI: {Math.round(item.aiSpamScore * 100)}%
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimeAgo(item.firstFlaggedAt)}
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="w-4 h-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flag Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Flag Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.queueBreakdown)
                    .filter(([_, count]) => count > 0)
                    .sort(([_, a], [__, b]) => b - a)
                    .map(([reason, count]) => (
                      <div key={reason} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{reason.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-2 rounded-full bg-blue-500",
                            `w-${Math.max(8, Math.min(32, Math.round((count / stats.totalFlags) * 32)))}`
                          )} />
                          <span className="text-sm font-mono w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Response Time</span>
                    <span className="text-sm font-mono">{stats.averageResponseTime}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Actions Today</span>
                    <span className="text-sm font-mono">{stats.resolvedToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Users Banned</span>
                    <span className="text-sm font-mono">{stats.usersBanned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Posts Removed</span>
                    <span className="text-sm font-mono">{stats.postsRemoved}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure automatic moderation and thresholds
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Settings panel would be implemented here with controls for:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Auto-hide threshold (currently: 3 flags)</li>
                <li>AI spam detection sensitivity</li>
                <li>Notification preferences</li>
                <li>Blocked keywords and domains</li>
                <li>Escalation rules</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationDashboard;
