import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Users,
  MessageSquare,
  UserPlus,
  BarChart3,
  Zap,
  ArrowUp,
  Shield,
  Check,
  X,
} from "lucide-react";
import { UserLimits, PrivateRoom } from "@/types/rooms";
import {
  getUserLimitInfo,
  getUpgradeMessage,
} from "@/utils/userLimitsEnforcement";

interface UserLimitsDisplayProps {
  userId: string;
  userLimits: UserLimits;
  existingRooms: PrivateRoom[];
  isPremium?: boolean;
  isVerified?: boolean;
  onUpgrade?: () => void;
}

export const UserLimitsDisplay: React.FC<UserLimitsDisplayProps> = ({
  userId,
  userLimits,
  existingRooms,
  isPremium = false,
  isVerified = false,
  onUpgrade,
}) => {
  const limitInfo = getUserLimitInfo(userId, userLimits, existingRooms);

  const getProgressColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-green-500";
  };

  const features = [
    {
      name: "Create Polls",
      enabled: limitInfo.features.canCreatePolls,
      requirement: "Premium",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Account Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isPremium ? (
              <>
                <Crown className="h-5 w-5 text-purple-500" />
                Premium Account
              </>
            ) : isVerified ? (
              <>
                <Shield className="h-5 w-5 text-blue-500" />
                Verified Account
              </>
            ) : (
              <>
                <Users className="h-5 w-5 text-gray-500" />
                Free Account
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Room Limits */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Private Rooms Created
                </span>
                <span className="text-sm text-muted-foreground">
                  {limitInfo.rooms.created} / {limitInfo.rooms.maxCreated}
                </span>
              </div>
              <Progress
                value={
                  (limitInfo.rooms.created / limitInfo.rooms.maxCreated) * 100
                }
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Rooms Joined
                </span>
                <span className="text-sm text-muted-foreground">
                  {limitInfo.rooms.joined} / {limitInfo.rooms.maxJoined}
                </span>
              </div>
              <Progress
                value={
                  (limitInfo.rooms.joined / limitInfo.rooms.maxJoined) * 100
                }
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Daily Invites Sent
                </span>
                <span className="text-sm text-muted-foreground">
                  {limitInfo.invites.sentToday} / {limitInfo.invites.maxPerDay}
                </span>
              </div>
              <Progress
                value={
                  (limitInfo.invites.sentToday / limitInfo.invites.maxPerDay) *
                  100
                }
                className="h-2"
              />
              {limitInfo.invites.remaining <= 2 &&
                limitInfo.invites.remaining > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Only {limitInfo.invites.remaining} invite
                    {limitInfo.invites.remaining !== 1 ? "s" : ""} remaining
                    today
                  </p>
                )}
            </div>
          </div>

          {/* Feature Access */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Feature Access</h4>
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{feature.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {feature.requirement}
                    </span>
                    {feature.enabled ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Max Room Members */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Max Members per Room</span>
              <Badge variant="outline">
                {limitInfo.features.maxRoomMembers}
              </Badge>
            </div>
          </div>

          {/* Upgrade Section */}
          {!isPremium && onUpgrade && (
            <div className="border-t pt-3">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">
                    Upgrade to Premium
                  </span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                  <li>• Create up to 20 private rooms</li>
                  <li>• Join up to 50 rooms</li>
                  <li>• Send 25 invites per day</li>
                  <li>• Up to 50 members per room</li>

                  <li>• Priority support</li>
                </ul>
                <Button onClick={onUpgrade} size="sm" className="w-full">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
