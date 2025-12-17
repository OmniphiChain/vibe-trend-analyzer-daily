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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Flag,
  Shield,
  AlertTriangle,
  MessageSquare,
  Zap,
  Link,
  Copy,
  Target,
  Ban,
  CheckCircle,
} from "lucide-react";
import type { FlagReasonType, CreateFlagData } from "@/types/moderation";

interface FlagPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postContent: string;
  postAuthor: string;
  onSubmitFlag: (flagData: CreateFlagData) => Promise<void>;
}

const flagReasons: Array<{
  value: FlagReasonType;
  label: string;
  description: string;
  icon: React.ReactNode;
  severity: "low" | "medium" | "high";
}> = [
  {
    value: "spam",
    label: "Spam",
    description: "Repetitive, unwanted, or promotional content",
    icon: <Zap className="w-4 h-4" />,
    severity: "high",
  },
  {
    value: "misinformation",
    label: "Misinformation",
    description: "False or misleading financial information",
    icon: <AlertTriangle className="w-4 h-4" />,
    severity: "high",
  },
  {
    value: "harassment",
    label: "Harassment",
    description: "Bullying, threatening, or harassing content",
    icon: <Ban className="w-4 h-4" />,
    severity: "high",
  },
  {
    value: "scam",
    label: "Scam",
    description: "Fraudulent schemes or suspicious links",
    icon: <Shield className="w-4 h-4" />,
    severity: "high",
  },
  {
    value: "inappropriate_content",
    label: "Inappropriate Content",
    description: "Adult content or offensive material",
    icon: <Flag className="w-4 h-4" />,
    severity: "medium",
  },
  {
    value: "hate_speech",
    label: "Hate Speech",
    description: "Discriminatory or hateful language",
    icon: <Ban className="w-4 h-4" />,
    severity: "high",
  },
  {
    value: "off_topic",
    label: "Off Topic",
    description: "Content unrelated to finance/trading",
    icon: <Target className="w-4 h-4" />,
    severity: "low",
  },
  {
    value: "duplicate",
    label: "Duplicate Content",
    description: "Repeated or copy-pasted content",
    icon: <Copy className="w-4 h-4" />,
    severity: "medium",
  },
  {
    value: "self_promotion",
    label: "Self Promotion",
    description: "Excessive self-promotion or affiliate links",
    icon: <Link className="w-4 h-4" />,
    severity: "medium",
  },
  {
    value: "other",
    label: "Other",
    description: "Another reason not listed above",
    icon: <MessageSquare className="w-4 h-4" />,
    severity: "low",
  },
];

export const FlagPostModal: React.FC<FlagPostModalProps> = ({
  isOpen,
  onClose,
  postId,
  postContent,
  postAuthor,
  onSubmitFlag,
}) => {
  const { themeMode } = useMoodTheme();
  const [selectedReason, setSelectedReason] = useState<FlagReasonType | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    
    try {
      const flagData: CreateFlagData = {
        postId,
        reporterId: "current-user-id", // This would come from auth context
        reporterUsername: "CurrentUser", // This would come from auth context
        reason: selectedReason,
        description: description.trim() || undefined,
      };

      await onSubmitFlag(flagData);
      setSubmitted(true);
      
      // Auto close after showing success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit flag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    setSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  const selectedReasonData = flagReasons.find(r => r.value === selectedReason);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className={cn(
              "w-12 h-12 mb-4",
              themeMode === 'light' ? 'text-green-600' : 'text-green-400'
            )} />
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Report Submitted
            </h3>
            <p className={cn(
              "text-sm",
              themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
            )}>
              Thank you for helping keep our community safe. We'll review this report promptly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            Report Post
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe and trustworthy community by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Preview */}
          <div className={cn(
            "p-4 rounded-lg border",
            themeMode === 'light' 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-gray-800 border-gray-700'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-gray-900' : 'text-white'
              )}>
                @{postAuthor}
              </span>
            </div>
            <p className={cn(
              "text-sm leading-relaxed",
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
            )}>
              {postContent.length > 200 
                ? `${postContent.substring(0, 200)}...` 
                : postContent
              }
            </p>
          </div>

          {/* Reason Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Why are you reporting this post?
            </Label>
            
            <RadioGroup 
              value={selectedReason} 
              onValueChange={(value) => setSelectedReason(value as FlagReasonType)}
              className="space-y-3"
            >
              {flagReasons.map((reason) => (
                <div 
                  key={reason.value}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedReason === reason.value
                      ? themeMode === 'light'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-blue-950/30 border-blue-800'
                      : themeMode === 'light'
                        ? 'border-gray-200 hover:bg-gray-50'
                        : 'border-gray-700 hover:bg-gray-800'
                  )}
                >
                  <RadioGroupItem 
                    value={reason.value} 
                    id={reason.value}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={reason.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className={getSeverityColor(reason.severity)}>
                        {reason.icon}
                      </span>
                      <span className="font-medium">{reason.label}</span>
                    </Label>
                    <p className={cn(
                      "text-sm mt-1",
                      themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                    )}>
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Details */}
          {selectedReason && (
            <div className="space-y-3">
              <Label htmlFor="description">
                Additional details {selectedReasonData?.value === "other" ? "(required)" : "(optional)"}
              </Label>
              <Textarea
                id="description"
                placeholder={
                  selectedReasonData?.value === "other"
                    ? "Please provide details about why you're reporting this post..."
                    : "Provide any additional context that might help our review..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
                required={selectedReasonData?.value === "other"}
              />
              <div className={cn(
                "text-xs text-right",
                themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {description.length}/500
              </div>
            </div>
          )}

          {/* Warning for high severity */}
          {selectedReasonData && selectedReasonData.severity === "high" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a serious violation. Our moderation team will review this report with high priority.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={
              !selectedReason || 
              isSubmitting || 
              (selectedReason === "other" && !description.trim())
            }
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlagPostModal;
