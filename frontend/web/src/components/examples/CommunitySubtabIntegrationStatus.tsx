import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Home, 
  Settings,
  ArrowRight
} from "lucide-react";

interface CommunitySubtabIntegrationStatusProps {
  onNavigateToSubtab?: (subtab: string) => void;
}

export const CommunitySubtabIntegrationStatus: React.FC<CommunitySubtabIntegrationStatusProps> = ({
  onNavigateToSubtab
}) => {
  const subtabs = [
    {
      name: "Community Hub",
      key: "community",
      icon: <Users className="h-5 w-5" />,
      status: "completed",
      description: "Main community feed with posts and comments",
      features: [
        "✅ PostCard with profile navigation",
        "✅ User avatars are clickable", 
        "✅ @mentions link to profiles",
        "✅ Hover previews enabled",
        "✅ Follow/unfollow actions"
      ],
      components: ["PostCard", "UserAvatar", "UsernameLink", "MentionText"]
    },
    {
      name: "Live Chat",
      key: "chat", 
      icon: <MessageSquare className="h-5 w-5" />,
      status: "partial",
      description: "Real-time chat with enhanced community messages",
      features: [
        "🔄 Imports added - needs component replacement",
        "❌ Still using old Avatar components",
        "❌ Usernames not clickable yet",
        "❌ @mentions not parsed",
        "❌ No hover previews"
      ],
      components: ["EnhancedCommunityMessage", "PostInteractionBar"],
      needsWork: [
        "Replace Avatar with UserAvatar",
        "Replace username text with UsernameLink", 
        "Wrap message content with MentionText",
        "Add ProfileNavigationProvider wrapper"
      ]
    },
    {
      name: "Trading Rooms",
      key: "rooms",
      icon: <Home className="h-5 w-5" />,
      status: "partial",
      description: "Trading discussion rooms with participant lists",
      features: [
        "🔄 Imports added - needs component replacement",
        "❌ Still using old Avatar components",
        "❌ Participant list not clickable",
        "❌ Room messages need enhancement",
        "❌ No profile navigation"
      ],
      components: ["CommunityRooms", "EnhancedCommunityMessage"],
      needsWork: [
        "Replace all Avatar with UserAvatar",
        "Replace usernames with UsernameLink",
        "Parse chat messages with MentionText", 
        "Add participant click handlers"
      ]
    },
    {
      name: "Space (Voice Chat)",
      key: "space",
      icon: <Settings className="h-5 w-5" />,
      status: "partial", 
      description: "Voice chat rooms with speaker cards",
      features: [
        "🔄 Imports added - needs component replacement",
        "❌ Speaker cards use old avatars",
        "❌ Participant lists not clickable",
        "❌ No profile previews",
        "❌ Chat messages need parsing"
      ],
      components: ["SpaceSwitcherWidget"],
      needsWork: [
        "Replace speaker Avatar with UserAvatar",
        "Make speaker names clickable with UsernameLink",
        "Parse voice chat messages with MentionText",
        "Add voice participant profile navigation"
      ]
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20",
          label: "Complete"
        };
      case "partial":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20", 
          label: "In Progress"
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20",
          label: "Not Started"
        };
    }
  };

  const completedCount = subtabs.filter(s => s.status === "completed").length;
  const totalCount = subtabs.length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6" />
            Community Subtab Integration Status
          </CardTitle>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">
              Profile navigation implementation across all Community sections
            </p>
            <Badge className={`${completedCount === totalCount ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {completedCount}/{totalCount} Complete
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎯 Implementation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {subtabs.map((subtab) => {
              const statusConfig = getStatusConfig(subtab.status);
              return (
                <div
                  key={subtab.key}
                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onNavigateToSubtab?.(subtab.key)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {subtab.icon}
                    <span className="font-semibold text-sm">{subtab.name}</span>
                  </div>
                  <Badge className={`text-xs ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.label}</span>
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Status */}
      <div className="space-y-4">
        {subtabs.map((subtab) => {
          const statusConfig = getStatusConfig(subtab.status);
          
          return (
            <Card key={subtab.key} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {subtab.icon}
                    <div>
                      <CardTitle className="text-lg">{subtab.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{subtab.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig.color}>
                      {statusConfig.icon}
                      <span className="ml-1">{statusConfig.label}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateToSubtab?.(subtab.key)}
                    >
                      Visit <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Features */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Current Features:</h4>
                    <ul className="space-y-1 text-sm">
                      {subtab.features.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold mb-2 text-sm mt-4">Components Used:</h4>
                    <div className="flex flex-wrap gap-1">
                      {subtab.components.map((component) => (
                        <Badge key={component} variant="outline" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Required Work */}
                  {subtab.needsWork && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Required Work:</h4>
                      <ul className="space-y-2 text-sm">
                        {subtab.needsWork.map((task, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span className="text-muted-foreground">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-lg">🚀 Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p className="font-medium">To complete the implementation:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
              <li>Replace all <code>Avatar</code> components with <code>UserAvatar</code></li>
              <li>Replace username text with <code>UsernameLink</code> components</li>
              <li>Wrap message/post content with <code>MentionText</code></li>
              <li>Add <code>ProfileNavigationProvider</code> wrappers where needed</li>
              <li>Update click handlers to use profile navigation</li>
              <li>Test all user interactions and hover states</li>
            </ol>
          </div>
          
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> The Live Chat, Trading Rooms, and Space components already have the imports added. 
              They just need the old components replaced with the new profile navigation components.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunitySubtabIntegrationStatus;
