import { useState } from "react";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AiChatInterface } from "./AiChatInterface";

export const AiChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Bubble - Fixed positioning */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          size="lg"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Interface - Full screen/modal */}
      {isOpen && (
        <Card
          className={`fixed z-50 bg-background border shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
            isMinimized
              ? "bottom-6 right-6 w-80 h-12"
              : "bottom-6 right-6 w-96 h-[600px] md:w-[480px] md:h-[700px]"
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">MoodMeter AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={minimizeChat}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden min-h-0">
              <AiChatInterface />
            </div>
          )}
        </Card>
      )}
    </>
  );
};
