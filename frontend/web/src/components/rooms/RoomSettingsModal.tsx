import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings,
  Crown,
  Shield,
  Users,
  Trash2,
  Archive,
  Bell,
  Bot,
  Lock,
  UserX,
} from "lucide-react";
import { PrivateRoom } from "@/types/rooms";

interface RoomSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: PrivateRoom;
  isAdmin: boolean;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  open,
  onOpenChange,
  room,
  isAdmin,
}) => {
  const [settings, setSettings] = useState(room.settings);
  const [selectedTab, setSelectedTab] = useState<
    "general" | "members" | "danger"
  >("general");

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveMember = (userId: string) => {
    // Implementation for removing member
    console.log("Remove member:", userId);
  };

  const handlePromoteMember = (userId: string) => {
    // Implementation for promoting member to admin
    console.log("Promote member:", userId);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "members", label: "Members", icon: Users },
    ...(isAdmin ? [{ id: "danger", label: "Danger Zone", icon: Trash2 }] : []),
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Room Features</h4>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Emoji Reactions</Label>
            <div className="text-sm text-muted-foreground">
              Allow members to react to messages
            </div>
          </div>
          <Switch
            checked={settings.allowReactions}
            onCheckedChange={(checked) =>
              handleSettingChange("allowReactions", checked)
            }
            disabled={!isAdmin}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Thread Replies</Label>
            <div className="text-sm text-muted-foreground">
              Enable threaded conversations
            </div>
          </div>
          <Switch
            checked={settings.allowThreads}
            onCheckedChange={(checked) =>
              handleSettingChange("allowThreads", checked)
            }
            disabled={!isAdmin}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Sentiment Alerts
            </Label>
            <div className="text-sm text-muted-foreground">
              Notify when ticker sentiment changes significantly
            </div>
          </div>
          <Switch
            checked={settings.alertOnSentimentChange}
            onCheckedChange={(checked) =>
              handleSettingChange("alertOnSentimentChange", checked)
            }
            disabled={!isAdmin}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Summaries
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
            </Label>
            <div className="text-sm text-muted-foreground">
              Daily AI-generated activity summaries
            </div>
          </div>
          <Switch
            checked={settings.aiSummaryEnabled}
            onCheckedChange={(checked) =>
              handleSettingChange("aiSummaryEnabled", checked)
            }
            disabled={!isAdmin}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">Privacy</h4>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Private Room
            </Label>
            <div className="text-sm text-muted-foreground">
              Invite-only access
            </div>
          </div>
          <Switch
            checked={settings.isPrivate}
            onCheckedChange={(checked) =>
              handleSettingChange("isPrivate", checked)
            }
            disabled={!isAdmin}
          />
        </div>
      </div>

      {isAdmin && (
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      )}
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Members ({room.members.length})</h4>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {room.members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {member.username}
                    </span>
                    {member.role === "admin" && (
                      <Crown className="h-3 w-3 text-yellow-500" />
                    )}
                    <div
                      className={`w-2 h-2 rounded-full ${member.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {isAdmin && member.role !== "admin" && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePromoteMember(member.userId)}
                  >
                    <Crown className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveMember(member.userId)}
                  >
                    <UserX className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-destructive">Danger Zone</h4>
        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">Archive Room</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Archive this room. Members won't be able to send messages, but
                can still view history.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Room
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive Room</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to archive this room? Members won't
                      be able to send new messages.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Archive</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Separator />

            <div>
              <h5 className="font-medium mb-2 text-destructive">Delete Room</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete this room and all its messages. This action
                cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Room
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Room</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete "{room.name}"?
                      This action cannot be undone and all messages will be
                      lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground">
                      Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Room Settings - {room.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-1/3 border-r pr-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pl-4">
            <ScrollArea className="h-full">
              {selectedTab === "general" && renderGeneralSettings()}
              {selectedTab === "members" && renderMembersTab()}
              {selectedTab === "danger" && renderDangerZone()}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
