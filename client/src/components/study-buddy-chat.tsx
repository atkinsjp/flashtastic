import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Sparkles, Lock, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { useSubscription, useFeatureAccess } from "@/hooks/use-subscription";
import { ContentReportModal } from "./content-report-modal";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "buddy";
  timestamp: Date;
  type?: "text" | "suggestion" | "encouragement";
}

interface StudyBuddyChatProps {
  currentSubject?: string;
  currentGrade?: string;
  recentTopics?: string[];
  onClose?: () => void;
}

export function StudyBuddyChat({ 
  currentSubject, 
  currentGrade, 
  recentTopics = [],
  onClose 
}: StudyBuddyChatProps) {
  const { showUpgradeModal } = useSubscription();
  const { hasUnlimitedAI, dailyAILimit } = useFeatureAccess();
  const [dailyQuestionsUsed, setDailyQuestionsUsed] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: `Hi there! I'm your AI study buddy! 🤖 I'm here to help you learn ${currentSubject || "any subject"} for grade ${currentGrade || "your level"}. Ask me questions, and I'll explain concepts, give examples, or help you practice!`,
      sender: "buddy",
      timestamp: new Date(),
      type: "encouragement"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedMessageForReport, setSelectedMessageForReport] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    "Explain this topic simply",
    "Give me practice questions", 
    "What should I study next?",
    "How can I remember this better?",
    "Can you make this fun?"
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Check AI question limit for free users
    if (!hasUnlimitedAI && dailyQuestionsUsed >= dailyAILimit) {
      showUpgradeModal('ai_limit');
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
    if (!hasUnlimitedAI) {
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
          recentTopics,
          conversationHistory: messages.slice(-5).map(msg => ({
            content: msg.content,
            sender: msg.sender
          }))
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
        type: data.type === "suggestion" || data.type === "encouragement" ? data.type : "text"
      };

      setMessages(prev => [...prev, buddyMessage]);
    } catch (error) {
      console.error("Study buddy error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I'm having trouble thinking right now. Could you try asking again?",
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

  const handleQuickSuggestion = (suggestion: string) => {
    if (!hasUnlimitedAI && dailyQuestionsUsed >= dailyAILimit) {
      showUpgradeModal('ai_limit');
      return;
    }
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <Card className="h-full flex flex-col max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Study Buddy</CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentSubject} • Grade {currentGrade}
                {!hasUnlimitedAI && (
                  <span className="ml-2">
                    ({dailyQuestionsUsed}/{dailyAILimit} questions today)
                  </span>
                )}
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-chat-button">
              ✕
            </Button>
          )}
        </div>
        
        {/* Upgrade prompt for free users */}
        {!hasUnlimitedAI && dailyQuestionsUsed >= dailyAILimit - 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200"
          >
            <div className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-purple-600" />
              <span className="text-purple-800">
                {dailyQuestionsUsed >= dailyAILimit ? 
                  "Daily limit reached! Upgrade for unlimited AI tutoring." : 
                  `${dailyAILimit - dailyQuestionsUsed} question remaining today.`
                }
              </span>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={() => showUpgradeModal('ai_limit')}
                data-testid="upgrade-ai-button"
              >
                Upgrade Now
              </Button>
            </div>
          </motion.div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "buddy" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : message.type === "encouragement"
                        ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border border-green-200"
                        : message.type === "suggestion"
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1 px-2">
                    <p className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.sender === "buddy" && message.id !== "welcome" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMessageForReport(message);
                          setReportModalOpen(true);
                        }}
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-red-600"
                        data-testid={`report-message-${message.id}`}
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                    )}
                  </div>
                </div>

                {message.sender === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length <= 2 && !(!hasUnlimitedAI && dailyQuestionsUsed >= dailyAILimit) && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="text-xs"
                  disabled={isLoading}
                  data-testid={`quick-suggestion-${index}`}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder={
              !hasUnlimitedAI && dailyQuestionsUsed >= dailyAILimit 
                ? "Upgrade for unlimited AI tutoring..."
                : "Ask me anything about your studies..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading || (!hasUnlimitedAI && dailyQuestionsUsed >= dailyAILimit)}
            data-testid="chat-input"
          />
          <Button 
            onClick={() => sendMessage(inputMessage)} 
            disabled={
              isLoading || 
              !inputMessage.trim() || 
              (!hasUnlimitedAI && dailyQuestionsUsed >= dailyAILimit)
            }
            size="icon"
            data-testid="send-message-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {/* Content Report Modal */}
      {selectedMessageForReport && (
        <ContentReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setSelectedMessageForReport(null);
          }}
          contentType="ai_response"
          contentText={selectedMessageForReport.content}
          contentId={selectedMessageForReport.id}
        />
      )}
    </Card>
  );
}