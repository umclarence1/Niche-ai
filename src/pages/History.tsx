import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Search, Filter, Check, X, History as HistoryIcon, Bot, TrendingUp, AlertCircle, RefreshCw, FileText, Sparkles, Copy, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTasks, useWorkflows, useAIResults } from "@/store/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const [viewResultDialog, setViewResultDialog] = useState<{ open: boolean; result: any | null }>({
    open: false,
    result: null,
  });
  const { toast } = useToast();
  const { tasks } = useTasks();
  const { workflows } = useWorkflows();
  const { aiResults, deleteAIResult } = useAIResults();

  // Combine tasks and workflows into history items
  const completedTasks = tasks
    .filter(t => t.status === "completed" || t.status === "failed")
    .map(t => ({
      id: t.id,
      type: "task" as const,
      name: t.name,
      date: t.completedAt
        ? new Date(t.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: t.completedAt
        ? new Date(t.completedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        : new Date(t.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      status: t.status as "completed" | "failed" | "running",
      duration: t.duration || "N/A",
      agent: t.agentName,
      timestamp: t.completedAt || t.createdAt
    }));

  const workflowHistory = workflows.map(w => ({
    id: w.id,
    type: "workflow" as const,
    name: w.name,
    date: (w.completedAt || w.startedAt)
      ? new Date(w.completedAt || w.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    time: (w.completedAt || w.startedAt)
      ? new Date(w.completedAt || w.startedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      : "",
    status: w.status === "completed" ? "completed" as const : w.status === "failed" ? "failed" as const : "running" as const,
    duration: w.duration || "N/A",
    agent: w.agentName,
    timestamp: w.completedAt || w.startedAt
  }));

  // AI Results history
  const aiResultsHistory = aiResults.map(r => ({
    id: r.id,
    type: "ai" as const,
    name: `${r.actionType.charAt(0).toUpperCase() + r.actionType.slice(1)} - ${r.documentName}`,
    date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    status: "completed" as const,
    duration: r.duration || "N/A",
    agent: r.agentType,
    timestamp: r.createdAt,
    actionType: r.actionType,
    documentName: r.documentName,
    output: r.output,
  }));

  // Combine and sort by timestamp (most recent first)
  const allHistory = [...completedTasks, ...workflowHistory, ...aiResultsHistory]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredHistory = allHistory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agent.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "ai") return matchesSearch && item.type === "ai";
    if (activeTab === "tasks") return matchesSearch && item.type === "task";
    if (activeTab === "workflows") return matchesSearch && item.type === "workflow";
    return matchesSearch;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <Check className="h-3.5 w-3.5" />,
          styles: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
        };
      case "running":
        return {
          icon: <RefreshCw className="h-3.5 w-3.5 animate-spin" />,
          styles: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        };
      case "failed":
        return {
          icon: <X className="h-3.5 w-3.5" />,
          styles: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
        };
      default:
        return {
          icon: <Clock className="h-3.5 w-3.5" />,
          styles: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ai":
        return <Sparkles className="h-5 w-5 text-amber-500" />;
      case "task":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "workflow":
        return <Bot className="h-5 w-5 text-purple-500" />;
      default:
        return <Bot className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const handleCopyResult = async (output: string) => {
    await navigator.clipboard.writeText(output);
    toast({
      title: "Copied",
      description: "Result copied to clipboard",
    });
  };

  const completedCount = allHistory.filter(w => w.status === "completed").length;
  const failedCount = allHistory.filter(w => w.status === "failed").length;
  const aiCount = aiResultsHistory.length;
  const successRate = allHistory.length > 0
    ? Math.round((completedCount / (completedCount + failedCount || 1)) * 100)
    : 0;

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                History & Results
              </h1>
              <HistoryIcon className="h-5 w-5 sm:h-6 sm:w-6 text-niche-pink" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm lg:text-base">
              View all your AI results, tasks, and workflow history
            </p>
          </div>
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-700 text-sm">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total Runs", value: allHistory.length, icon: HistoryIcon, color: "text-slate-900 dark:text-slate-100" },
            { label: "AI Results", value: aiCount, icon: Sparkles, color: "text-amber-600 dark:text-amber-400" },
            { label: "Completed", value: completedCount, icon: Check, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp, color: "text-niche-cyan" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs font-medium">{stat.label}</span>
              </div>
              <p className={cn("text-xl sm:text-2xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs and Main Card */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-niche-pink to-rose-500 shadow-lg">
                    <HistoryIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      All Activity
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {filteredHistory.length} total items
                    </CardDescription>
                  </div>
                </div>
                <div className="relative w-full sm:w-64 lg:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search history..."
                    className="pl-10 h-9 sm:h-10 rounded-xl border-slate-200 dark:border-slate-700 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-9 sm:h-10">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs sm:text-sm gap-1">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="hidden sm:inline">AI Results</span>
                    <span className="sm:hidden">AI</span>
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tasks</TabsTrigger>
                  <TabsTrigger value="workflows" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">Workflows</span>
                    <span className="sm:hidden">Flows</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                  {searchQuery ? "No matching activity" : "No activity history"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-sm text-sm">
                  {searchQuery ? "Try adjusting your search query" : "Complete a task, workflow, or AI action to see history here"}
                </p>
                {searchQuery && (
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
                {filteredHistory.map((item, index) => {
                  const statusConfig = getStatusConfig(item.status);
                  const isExpanded = expandedResultId === item.id;
                  const isAIResult = item.type === "ai";

                  return (
                    <div
                      key={item.id}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200",
                          isAIResult && "cursor-pointer"
                        )}
                        onClick={() => isAIResult && setExpandedResultId(isExpanded ? null : item.id)}
                      >
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors shrink-0">
                          {getTypeIcon(item.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 sm:gap-4">
                            <div className="min-w-0">
                              <h4 className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate group-hover:text-niche-cyan transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                {item.agent}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={cn(
                                "inline-flex items-center gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border font-medium capitalize",
                                statusConfig.styles
                              )}>
                                {statusConfig.icon}
                                <span className="hidden sm:inline">{item.status}</span>
                              </span>
                              {isAIResult && (
                                isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-slate-400" />
                                )
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="hidden sm:inline">{item.date} at {item.time}</span>
                              <span className="sm:hidden">{item.time}</span>
                            </span>
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">
                              {item.duration}
                            </span>
                            {isAIResult && (
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">
                                {(item as any).actionType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded AI Result */}
                      {isAIResult && isExpanded && (
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-slate-50 dark:bg-slate-800/30">
                          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <h5 className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                                Result Output
                              </h5>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 text-xs gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyResult((item as any).output);
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                  <span className="hidden sm:inline">Copy</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 text-xs gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setViewResultDialog({ open: true, result: item });
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                  <span className="hidden sm:inline">Full View</span>
                                </Button>
                              </div>
                            </div>
                            <ScrollArea className="max-h-32 sm:max-h-48 rounded-md bg-slate-50 dark:bg-slate-800/50 p-2 sm:p-3">
                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {(item as any).output.length > 500
                                  ? (item as any).output.substring(0, 500) + "..."
                                  : (item as any).output}
                              </p>
                            </ScrollArea>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Result Dialog */}
      <Dialog open={viewResultDialog.open} onOpenChange={(open) => setViewResultDialog({ open, result: open ? viewResultDialog.result : null })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {viewResultDialog.result?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {viewResultDialog.result?.output}
              </p>
            </ScrollArea>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleCopyResult(viewResultDialog.result?.output || "")}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={() => setViewResultDialog({ open: false, result: null })}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default History;
