import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  X,
  Users,
  DollarSign,
  Mail,
  Link,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: any) => void;
}

const POPULAR_TICKERS = [
  "TSLA",
  "NVDA",
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "SPY",
  "QQQ",
  "AMD",
  "NFLX",
  "CRM",
  "UBER",
  "ABNB",
  "COIN",
  "PLTR",
  "SOFI",
  "RIVN",
  "LCID",
  "NIO",
];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
}) => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [inviteMethod, setInviteMethod] = useState<
    "username" | "email" | "link"
  >("link");
  const [inviteInput, setInviteInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  const handleAddTicker = (ticker: string) => {
    if (selectedTickers.length < 5 && !selectedTickers.includes(ticker)) {
      setSelectedTickers([...selectedTickers, ticker]);
    }
  };

  const handleRemoveTicker = (ticker: string) => {
    setSelectedTickers(selectedTickers.filter((t) => t !== ticker));
  };

  const handleCreate = () => {
    if (!roomName.trim() || selectedTickers.length === 0) return;

    const roomData = {
      name: roomName.trim(),
      description: description.trim(),
      tickers: selectedTickers,
      isPrivate,
      inviteMethod,
      invites: inviteInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };

    onCreateRoom(roomData);

    // Reset form
    setRoomName("");
    setDescription("");
    setSelectedTickers([]);
    setInviteInput("");
    setIsPrivate(true);
    setInviteMethod("link");

    onClose();
  };

  const isValid = roomName.trim().length > 0 && selectedTickers.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="w-5 h-5 text-blue-600" />
            Create Private Room
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Room Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Room Name *
            </label>
            <Input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g., AI & Tech Watchlist"
              maxLength={50}
              className="bg-white dark:bg-gray-800"
            />
            <div className="text-xs text-gray-500 mt-1">
              {roomName.length}/50
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Description (Optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Discuss AI and tech stocks, share insights..."
              maxLength={200}
              className="h-20 bg-white dark:bg-gray-800 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {description.length}/200
            </div>
          </div>

          {/* Ticker Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Select Tickers * (1-5)
            </label>

            {/* Selected Tickers */}
            {selectedTickers.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTickers.map((ticker) => (
                  <Badge
                    key={ticker}
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 pr-1"
                  >
                    ${ticker}
                    <button
                      onClick={() => handleRemoveTicker(ticker)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Ticker Grid */}
            <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
              {POPULAR_TICKERS.map((ticker) => (
                <Button
                  key={ticker}
                  variant={
                    selectedTickers.includes(ticker) ? "default" : "outline"
                  }
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAddTicker(ticker)}
                  disabled={
                    selectedTickers.length >= 5 &&
                    !selectedTickers.includes(ticker)
                  }
                >
                  ${ticker}
                </Button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {selectedTickers.length}/5 tickers selected
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <label
              htmlFor="private"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Private Room (invite only)
            </label>
          </div>

          {/* Invite Method */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Invite Method
            </label>
            <Select
              value={inviteMethod}
              onValueChange={(value: any) => setInviteMethod(value)}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Share Link
                  </div>
                </SelectItem>
                <SelectItem value="username">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    By Username
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    By Email
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {inviteMethod !== "link" && (
              <div className="mt-2">
                <Input
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder={
                    inviteMethod === "username"
                      ? "username1, username2..."
                      : "email1@example.com, email2@example.com..."
                  }
                  className="bg-white dark:bg-gray-800"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Separate multiple {inviteMethod}s with commas
                </div>
              </div>
            )}
          </div>

          {/* Validation Warning */}
          {!isValid && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                Room name and at least one ticker are required
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!isValid}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
