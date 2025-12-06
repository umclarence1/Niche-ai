import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { chatWithContext, ChatMessage } from "@/lib/openai";
import { extractTextFromFile } from "@/services/DocumentProcessor";
import { Document } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface DocumentChatProps {
  document: Document | null;
  agentType?: string;
  onClose?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DocumentChat: React.FC<DocumentChatProps> = ({
  document,
  agentType = "analyst",
  onClose,
  isExpanded = false,
  onToggleExpand,
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract document content when document changes
  useEffect(() => {
    if (document?.url) {
      setIsProcessing(true);

      // Check if blob URL is valid (blob URLs expire after page refresh)
      const isBlobUrl = document.url.startsWith('blob:');

      fetch(document.url)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch document');
          return res.blob();
        })
        .then((blob) => {
          const file = new File([blob], document.name, { type: document.mimeType });
          return extractTextFromFile(file);
        })
        .then((processed) => {
          setDocumentContent(processed.content);
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: `I've loaded "${document.name}" (${processed.wordCount.toLocaleString()} words). Ask me anything about this document!`,
              timestamp: new Date(),
            },
          ]);
        })
        .catch((error) => {
          console.error("Error processing document:", error);
          const errorMessage = isBlobUrl
            ? "Document file expired. Please re-upload the document."
            : "Could not process the document content";
          toast({
            title: "Error loading document",
            description: errorMessage,
            variant: "destructive",
          });
          setMessages([
            {
              id: "error",
              role: "assistant",
              content: isBlobUrl
                ? `The file "${document.name}" has expired. Documents uploaded in a previous session need to be re-uploaded. Please go back and upload the file again.`
                : `There was an error loading "${document.name}". Please try again.`,
              timestamp: new Date(),
            },
          ]);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [document, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !documentContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Convert messages to ChatMessage format for API
      const chatHistory: ChatMessage[] = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await chatWithContext(
        chatHistory,
        userMessage.content,
        documentContent,
        agentType
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const quickQuestions = [
    "Summarize this document",
    "What are the key points?",
    "Extract important data",
    "What conclusions can be drawn?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  if (!document) {
    return (
      <Card className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            No Document Selected
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select a document to start chatting
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden border-slate-200/80 dark:border-slate-800/80 transition-all duration-300",
        isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "h-full"
      )}
    >
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-niche-purple/10 to-niche-cyan/10 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-niche-purple to-niche-cyan shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Document Chat
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {document.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onToggleExpand && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onToggleExpand}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        {isProcessing ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-niche-cyan mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Processing document...
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-niche-purple to-niche-cyan flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.role === "user"
                        ? "bg-gradient-to-r from-niche-purple to-niche-cyan text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.role === "user"
                          ? "text-white/70"
                          : "text-slate-400 dark:text-slate-500"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-niche-purple to-niche-cyan flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-niche-cyan" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && !isLoading && (
              <div className="mt-6">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-niche-cyan/10 hover:text-niche-cyan transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this document..."
            disabled={isLoading || isProcessing}
            className="flex-1 rounded-xl border-slate-200 dark:border-slate-700"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading || isProcessing}
            className="rounded-xl btn-gradient"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default DocumentChat;
