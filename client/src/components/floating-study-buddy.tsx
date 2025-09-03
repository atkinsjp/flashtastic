import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, MessageCircle, Sparkles, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/contexts/auth-context";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "buddy";
  timestamp: Date;
  type?: "text" | "suggestion" | "encouragement";
}

interface FloatingStudyBuddyProps {
  currentSubject?: string;
  currentGrade?: string;
}

export function FloatingStudyBuddy({ currentSubject = "general", currentGrade = "3" }: FloatingStudyBuddyProps) {
  const { canAccess } = useSubscription();
  const { user, isGuest } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dailyQuestionsUsed, setDailyQuestionsUsed] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: `Hi ${user?.name || 'there'}! 🤖 I'm your AI study buddy! I can help you with ${currentSubject} concepts for grade ${currentGrade}. What would you like to learn about today?`,
      sender: "buddy",
      timestamp: new Date(),
      type: "encouragement"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasUnreadMessages(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnreadMessages(false);
    }
  }, [isOpen]);

  const quickSuggestions = [
    "Explain this topic simply",
    "Give me practice questions", 
    "How can I remember this better?",
    "What's a fun way to learn this?"
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Check AI question limit for free users
    if (!canAccess('unlimited_questions') && dailyQuestionsUsed >= 5) {
      const limitMessage: ChatMessage = {
        id: `limit-${Date.now()}`,
        content: "You've reached the daily limit for AI questions. Upgrade to Premium for unlimited access! 🚀",
        sender: "buddy",
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Increment question count for free users
    if (!canAccess('unlimited_questions')) {
      setDailyQuestionsUsed(prev => prev + 1);
    }

    try {
      // Send to AI study buddy endpoint
      const response = await fetch("/api/study-buddy/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          subject: currentSubject,
          grade: currentGrade,
          conversationHistory: messages.slice(-5).map(msg => ({
            content: msg.content,
            sender: msg.sender
          })),
          userProgress: {
            points: user?.points,
            level: user?.level,
            streak: user?.streak,
            recentSubjects: [currentSubject]
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const buddyMessage: ChatMessage = {
        id: `buddy-${Date.now()}`,
        content: data.message,
        sender: "buddy",
        timestamp: new Date(),
        type: data.type || "text"
      };

      setMessages(prev => [...prev, buddyMessage]);
    } catch (error) {
      console.error("Study buddy error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I'm having trouble thinking right now. Could you try asking again? 🤔",
        sender: "buddy",
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
        data-testid="floating-study-buddy-button"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 relative"
          data-testid="button-open-study-buddy"
        >
          <Bot className="h-6 w-6 text-white" />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </Button>
      </motion.div>
    );
  }

  // Chat widget when open
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ 
        scale: isMinimized ? 0.8 : 1, 
        opacity: 1, 
        y: 0,
        height: isMinimized ? "60px" : "500px"
      }}
      className="fixed bottom-6 right-6 z-50 w-80"
      data-testid="floating-study-buddy-chat"
    >
      <Card className="h-full flex flex-col shadow-2xl border-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <h3 className="font-semibold text-sm">AI Study Buddy</h3>
              {!canAccess('unlimited_questions') && (
                <p className="text-xs opacity-90">
                  {dailyQuestionsUsed}/5 questions today
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              data-testid="button-minimize-study-buddy"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              data-testid="button-close-study-buddy"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col flex-1"
            >
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 max-h-80">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                          message.sender === "user"
                            ? "bg-purple-500 text-white"
                            : message.type === "encouragement"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : message.type === "suggestion"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.sender === "buddy" && (
                          <div className="flex items-center gap-1 mb-1">
                            <Bot className="h-3 w-3" />
                            <span className="text-xs font-medium">AI Buddy</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {quickSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => sendMessage(suggestion)}
                        disabled={!canAccess('unlimited_questions') && dailyQuestionsUsed >= 5}
                        data-testid={`button-suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading || (!canAccess('unlimited_questions') && dailyQuestionsUsed >= 5)}
                    className="text-sm"
                    data-testid="input-study-buddy-message"
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim() || (!canAccess('unlimited_questions') && dailyQuestionsUsed >= 5)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                    data-testid="button-send-study-buddy-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!canAccess('unlimited_questions') && dailyQuestionsUsed >= 5 && (
                  <p className="text-xs text-orange-600 mt-2 text-center">
                    Daily limit reached. <span className="font-semibold cursor-pointer hover:underline">Upgrade to Premium</span> for unlimited access!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}