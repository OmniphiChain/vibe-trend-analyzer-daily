import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Copy,
  Check,
  Clock,
  Mail,
  Link,
  AlertCircle,
  Users,
} from "lucide-react";
import { PrivateRoom, UserLimits } from "@/types/rooms";

interface InviteUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: PrivateRoom;
  userLimits: UserLimits;
}

export const InviteUsersModal: React.FC<InviteUsersModalProps> = ({
  open,
  onOpenChange,
  room,
  userLimits,
}) => {
  const [inviteMethod, setInviteMethod] = useState<"email" | "link">("email");
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const inviteUrl = `${window.location.origin}/invite/${room.inviteToken}`;
  const tokenExpiryHours = room.tokenExpiry
    ? Math.ceil((room.tokenExpiry.getTime() - Date.now()) / (1000 * 60 * 60))
    : 0;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleSendInvites = async () => {
    if (!emails.trim()) return;

    setIsInviting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reset form
    setEmails("");
    setMessage("");
    setIsInviting(false);
    onOpenChange(false);

    // Show success toast
    console.log("Invites sent!");
  };

  const emailList = emails
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const canSendInvites =
    emailList.length > 0 && emailList.length <= userLimits.maxInvitesPerHour;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Members to {room.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Info */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Current Members:</span>
                  <span className="font-medium">
                    {room.members.length}/{userLimits.maxRoomMembers}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Hourly Invite Limit:</span>
                  <span className="font-medium">
                    0/{userLimits.maxInvitesPerHour}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>Link expires in {tokenExpiryHours}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invite Method Tabs */}
          <div className="space-y-4">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setInviteMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                  inviteMethod === "email"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                }`}
              >
                <Mail className="h-4 w-4" />
                Email Invites
              </button>
              <button
                onClick={() => setInviteMethod("link")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                  inviteMethod === "link"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                }`}
              >
                <Link className="h-4 w-4" />
                Share Link
              </button>
            </div>

            {/* Email Invites */}
            {inviteMethod === "email" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emails">Email Addresses</Label>
                  <Textarea
                    id="emails"
                    placeholder="Enter email addresses separated by commas&#10;example: user1@email.com, user2@email.com"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Separate multiple emails with commas</span>
                    <span>
                      {emailList.length}/{userLimits.maxInvitesPerHour}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message to your invitation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {message.length}/200
                  </div>
                </div>

                {emailList.length > 0 && (
                  <div className="space-y-2">
                    <Label>Recipients ({emailList.length})</Label>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {emailList.map((email, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {emailList.length > userLimits.maxInvitesPerHour && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Too many invites. Maximum {userLimits.maxInvitesPerHour} per
                    hour.
                  </div>
                )}
              </div>
            )}

            {/* Share Link */}
            {inviteMethod === "link" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Invite Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={inviteUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <div className="font-medium text-amber-800 dark:text-amber-200">
                          Security Notice
                        </div>
                        <div className="text-amber-700 dark:text-amber-300">
                          • This link expires in {tokenExpiryHours} hours •
                          Anyone with this link can join the room • Share only
                          with trusted contacts
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {inviteMethod === "email" && (
              <Button
                onClick={handleSendInvites}
                disabled={!canSendInvites || isInviting}
                className="min-w-[120px]"
              >
                {isInviting
                  ? "Sending..."
                  : `Send ${emailList.length} Invite${emailList.length !== 1 ? "s" : ""}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
