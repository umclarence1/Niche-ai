import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Clock, X, ArrowRight, History, Bot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkflows, useTasks } from "@/store/AppContext";
import { formatDateTime } from "@/types";

const WorkflowHistory = () => {
  const { workflows } = useWorkflows();
  const { tasks } = useTasks();

  // Combine workflows and completed tasks for history display
  const completedTasks = tasks
    .filter(t => t.status === "completed" || t.status === "failed")
    .map(t => ({
      id: t.id,
      name: t.name,
      date: t.completedAt ? new Date(t.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      time: t.completedAt ? new Date(t.completedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "",
      status: t.status as "completed" | "failed" | "running",
      agent: t.agentName,
      duration: t.duration || "N/A"
    }));

  const workflowItems = workflows.map(w => ({
    id: w.id,
    name: w.name,
    date: w.completedAt ? new Date(w.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date(w.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: w.completedAt ? new Date(w.completedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : new Date(w.startedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    status: w.status === "completed" ? "completed" as const : w.status === "failed" ? "failed" as const : "running" as const,
    agent: w.agentName,
    duration: w.duration || "N/A"
  }));

  // Combine and sort by date, show most recent first
  const recentWorkflows = [...completedTasks, ...workflowItems]
    .sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
    .slice(0, 5);

  // Calculate stats
  const allItems = [...completedTasks, ...workflowItems];
  const completedCount = allItems.filter(w => w.status === "completed").length;
  const failedCount = allItems.filter(w => w.status === "failed").length;

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

  return (
    <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-niche-purple to-niche-pink shadow-lg">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Your latest automation runs
              </CardDescription>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-niche-cyan hover:text-niche-purple hover:bg-niche-cyan/5 transition-colors">
            <Link to="/history">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {recentWorkflows.length > 0 ? (
          <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
            {recentWorkflows.map((workflow, index) => {
              const statusConfig = getStatusConfig(workflow.status);
              return (
                <div
                  key={workflow.id}
                  className="group p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-200">
                      <Bot className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-niche-cyan transition-colors">
                            {workflow.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {workflow.agent}
                          </p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium capitalize shrink-0",
                          statusConfig.styles
                        )}>
                          {statusConfig.icon}
                          {workflow.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {workflow.date} at {workflow.time}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">
                          {workflow.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">No Activity Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Complete a task to see your history here
            </p>
          </div>
        )}

        {/* Quick Stats Footer */}
        {allItems.length > 0 && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                All time
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3 w-3" />
                  {completedCount} completed
                </span>
                {failedCount > 0 && (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <X className="h-3 w-3" />
                    {failedCount} failed
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowHistory;
