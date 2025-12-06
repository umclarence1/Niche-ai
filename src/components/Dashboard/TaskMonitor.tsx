import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, PlayCircle, StopCircle, ChevronDown, ChevronUp, Activity, CheckCircle2, Circle, Loader2, PlusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { useTasks, useAgents } from "@/store/AppContext";
import { Task as TaskType, TaskStatus } from "@/types";
import { executeTask, pauseTask, createTask } from "@/services/AgentService";

const TaskMonitor: React.FC = () => {
  const { toast } = useToast();
  const { tasks, addTask, updateTask, setTaskStatus } = useTasks();
  const { agents } = useAgents();

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [runningTaskIds, setRunningTaskIds] = useState<Set<string>>(new Set());

  const toggleExpandTask = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleTaskUpdate = useCallback((updatedTask: TaskType) => {
    updateTask(updatedTask.id, updatedTask);
  }, [updateTask]);

  const handleTaskComplete = useCallback((completedTask: TaskType) => {
    setRunningTaskIds(prev => {
      const next = new Set(prev);
      next.delete(completedTask.id);
      return next;
    });

    if (completedTask.status === "completed") {
      toast({
        title: "Task Completed",
        description: `"${completedTask.name}" has finished successfully`,
      });
    } else if (completedTask.status === "failed") {
      toast({
        title: "Task Failed",
        description: `"${completedTask.name}" encountered an error`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleStartTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setRunningTaskIds(prev => new Set(prev).add(taskId));
    setExpandedTasks(prev => ({ ...prev, [taskId]: true }));

    toast({
      title: "Task Started",
      description: `"${task.name}" is now running`,
    });

    await executeTask(task, handleTaskUpdate, handleTaskComplete);
  };

  const handleStopTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    pauseTask(taskId);
    setRunningTaskIds(prev => {
      const next = new Set(prev);
      next.delete(taskId);
      return next;
    });
    setTaskStatus(taskId, "paused");

    toast({
      title: "Task Paused",
      description: `"${task.name}" has been paused`,
    });
  };

  const handleCreateSampleTask = () => {
    if (agents.length === 0) {
      toast({
        title: "No Agents Available",
        description: "Create an agent first to run tasks",
        variant: "destructive",
      });
      return;
    }

    const agent = agents[Math.floor(Math.random() * agents.length)];
    const sampleTasks = [
      { name: "Data Analysis Report", description: "Analyze quarterly financial data" },
      { name: "Document Processing", description: "Process and summarize uploaded documents" },
      { name: "Research Compilation", description: "Compile research findings into report" },
      { name: "Market Analysis", description: "Analyze current market trends" },
    ];

    const sample = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
    const task = createTask(sample.name, sample.description, agent);

    addTask(task);
    setExpandedTasks(prev => ({ ...prev, [task.id]: true }));

    toast({
      title: "Task Created",
      description: `"${task.name}" assigned to ${agent.name}`,
    });
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-niche-cyan animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "queued":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "paused":
        return <Circle className="h-4 w-4 text-amber-500" />;
      default:
        return <Circle className="h-4 w-4 text-slate-300" />;
    }
  };

  const getStatusBadgeStyles = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "running":
        return "bg-niche-cyan/10 text-niche-cyan border-niche-cyan/20";
      case "failed":
        return "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      case "queued":
        return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "paused":
        return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  // Filter to show recent/active tasks
  const displayTasks = tasks.slice(0, 10);

  return (
    <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Active Tasks
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Monitor and control your agent's tasks
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 rounded-xl"
            onClick={handleCreateSampleTask}
          >
            <PlusCircle className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {displayTasks.length > 0 ? (
          <div className="space-y-4">
            {displayTasks.map((task) => (
              <Collapsible
                key={task.id}
                open={expandedTasks[task.id]}
                onOpenChange={() => toggleExpandTask(task.id)}
                className={cn(
                  "rounded-xl border transition-all duration-300",
                  task.status === "running"
                    ? "border-niche-cyan/30 bg-gradient-to-r from-niche-cyan/5 to-transparent shadow-sm"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          {expandedTasks[task.id] ?
                            <ChevronUp className="h-4 w-4 text-slate-500" /> :
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          }
                        </Button>
                      </CollapsibleTrigger>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">{task.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{task.agentName}</span>
                          <span className={cn(
                            "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium capitalize",
                            getStatusBadgeStyles(task.status)
                          )}>
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {(task.status === "idle" || task.status === "queued" || task.status === "paused") && (
                        <Button
                          size="sm"
                          className="h-9 rounded-xl btn-gradient shadow-md"
                          onClick={() => handleStartTask(task.id)}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          {task.status === "paused" ? "Resume" : "Start"}
                        </Button>
                      )}
                      {task.status === "running" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 rounded-xl text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/50"
                          onClick={() => handleStopTask(task.id)}
                        >
                          <StopCircle className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>

                  {(task.status === "running" || task.status === "completed" || task.progress > 0) && (
                    <div className="mt-4 ml-11">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{task.progress}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={task.progress} className="h-2 bg-slate-100 dark:bg-slate-800" />
                        {task.status === "running" && (
                          <div className="absolute inset-0 h-2 bg-gradient-to-r from-niche-cyan/0 via-white/30 to-niche-cyan/0 animate-shimmer rounded-full" />
                        )}
                      </div>
                      {(task.startedAt || task.duration) && (
                        <div className="flex justify-between text-xs mt-2 text-slate-500 dark:text-slate-400">
                          {task.startedAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Started: {new Date(task.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {task.duration && <span>Duration: {task.duration}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <div className="ml-11 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                        Task Steps
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {task.steps.map((step, index) => (
                          <div
                            key={step.id || index}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              step.status === 'running' && "bg-niche-cyan/10 border border-niche-cyan/20",
                              step.status === 'completed' && "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50",
                              (step.status === 'queued' || step.status === 'pending') && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50",
                              step.status === 'idle' && "bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50",
                              step.status === 'failed' && "bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50"
                            )}
                          >
                            {getStatusIcon(step.status)}
                            <span className={cn(
                              "truncate",
                              step.status === 'completed' && "text-emerald-700 dark:text-emerald-300",
                              step.status === 'running' && "text-niche-cyan font-medium",
                              step.status === 'failed' && "text-red-700 dark:text-red-300",
                              (step.status === 'queued' || step.status === 'idle') && "text-slate-600 dark:text-slate-400"
                            )}>
                              {step.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      {task.output && (
                        <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
                          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">Output</p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">{task.output}</p>
                        </div>
                      )}
                      {task.error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
                          <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Error</p>
                          <p className="text-sm text-red-600 dark:text-red-400">{task.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">No Active Tasks</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Create a task or start a new workflow to get started
            </p>
            <Button
              className="mt-4 gap-2 btn-gradient"
              onClick={handleCreateSampleTask}
            >
              <PlusCircle className="h-4 w-4" />
              Create Sample Task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskMonitor;
