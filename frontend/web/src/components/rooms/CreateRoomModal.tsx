import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Search,
  X,
  TrendingUp,
  Users,
  Crown,
  Zap,
} from "lucide-react";
import { UserLimits, PrivateRoom } from "@/types/rooms";
import {
  canCreateRoom,
  canAddMembersToRoom,
} from "@/utils/userLimitsEnforcement";

interface CreateRoomModalProps {
  onCreateRoom: (roomData: any) => void;
  watchlistTickers: string[];
  userLimits: UserLimits;
  existingRooms: PrivateRoom[];
  userId: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onCreateRoom,
  watchlistTickers,
  userLimits,
  existingRooms,
  userId,
}) => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [tickerSearch, setTickerSearch] = useState("");
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [enableAISummary, setEnableAISummary] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Check if user can create rooms
  const createRoomCheck = canCreateRoom(userId, userLimits, existingRooms);
  const canCreate = createRoomCheck.allowed;

  const filteredTickers = watchlistTickers.filter((ticker) =>
    ticker.toLowerCase().includes(tickerSearch.toLowerCase()),
  );

  const handleTickerToggle = (ticker: string) => {
    if (selectedTickers.includes(ticker)) {
      setSelectedTickers((prev) => prev.filter((t) => t !== ticker));
    } else if (selectedTickers.length < 5) {
      setSelectedTickers((prev) => [...prev, ticker]);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || selectedTickers.length === 0) return;

    setIsCreating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onCreateRoom({
      name: roomName.trim(),
      description: description.trim() || undefined,
      tickers: selectedTickers,
      settings: {
        alertOnSentimentChange: enableAlerts,
        aiSummaryEnabled: enableAISummary,
      },
    });

    setIsCreating(false);
    // Reset form
    setRoomName("");
    setDescription("");
    setSelectedTickers([]);
    setTickerSearch("");
    setEnableAlerts(true);
    setEnableAISummary(false);
  };

  const isFormValid =
    roomName.trim() &&
    selectedTickers.length > 0 &&
    selectedTickers.length <= 5;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create Private Watchlist Room
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Limits Check */}
        {!canCreate ? (
          <Card className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1 text-red-800 dark:text-red-200">
                    Room Creation Limit Reached
                  </h4>
                  <p className="text-xs text-red-700 dark:text-red-300 mb-2">
                    {createRoomCheck.reason}
                  </p>
                  {createRoomCheck.upgradeRequired && (
                    <div className="text-xs text-red-700 dark:text-red-300">
                      Upgrade to Premium for up to 20 private rooms!
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">Room Limits</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                      • Rooms created: {createRoomCheck.currentUsage} /{" "}
                      {createRoomCheck.limit}
                    </div>
                    <div>
                      • Up to {userLimits.maxRoomMembers} members per room
                    </div>
                    <div>• Select 1-5 tickers from your watchlist</div>
                  </div>
                </div>
                {userLimits.maxPrivateRooms > 1 && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Room Name */}
        <div className="space-y-2">
          <Label htmlFor="room-name">Room Name *</Label>
          <Input
            id="room-name"
            placeholder="e.g., AI Tech Watch, Energy Futures"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            maxLength={50}
          />
          <div className="text-xs text-muted-foreground text-right">
            {roomName.length}/50
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe what this room is for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            rows={3}
          />
          <div className="text-xs text-muted-foreground text-right">
            {description.length}/200
          </div>
        </div>

        {/* Ticker Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Select Tickers from Watchlist *</Label>
            <div className="text-xs text-muted-foreground">
              {selectedTickers.length}/5 selected
            </div>
          </div>

          <Progress
            value={(selectedTickers.length / 5) * 100}
            className="h-2"
          />

          {/* Selected Tickers */}
          {selectedTickers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTickers.map((ticker) => (
                <Badge
                  key={ticker}
                  variant="default"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleTickerToggle(ticker)}
                >
                  ${ticker}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}

          {/* Ticker Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your watchlist tickers..."
              value={tickerSearch}
              onChange={(e) => setTickerSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Available Tickers */}
          <ScrollArea className="h-40 border rounded-md p-2">
            <div className="grid grid-cols-3 gap-2">
              {filteredTickers.map((ticker) => {
                const isSelected = selectedTickers.includes(ticker);
                const canSelect = !isSelected && selectedTickers.length < 5;

                return (
                  <button
                    key={ticker}
                    onClick={() => handleTickerToggle(ticker)}
                    disabled={!isSelected && !canSelect}
                    className={`p-2 text-sm rounded border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : canSelect
                          ? "hover:bg-muted border-muted"
                          : "opacity-50 cursor-not-allowed border-muted"
                    }`}
                  >
                    ${ticker}
                  </button>
                );
              })}
            </div>
            {filteredTickers.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No tickers found</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Room Settings */}
        <div className="space-y-3">
          <Label>Room Features</Label>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alerts"
                checked={enableAlerts}
                onCheckedChange={(checked) =>
                  setEnableAlerts(checked as boolean)
                }
              />
              <Label htmlFor="alerts" className="text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Sentiment change alerts
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai-summary"
                checked={enableAISummary}
                onCheckedChange={(checked) =>
                  setEnableAISummary(checked as boolean)
                }
              />
              <Label htmlFor="ai-summary" className="text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI daily summaries
                  <Badge variant="secondary" className="text-xs">
                    Premium
                  </Badge>
                </div>
              </Label>
            </div>
          </div>
        </div>

        {/* Validation Message */}
        {!isFormValid && (roomName || selectedTickers.length > 0) && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {!roomName.trim() && "Room name is required"}
            {roomName.trim() &&
              selectedTickers.length === 0 &&
              "Select at least one ticker"}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateRoom}
            disabled={!canCreate || !isFormValid || isCreating}
            className="min-w-[100px]"
          >
            {isCreating
              ? "Creating..."
              : !canCreate
                ? "Limit Reached"
                : "Create Room"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
