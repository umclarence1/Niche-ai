import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Database,
  BarChart3,
  FileSpreadsheet,
  Search,
  Loader2,
  Copy,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  summarizeDocument,
  extractData,
  generateReport,
  conductResearch,
} from "@/lib/openai";
import { extractTextFromFile } from "@/services/DocumentProcessor";
import { Document, AIActionType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useAIResults } from "@/store/AppContext";

interface DocumentActionsProps {
  document: Document | null;
  agentType?: string;
  onClose?: () => void;
}

type ActionType = "summarize" | "extract" | "analyze" | "report" | "research";

interface Action {
  id: ActionType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const actions: Action[] = [
  {
    id: "summarize",
    name: "Summarize",
    description: "Generate a comprehensive summary",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "extract",
    name: "Extract Data",
    description: "Extract structured information",
    icon: Database,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "analyze",
    name: "Analyze",
    description: "Deep content analysis",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "report",
    name: "Generate Report",
    description: "Create a detailed report",
    icon: FileSpreadsheet,
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "research",
    name: "Research",
    description: "Conduct research on the content",
    icon: Search,
    color: "from-rose-500 to-rose-600",
  },
];

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  agentType = "analyst",
  onClose,
}) => {
  const { toast } = useToast();
  const { addAIResult } = useAIResults();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const executeAction = async (actionId: ActionType) => {
    if (!document?.url || isProcessing) return;

    const actionStartTime = Date.now();
    setStartTime(actionStartTime);
    setIsProcessing(true);
    setCurrentAction(actionId);
    setProgress(10);
    setResult(null);

    // Check if blob URL (these expire after page refresh)
    const isBlobUrl = document.url.startsWith('blob:');

    try {
      // Fetch and process document
      setProgress(20);
      const response = await fetch(document.url);
      if (!response.ok) {
        throw new Error(isBlobUrl
          ? "Document file expired. Please re-upload the document."
          : "Failed to fetch document");
      }
      const blob = await response.blob();
      const file = new File([blob], document.name, { type: document.mimeType });

      setProgress(40);
      const processed = await extractTextFromFile(file);

      setProgress(60);

      let output: string;

      switch (actionId) {
        case "summarize":
          output = await summarizeDocument(processed.content, agentType);
          break;
        case "extract":
          output = await extractData(processed.content, "general", agentType);
          break;
        case "analyze":
          output = await summarizeDocument(processed.content, agentType);
          break;
        case "report":
          output = await generateReport(processed.content, "analysis", agentType);
          break;
        case "research":
          output = await conductResearch(document.name, processed.content, agentType);
          break;
        default:
          output = await summarizeDocument(processed.content, agentType);
      }

      setProgress(100);
      setResult(output);

      // Calculate duration
      const duration = Date.now() - actionStartTime;
      const durationStr = duration < 1000
        ? `${duration}ms`
        : duration < 60000
          ? `${(duration / 1000).toFixed(1)}s`
          : `${Math.floor(duration / 60000)}m ${Math.floor((duration % 60000) / 1000)}s`;

      // Save result to store
      addAIResult({
        documentId: document.id,
        documentName: document.name,
        actionType: actionId as AIActionType,
        agentType: agentType,
        output: output,
        duration: durationStr,
      });

      toast({
        title: "Action Completed",
        description: `${actions.find((a) => a.id === actionId)?.name} finished successfully`,
      });
    } catch (error: any) {
      console.error("Action error:", error);
      // Provide helpful error message for expired blob URLs
      const errorMessage = error.message?.includes("expired") || (isBlobUrl && error.message?.includes("fetch"))
        ? "Document file expired. Please re-upload the document."
        : error.message || "Failed to process document";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Result copied to clipboard",
    });
  };

  const clearResult = () => {
    setResult(null);
    setCurrentAction(null);
    setProgress(0);
  };

  if (!document) {
    return (
      <Card className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            No Document Selected
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select a document to use AI actions
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border-slate-200/80 dark:border-slate-800/80">
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                AI Actions
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {document.name}
              </p>
            </div>
          </div>
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
      </CardHeader>

      <CardContent className="flex-1 p-3 sm:p-4 overflow-hidden flex flex-col">
        {/* Action Buttons */}
        {!result && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
            {actions.map((action) => {
              const Icon = action.icon;
              const isActive = currentAction === action.id;

              return (
                <button
                  key={action.id}
                  onClick={() => executeAction(action.id)}
                  disabled={isProcessing}
                  className={cn(
                    "relative overflow-hidden rounded-xl p-3 sm:p-4 text-left transition-all duration-200",
                    "border border-slate-200 dark:border-slate-700",
                    isProcessing && !isActive
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md cursor-pointer active:scale-95",
                    isActive && "ring-2 ring-niche-cyan"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br",
                      action.color
                    )}
                  >
                    {isActive && isProcessing ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    )}
                  </div>
                  <h4 className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {action.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Progress */}
        {isProcessing && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-600 dark:text-slate-400">
                Processing...
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Result
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={clearResult}
                >
                  New Action
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {result}
              </p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentActions;
