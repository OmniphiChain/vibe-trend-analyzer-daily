import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Lock,
  Bell,
  Bot,
  Shield,
  Clock,
  AlertCircle,
  Check,
  DollarSign,
  Star,
  Hash,
} from "lucide-react";

import {
  PrivateRoom,
  WatchlistTicker,
  RoomSettings,
} from "@/types/privateRooms";
import { mockWatchlistTickers, mockUsers } from "@/data/privateRoomsMockData";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: Partial<PrivateRoom>) => void;
  userTier: "free" | "verified" | "premium";
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  userTier,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tickers: [] as string[],
    settings: {
      isPrivate: true,
      allowReactions: true,
      allowThreads: true,
      allowPolls: userTier === "premium",
      alertOnSentimentChange: true,
      aiSummaryEnabled: userTier === "premium",
      profanityFilter: true,
      inviteExpiry: 48,
      maxMembers:
        userTier === "premium" ? 50 : userTier === "verified" ? 20 : 10,
      autoArchiveDays: 30,
    } as RoomSettings,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showTickerPopover, setShowTickerPopover] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const maxTickers = 5;
  const maxNameLength = 50;
  const maxDescLength = 200;

  const availableTickers = mockWatchlistTickers.filter(
    (ticker) =>
      !formData.tickers.includes(ticker.symbol) &&
      ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTickerAdd = (ticker: string) => {
    if (
      formData.tickers.length < maxTickers &&
      !formData.tickers.includes(ticker)
    ) {
      setFormData((prev) => ({
        ...prev,
        tickers: [...prev.tickers, ticker],
      }));
      setSearchQuery("");
      setShowTickerPopover(false);
    }
  };

  const handleTickerRemove = (ticker: string) => {
    setFormData((prev) => ({
      ...prev,
      tickers: prev.tickers.filter((t) => t !== ticker),
    }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
    } else if (formData.name.length > maxNameLength) {
      newErrors.name = `Name must be ${maxNameLength} characters or less`;
    }

    if (formData.tickers.length === 0) {
      newErrors.tickers = "Select at least 1 ticker from your watchlist";
    } else if (formData.tickers.length > maxTickers) {
      newErrors.tickers = `Maximum ${maxTickers} tickers allowed`;
    }

    if (formData.description.length > maxDescLength) {
      newErrors.description = `Description must be ${maxDescLength} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleCreate = () => {
    if (validateStep1()) {
      const roomData: Partial<PrivateRoom> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        tickers: formData.tickers,
        settings: formData.settings,
        type: "private",
        status: "active",
        category: "watchlist",
      };

      onCreateRoom(roomData);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: "",
      description: "",
      tickers: [],
      settings: {
        isPrivate: true,
        allowReactions: true,
        allowThreads: true,
        allowPolls: userTier === "premium",
        alertOnSentimentChange: true,
        aiSummaryEnabled: userTier === "premium",
        profanityFilter: true,
        inviteExpiry: 48,
        maxMembers:
          userTier === "premium" ? 50 : userTier === "verified" ? 20 : 10,
        autoArchiveDays: 30,
      },
    });
    setErrors({});
    setSearchQuery("");
  };

  const getSentimentColor = (ticker: string) => {
    const tickerData = mockWatchlistTickers.find((t) => t.symbol === ticker);
    if (!tickerData) return "text-gray-500";

    if (tickerData.sentiment >= 70) return "text-green-600";
    if (tickerData.sentiment >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentIcon = (ticker: string) => {
    const tickerData = mockWatchlistTickers.find((t) => t.symbol === ticker);
    if (!tickerData) return null;

    if (tickerData.sentiment >= 60) return <TrendingUp className="h-3 w-3" />;
    if (tickerData.sentiment >= 40) return <TrendingDown className="h-3 w-3" />;
    return <TrendingDown className="h-3 w-3" />;
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          1
        </div>
        <div
          className={`w-12 h-0.5 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
        />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          2
        </div>
      </div>
    </div>
  );

  const Step1Content = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

        {/* Room Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Room Name *</Label>
          <Input
            id="name"
            placeholder="e.g., AI Tech Watchlist, EV Revolution, Dividend Kings"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={errors.name ? "border-red-500" : ""}
            maxLength={maxNameLength}
          />
          <div className="flex justify-between text-xs">
            {errors.name ? (
              <span className="text-red-500">{errors.name}</span>
            ) : (
              <span className="text-gray-500">
                Choose a descriptive name for your room
              </span>
            )}
            <span className="text-gray-400">
              {formData.name.length}/{maxNameLength}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="What will you discuss in this room? Include your investment thesis or trading strategy..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className={`min-h-[80px] ${errors.description ? "border-red-500" : ""}`}
            maxLength={maxDescLength}
          />
          <div className="flex justify-between text-xs">
            {errors.description ? (
              <span className="text-red-500">{errors.description}</span>
            ) : (
              <span className="text-gray-500">
                Help members understand the room's purpose
              </span>
            )}
            <span className="text-gray-400">
              {formData.description.length}/{maxDescLength}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Watchlist Tickers</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select 1-{maxTickers} tickers from your watchlist to track in this
          room. Room discussions and sentiment alerts will focus on these
          tickers.
        </p>

        {/* Selected Tickers */}
        {formData.tickers.length > 0 && (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">
              Selected Tickers
            </Label>
            <div className="flex flex-wrap gap-2">
              {formData.tickers.map((ticker) => (
                <Badge
                  key={ticker}
                  variant="outline"
                  className={`flex items-center gap-2 px-3 py-1 ${getSentimentColor(ticker)}`}
                >
                  <DollarSign className="h-3 w-3" />
                  {ticker}
                  {getSentimentIcon(ticker)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-100"
                    onClick={() => handleTickerRemove(ticker)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add Ticker */}
        <div className="space-y-2">
          <Label>Add Tickers from Watchlist</Label>
          <Popover open={showTickerPopover} onOpenChange={setShowTickerPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={showTickerPopover}
                className="w-full justify-between"
                disabled={formData.tickers.length >= maxTickers}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {formData.tickers.length >= maxTickers
                    ? "Maximum tickers selected"
                    : "Search your watchlist..."}
                </div>
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search tickers..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandEmpty>No tickers found in your watchlist.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {availableTickers.map((ticker) => (
                    <CommandItem
                      key={ticker.symbol}
                      onSelect={() => handleTickerAdd(ticker.symbol)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{ticker.symbol}</span>
                        </div>
                        <span className="text-sm text-gray-500 truncate">
                          {ticker.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1 ${getSentimentColor(ticker.symbol)}`}
                        >
                          {getSentimentIcon(ticker.symbol)}
                          <span className="text-xs">{ticker.sentiment}%</span>
                        </div>
                        <div
                          className={`text-xs ${ticker.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {ticker.changePercent >= 0 ? "+" : ""}
                          {ticker.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {errors.tickers && (
            <span className="text-sm text-red-500">{errors.tickers}</span>
          )}

          <div className="text-xs text-gray-500">
            Selected {formData.tickers.length}/{maxTickers} tickers
          </div>
        </div>
      </div>
    </div>
  );

  const Step2Content = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Room Settings</h3>
        <p className="text-sm text-gray-600 mb-6">
          Configure your room's features and permissions. You can change these
          later.
        </p>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Private Room</div>
                    <div className="text-sm text-gray-600">
                      Only invited members can access
                    </div>
                  </div>
                </div>
                <Switch
                  checked={formData.settings.isPrivate}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, isPrivate: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Chat Features */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Chat Features
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Emoji Reactions</div>
                    <div className="text-xs text-gray-600">
                      Allow members to react to messages
                    </div>
                  </div>
                  <Switch
                    checked={formData.settings.allowReactions}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, allowReactions: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Threaded Replies</div>
                    <div className="text-xs text-gray-600">
                      Enable reply threads for organized discussions
                    </div>
                  </div>
                  <Switch
                    checked={formData.settings.allowThreads}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, allowThreads: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium text-sm flex items-center gap-1">
                        Create Polls
                        {userTier !== "premium" && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        Allow members to create polls
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.settings.allowPolls}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, allowPolls: checked },
                      }))
                    }
                    disabled={userTier !== "premium"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Features */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Smart Features
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Sentiment Alerts</div>
                    <div className="text-xs text-gray-600">
                      Get notified when ticker sentiment changes
                    </div>
                  </div>
                  <Switch
                    checked={formData.settings.alertOnSentimentChange}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          alertOnSentimentChange: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm flex items-center gap-1">
                      AI Daily Summaries
                      {userTier !== "premium" && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      AI-generated daily activity summaries
                    </div>
                  </div>
                  <Switch
                    checked={formData.settings.aiSummaryEnabled}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          aiSummaryEnabled: checked,
                        },
                      }))
                    }
                    disabled={userTier !== "premium"}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Content Filter</div>
                    <div className="text-xs text-gray-600">
                      Automatic profanity and spam filtering
                    </div>
                  </div>
                  <Switch
                    checked={formData.settings.profanityFilter}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          profanityFilter: checked,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Limits */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Room Limits
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Maximum Members</Label>
                  <Select
                    value={formData.settings.maxMembers.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          maxMembers: parseInt(value),
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 members</SelectItem>
                      <SelectItem value="10">10 members</SelectItem>
                      {userTier !== "free" && (
                        <SelectItem value="20">20 members</SelectItem>
                      )}
                      {userTier === "premium" && (
                        <SelectItem value="50">50 members</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Invite Link Expiry</Label>
                  <Select
                    value={formData.settings.inviteExpiry.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          inviteExpiry: parseInt(value),
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="168">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Create Private Watchlist Room
          </DialogTitle>
        </DialogHeader>

        <StepIndicator />

        <div className="space-y-6">
          {step === 1 && <Step1Content />}
          {step === 2 && <Step2Content />}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step < 2 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
