import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Ban,
  Shield,
  Clock,
  AlertTriangle,
  MessageSquare,
  Eye,
  Trash2,
  UserX,
  VolumeX,
  Flag,
  MoreHorizontal,
  Gavel,
  FileText,
} from "lucide-react";
import type { 
  ModerationActionType, 
  ModerationAction, 
  ModerationQueueItem 
} from "@/types/moderation";

interface ModerationActionsProps {
  queueItem: ModerationQueueItem;
  onAction: (action: ModerationActionType, details: any) => Promise<void>;
  variant?: "dropdown" | "buttons" | "panel";
  className?: string;
}

interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: ModerationActionType | null;
  queueItem: ModerationQueueItem;
  onConfirm: (details: any) => Promise<void>;
}

const actionConfigs = {
  approve: {
    label: "Approve",
    description: "Mark as legitimate content",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-green-600",
    severity: "low",
  },
  remove: {
    label: "Remove Post",
    description: "Delete the flagged content",
    icon: <Trash2 className="w-4 h-4" />,
    color: "text-red-600",
    severity: "high",
  },
  ban_user: {
    label: "Ban User",
    description: "Permanently ban the user account",
    icon: <Ban className="w-4 h-4" />,
    color: "text-red-700",
    severity: "critical",
  },
  mute_user: {
    label: "Mute User",
    description: "Temporarily restrict user posting",
    icon: <VolumeX className="w-4 h-4" />,
    color: "text-orange-600",
    severity: "medium",
  },
  warn_user: {
    label: "Warn User",
    description: "Send warning message to user",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-yellow-600",
    severity: "low",
  },
  shadowban: {
    label: "Shadowban",
    description: "Hide user's content from others",
    icon: <Eye className="w-4 h-4" />,
    color: "text-purple-600",
    severity: "medium",
  },
  restrict_links: {
    label: "Restrict Links",
    description: "Prevent user from posting links",
    icon: <Shield className="w-4 h-4" />,
    color: "text-blue-600",
    severity: "low",
  },
  mark_spam: {
    label: "Mark as Spam",
    description: "Flag content as spam for AI training",
    icon: <Flag className="w-4 h-4" />,
    color: "text-red-500",
    severity: "medium",
  },
  dismiss_flag: {
    label: "Dismiss Flag",
    description: "Mark false positive and close",
    icon: <XCircle className="w-4 h-4" />,
    color: "text-gray-600 dark:text-gray-400",
    severity: "low",
  },
};

const ActionDialog: React.FC<ActionDialogProps> = ({
  isOpen,
  onClose,
  action,
  queueItem,
  onConfirm,
}) => {
  const { themeMode } = useMoodTheme();
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("24");
  const [sendWarning, setSendWarning] = useState(true);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!action) return null;

  const config = actionConfigs[action];
  const requiresReason = ["ban_user", "mute_user", "remove"].includes(action);
  const requiresDuration = ["mute_user", "restrict_links"].includes(action);
  const allowsWarning = ["mute_user", "warn_user", "remove"].includes(action);

  const handleSubmit = async () => {
    if (requiresReason && !reason.trim()) return;

    setIsSubmitting(true);
    
    try {
      const details = {
        reason: reason.trim(),
        duration: requiresDuration ? parseInt(duration) * 60 : undefined, // Convert hours to minutes
        sendWarning: allowsWarning ? sendWarning : false,
        evidence,
        notes: `Action taken by moderator for queue item ${queueItem.id}`,
      };

      await onConfirm(details);
      onClose();
    } catch (error) {
      console.error("Failed to submit moderation action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setDuration("24");
    setSendWarning(true);
    setEvidence([]);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={config.color}>{config.icon}</span>
            {config.label}
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Preview */}
          <div className={cn(
            "p-3 rounded-lg border",
            themeMode === 'light' 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-gray-800 border-gray-700'
          )}>
            <div className="text-sm">
              <strong>Target:</strong> Post ID {queueItem.postId}
            </div>
            {queueItem.totalFlags > 0 && (
              <div className="text-sm mt-1">
                <strong>Flags:</strong> {queueItem.totalFlags} reports
              </div>
            )}
          </div>

          {/* Severity Warning */}
          {config.severity === "critical" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a permanent action that cannot be undone. Please ensure you have reviewed all evidence carefully.
              </AlertDescription>
            </Alert>
          )}

          {/* Reason Input */}
          {requiresReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for action <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Explain why you're taking this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          )}

          {/* Duration Selection */}
          {requiresDuration && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="24">1 day</SelectItem>
                  <SelectItem value="72">3 days</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                  <SelectItem value="720">1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Warning Option */}
          {allowsWarning && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="warning"
                checked={sendWarning}
                onCheckedChange={(checked) => setSendWarning(checked as boolean)}
              />
              <Label htmlFor="warning" className="text-sm">
                Send warning notification to user
              </Label>
            </div>
          )}

          {/* Evidence Collection */}
          <div className="space-y-2">
            <Label>Evidence (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {queueItem.flags.map((flag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {flag.reason}: {flag.reporterUsername}
                </Badge>
              ))}
              {queueItem.aiSpamScore && queueItem.aiSpamScore > 0.5 && (
                <Badge variant="destructive" className="text-xs">
                  AI Spam: {Math.round(queueItem.aiSpamScore * 100)}%
                </Badge>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={
              isSubmitting || 
              (requiresReason && !reason.trim())
            }
            className={cn(
              config.severity === "critical" && "bg-red-600 hover:bg-red-700",
              config.severity === "high" && "bg-orange-600 hover:bg-orange-700"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              `Confirm ${config.label}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ModerationActions: React.FC<ModerationActionsProps> = ({
  queueItem,
  onAction,
  variant = "dropdown",
  className,
}) => {
  const { themeMode } = useMoodTheme();
  const [selectedAction, setSelectedAction] = useState<ModerationActionType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleActionClick = (action: ModerationActionType) => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const handleActionConfirm = async (details: any) => {
    if (selectedAction) {
      await onAction(selectedAction, details);
      setDialogOpen(false);
      setSelectedAction(null);
    }
  };

  const primaryActions: ModerationActionType[] = ["approve", "remove"];
  const secondaryActions: ModerationActionType[] = [
    "warn_user", "mute_user", "ban_user", "shadowban", 
    "restrict_links", "mark_spam", "dismiss_flag"
  ];

  if (variant === "buttons") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {primaryActions.map((action) => {
          const config = actionConfigs[action];
          return (
            <Button
              key={action}
              size="sm"
              variant={action === "approve" ? "default" : "destructive"}
              onClick={() => handleActionClick(action)}
              className="gap-1"
            >
              {config.icon}
              {config.label}
            </Button>
          );
        })}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {secondaryActions.map((action) => {
              const config = actionConfigs[action];
              return (
                <DropdownMenuItem
                  key={action}
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    "gap-2",
                    config.severity === "critical" && "text-red-600 dark:text-red-400"
                  )}
                >
                  {config.icon}
                  {config.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <ActionDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          action={selectedAction}
          queueItem={queueItem}
          onConfirm={handleActionConfirm}
        />
      </div>
    );
  }

  if (variant === "panel") {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className={cn(
          "text-lg font-semibold flex items-center gap-2",
          themeMode === 'light' ? 'text-gray-900' : 'text-white'
        )}>
          <Gavel className="w-5 h-5" />
          Moderation Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(actionConfigs).map(([action, config]) => (
            <Button
              key={action}
              variant="outline"
              onClick={() => handleActionClick(action as ModerationActionType)}
              className={cn(
                "justify-start gap-3 h-auto p-4",
                config.severity === "critical" && "border-red-200 hover:border-red-300 dark:border-red-800"
              )}
            >
              <span className={config.color}>{config.icon}</span>
              <div className="text-left">
                <div className="font-medium">{config.label}</div>
                <div className="text-xs text-muted-foreground">
                  {config.description}
                </div>
              </div>
            </Button>
          ))}
        </div>

        <ActionDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          action={selectedAction}
          queueItem={queueItem}
          onConfirm={handleActionConfirm}
        />
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <MoreHorizontal className="w-4 h-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Quick Actions */}
        <DropdownMenuItem
          onClick={() => handleActionClick("approve")}
          className="gap-2 text-green-600 dark:text-green-400"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleActionClick("remove")}
          className="gap-2 text-red-600 dark:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* User Actions */}
        <DropdownMenuItem
          onClick={() => handleActionClick("warn_user")}
          className="gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Warn User
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleActionClick("mute_user")}
          className="gap-2 text-orange-600 dark:text-orange-400"
        >
          <VolumeX className="w-4 h-4" />
          Mute User
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleActionClick("shadowban")}
          className="gap-2 text-purple-600 dark:text-purple-400"
        >
          <Eye className="w-4 h-4" />
          Shadowban
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Severe Actions */}
        <DropdownMenuItem
          onClick={() => handleActionClick("ban_user")}
          className="gap-2 text-red-700 dark:text-red-400"
        >
          <Ban className="w-4 h-4" />
          Ban User
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Other Actions */}
        <DropdownMenuItem
          onClick={() => handleActionClick("mark_spam")}
          className="gap-2"
        >
          <Flag className="w-4 h-4" />
          Mark as Spam
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleActionClick("dismiss_flag")}
          className="gap-2"
        >
          <XCircle className="w-4 h-4" />
          Dismiss Flag
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ActionDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        action={selectedAction}
        queueItem={queueItem}
        onConfirm={handleActionConfirm}
      />
    </DropdownMenu>
  );
};

export default ModerationActions;
