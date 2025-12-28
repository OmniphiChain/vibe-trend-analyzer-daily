import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  AlertTriangle,
  Ban,
  Eye,
  Flag,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  Users,
  MessageSquare,
  Zap,
} from "lucide-react";

interface ModerationAlert {
  id: string;
  type: "spam" | "inappropriate" | "rug_pull" | "harassment";
  content: string;
  user: string;
  channel: string;
  timestamp: Date;
  status: "pending" | "approved" | "removed";
  reports: number;
}

interface SpamFilter {
  keyword: string;
  severity: "low" | "medium" | "high";
  action: "flag" | "auto_remove" | "shadow_ban";
}

export const ModerationTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"alerts" | "filters" | "stats">(
    "alerts",
  );

  // Mock moderation alerts
  const moderationAlerts: ModerationAlert[] = [
    {
      id: "1",
      type: "rug_pull",
      content:
        "🚀🚀 NEW TOKEN MOONSHOT!!! 1000X GUARANTEED! Buy $SCAMCOIN now before it's too late! Limited time offer!",
      user: "ScammerBot123",
      channel: "$BTC",
      timestamp: new Date(Date.now() - 300000),
      status: "pending",
      reports: 5,
    },
    {
      id: "2",
      type: "spam",
      content: "Check out my OnlyFans link in bio! Hot crypto girls! 🔥💋",
      user: "SpamAccount",
      channel: "$ETH",
      timestamp: new Date(Date.now() - 600000),
      status: "pending",
      reports: 3,
    },
    {
      id: "3",
      type: "inappropriate",
      content:
        "All you idiots buying ETH are going to lose everything. You're all stupid and deserve to be poor.",
      user: "ToxicTrader",
      channel: "$ETH",
      timestamp: new Date(Date.now() - 900000),
      status: "pending",
      reports: 7,
    },
  ];

  // Mock spam filters
  const spamFilters: SpamFilter[] = [
    { keyword: "moonshot", severity: "high", action: "flag" },
    { keyword: "guaranteed", severity: "high", action: "auto_remove" },
    { keyword: "1000x", severity: "high", action: "auto_remove" },
    { keyword: "limited time", severity: "medium", action: "flag" },
    { keyword: "onlyfans", severity: "high", action: "auto_remove" },
    { keyword: "hot girls", severity: "high", action: "auto_remove" },
    { keyword: "check bio", severity: "medium", action: "flag" },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "rug_pull":
        return <Zap className="w-4 h-4 text-red-500" />;
      case "spam":
        return <Flag className="w-4 h-4 text-yellow-500" />;
      case "inappropriate":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "harassment":
        return <Ban className="w-4 h-4 text-red-600" />;
      default:
        return <Flag className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "rug_pull":
        return "bg-red-100 text-red-800 border-red-200";
      case "spam":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inappropriate":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "harassment":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "auto_remove":
        return "bg-red-100 text-red-800";
      case "shadow_ban":
        return "bg-orange-100 text-orange-800";
      case "flag":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleModerationAction = (
    alertId: string,
    action: "approve" | "remove",
  ) => {
    console.log(`${action} alert ${alertId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            Moderation Center
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Community safety and content moderation tools
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {moderationAlerts.filter((a) => a.status === "pending").length}{" "}
            pending
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "alerts"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <AlertTriangle className="w-4 h-4 mr-2 inline" />
          Alerts (
          {moderationAlerts.filter((a) => a.status === "pending").length})
        </button>
        <button
          onClick={() => setActiveTab("filters")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "filters"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Shield className="w-4 h-4 mr-2 inline" />
          Filters ({spamFilters.length})
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "stats"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="w-4 h-4 mr-2 inline" />
          Statistics
        </button>
      </div>

      {/* Content */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search alerts..." className="pl-10" />
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>

          {moderationAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <Badge className={getAlertColor(alert.type)}>
                      {alert.type.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      in #{alert.channel}
                    </span>
                    <span className="text-sm text-gray-500">
                      by @{alert.user}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Flag className="w-3 h-3 mr-1" />
                      {alert.reports} reports
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "{alert.content}"
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Automatic detection: {alert.type} pattern matched
                  </div>

                  {alert.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleModerationAction(alert.id, "approve")
                        }
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleModerationAction(alert.id, "remove")
                        }
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "filters" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Spam Filters</h3>
            <Button size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Add Filter
            </Button>
          </div>

          <div className="grid gap-4">
            {spamFilters.map((filter, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        "{filter.keyword}"
                      </code>
                      <Badge className={getSeverityColor(filter.severity)}>
                        {filter.severity}
                      </Badge>
                      <Badge className={getActionColor(filter.action)}>
                        {filter.action.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Today's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Reports:</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Auto-Removed:</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Manual Review:</span>
                  <span className="font-semibold">16</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-blue-500" />
                Filter Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Filters Active:</span>
                  <span className="font-semibold">{spamFilters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accuracy:</span>
                  <span className="font-semibold text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    False Positives:
                  </span>
                  <span className="font-semibold">5.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-500" />
                Community Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Users:</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Banned Users:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Health Score:</span>
                  <span className="font-semibold text-green-600">98.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
