import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Mail,
  Link2,
  Clock,
  UserPlus,
  Check,
  AlertCircle,
  Send,
  Share2,
  Users,
  Calendar,
  Trash2,
} from "lucide-react";
import { PrivateRoom, UserLimits } from "@/types/rooms";
import { useAuth } from "@/contexts/AuthContext";

interface InviteManagementModalProps {
  room: PrivateRoom;
  userLimits: UserLimits;
  onInviteSent: (method: "email" | "username" | "link", target: string) => void;
}

interface PendingInvite {
  id: string;
  method: "email" | "username" | "link";
  target: string;
  sentAt: Date;
  expiresAt: Date;
  status: "pending" | "accepted" | "expired";
}

export const InviteManagementModal: React.FC<InviteManagementModalProps> = ({
  room,
  userLimits,
  onInviteSent,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("invite");

  // Email invite state
  const [emailList, setEmailList] = useState("");
  const [emailMessage, setEmailMessage] = useState(
    `Hi! You've been invited to join "${room.name}" - a private watchlist room for ${room.tickers.join(", ")}. Click the link below to join our discussion!`,
  );

  // Username invite state
  const [usernameList, setUsernameList] = useState("");

  // Link sharing state
  const [linkExpiration, setLinkExpiration] = useState("48"); // hours
  const [shareableLink, setShareableLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // Invite tracking
  const [invitesSentToday, setInvitesSentToday] = useState(3); // Mock data
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    {
      id: "inv-1",
      method: "email",
      target: "trader@example.com",
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 46 * 60 * 60 * 1000),
      status: "pending",
    },
    {
      id: "inv-2",
      method: "username",
      target: "CryptoKing",
      sentAt: new Date(Date.now() - 30 * 60 * 1000),
      expiresAt: new Date(Date.now() + 47.5 * 60 * 60 * 1000),
      status: "pending",
    },
  ]);

  useEffect(() => {
    // Generate shareable link
    const token = generateInviteToken();
    const baseUrl = window.location.origin;
    setShareableLink(`${baseUrl}/rooms/join?token=${token}&room=${room.id}`);
  }, [room.id, linkExpiration]);

  const generateInviteToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const canSendMoreInvites = invitesSentToday < userLimits.maxInvitesPerHour;
  const remainingInvites = userLimits.maxInvitesPerHour - invitesSentToday;

  const handleEmailInvite = () => {
    if (!emailList.trim() || !canSendMoreInvites) return;

    const emails = emailList
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    emails.forEach((email) => {
      if (invitesSentToday < userLimits.maxInvitesPerHour) {
        onInviteSent("email", email);
        setInvitesSentToday((prev) => prev + 1);

        // Add to pending invites
        setPendingInvites((prev) => [
          ...prev,
          {
            id: `inv-${Date.now()}-${email}`,
            method: "email",
            target: email,
            sentAt: new Date(),
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            status: "pending",
          },
        ]);
      }
    });

    setEmailList("");
  };

  const handleUsernameInvite = () => {
    if (!usernameList.trim() || !canSendMoreInvites) return;

    const usernames = usernameList
      .split(/[,\n]/)
      .map((username) => username.trim())
      .filter((username) => username.length > 0);

    usernames.forEach((username) => {
      if (invitesSentToday < userLimits.maxInvitesPerHour) {
        onInviteSent("username", username);
        setInvitesSentToday((prev) => prev + 1);

        // Add to pending invites
        setPendingInvites((prev) => [
          ...prev,
          {
            id: `inv-${Date.now()}-${username}`,
            method: "username",
            target: username,
            sentAt: new Date(),
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            status: "pending",
          },
        ]);
      }
    });

    setUsernameList("");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      onInviteSent("link", shareableLink);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDeleteInvite = (inviteId: string) => {
    setPendingInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite Members to {room.name}
        </DialogTitle>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invite" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Share Link
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manage
          </TabsTrigger>
        </TabsList>

        {/* Invite Limits Display */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Invites sent today
              </span>
              <span className="text-sm font-medium">
                {invitesSentToday} / {userLimits.maxInvitesPerHour}
              </span>
            </div>
            <Progress
              value={(invitesSentToday / userLimits.maxInvitesPerHour) * 100}
              className="h-2"
            />
            {!canSendMoreInvites && (
              <div className="flex items-center gap-2 mt-2 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">
                  Daily invite limit reached. Resets in{" "}
                  {24 - new Date().getHours()} hours.
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <TabsContent value="invite" className="space-y-6">
          {/* Email Invites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-4 w-4" />
                Email Invites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email-list">Email Addresses</Label>
                <Textarea
                  id="email-list"
                  placeholder="Enter email addresses (comma or line separated)&#10;trader1@example.com, trader2@example.com"
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="email-message">Custom Message</Label>
                <Textarea
                  id="email-message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button
                onClick={handleEmailInvite}
                disabled={!emailList.trim() || !canSendMoreInvites}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email Invites
              </Button>
            </CardContent>
          </Card>

          {/* Username Invites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4" />
                Username Invites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username-list">Usernames</Label>
                <Textarea
                  id="username-list"
                  placeholder="Enter usernames (comma or line separated)&#10;TechTrader, CryptoKing, DayTrader123"
                  value={usernameList}
                  onChange={(e) => setUsernameList(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <Button
                onClick={handleUsernameInvite}
                disabled={!usernameList.trim() || !canSendMoreInvites}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Username Invites
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-4 w-4" />
                Shareable Invite Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="link-expiration">Link Expiration</Label>
                <Select
                  value={linkExpiration}
                  onValueChange={setLinkExpiration}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours (default)</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Generated Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareableLink}
                    readOnly
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Link Details:</span>
                </div>
                <ul className="text-xs space-y-1 ml-6">
                  <li>• Expires in {linkExpiration} hours</li>
                  <li>• Single-use per person</li>
                  <li>• Room admin can revoke anytime</li>
                  <li>• Automatically tracks usage</li>
                </ul>
              </div>

              <Button onClick={handleCopyLink} className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                {linkCopied ? "Link Copied!" : "Copy & Share Link"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4" />
                Pending Invites ({pendingInvites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {invite.method === "email" ? (
                          <Mail className="h-4 w-4 text-blue-500" />
                        ) : invite.method === "username" ? (
                          <Users className="h-4 w-4 text-green-500" />
                        ) : (
                          <Link2 className="h-4 w-4 text-purple-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm">
                            {invite.target}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Sent {formatTimeRemaining(invite.sentAt)} ago
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeRemaining(invite.expiresAt)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvite(invite.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {pendingInvites.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No pending invites</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};
