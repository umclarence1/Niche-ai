
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, PlayCircle, StopCircle, ChevronDown, ChevronUp } from "lucide-react";
import StatusBadge from "../ui/custom/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

interface TaskStep {
  name: string;
  status: "idle" | "running" | "completed" | "failed" | "pending";
}

interface Task {
  id: string;
  name: string;
  status: "idle" | "running" | "completed" | "failed" | "pending";
  progress: number;
  startTime?: string;
  eta?: string;
  steps: TaskStep[];
}

const TaskMonitor: React.FC = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      name: "Financial Report Generation",
      status: "running",
      progress: 65,
      startTime: "10:32 AM",
      eta: "2 minutes",
      steps: [
        { name: "Data Collection", status: "completed" },
        { name: "Data Analysis", status: "completed" },
        { name: "Report Generation", status: "running" },
        { name: "Client Email", status: "pending" },
        { name: "Database Update", status: "pending" },
      ],
    },
    {
      id: "task-2",
      name: "Tax Filing Preparation",
      status: "idle",
      progress: 0,
      steps: [
        { name: "Document Review", status: "idle" },
        { name: "Calculation", status: "idle" },
        { name: "Form Filling", status: "idle" },
        { name: "Verification", status: "idle" },
      ],
    },
  ]);
  
  // Track which tasks have expanded details
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({
    "task-1": true,
    "task-2": false
  });

  const toggleExpandTask = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleStartTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        toast({
          title: "Task Started",
          description: `"${task.name}" is now running`,
        });
        
        return {
          ...task,
          status: "running" as const,
          progress: 5,
          startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          eta: "Calculating...",
          steps: task.steps.map((step, index) => ({
            ...step,
            status: index === 0 ? "running" : "pending"
          }))
        };
      }
      return task;
    }));

    // Simulate progress updates for the started task
    const progressInterval = setInterval(() => {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => {
          if (task.id === taskId && task.status === "running") {
            // Increase progress by a random amount between 1-5%
            const progressIncrease = Math.floor(Math.random() * 5) + 1;
            const newProgress = Math.min(task.progress + progressIncrease, 100);
            
            // Update ETA based on progress
            let eta = "Calculating...";
            if (newProgress > 10) {
              const remainingPercent = 100 - newProgress;
              eta = remainingPercent <= 10 ? "Less than a minute" : `${Math.ceil(remainingPercent / 10)} minutes`;
            }

            // Update steps based on progress
            const updatedSteps = task.steps.map((step, index) => {
              const stepThreshold = (index / task.steps.length) * 100;
              const nextStepThreshold = ((index + 1) / task.steps.length) * 100;
              
              if (newProgress >= nextStepThreshold) {
                return { ...step, status: "completed" as const };
              } else if (newProgress >= stepThreshold) {
                return { ...step, status: "running" as const };
              }
              return { ...step, status: "pending" as const };
            });

            // If task is complete, clear the interval
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              toast({
                title: "Task Completed",
                description: `"${task.name}" has finished successfully`,
              });
              return {
                ...task,
                progress: 100,
                status: "completed" as const,
                eta: "Completed",
                steps: updatedSteps
              };
            }

            return {
              ...task,
              progress: newProgress,
              eta,
              steps: updatedSteps
            };
          }
          return task;
        });
        
        return updatedTasks;
      });
    }, 1500); // Update every 1.5 seconds
  };

  const handleStopTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        toast({
          title: "Task Stopped",
          description: `"${task.name}" has been paused`,
          variant: "destructive",
        });
        return {
          ...task,
          status: "idle" as const,
          steps: task.steps.map(step => 
            step.status === "running" ? { ...step, status: "idle" as const } : step
          )
        };
      }
      return task;
    }));
  };

  const handleViewDetails = (taskId: string) => {
    toast({
      title: "Viewing Task Details",
      description: "Opening detailed task information...",
    });
    // Toggle the expanded state for this task
    toggleExpandTask(taskId);
  };

  return (
    <Card className="mb-6 hover-scale">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-teal" />
          Active Tasks
        </CardTitle>
        <CardDescription>
          Monitor and control your agent's current tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Collapsible 
                key={task.id} 
                open={expandedTasks[task.id]} 
                onOpenChange={() => toggleExpandTask(task.id)}
                className="border rounded-lg p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                  <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6 rounded-full">
                        {expandedTasks[task.id] ? 
                          <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <h3 className="font-medium">{task.name}</h3>
                    <StatusBadge status={task.status} className="ml-2" />
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {task.status === "idle" ? (
                      <Button 
                        size="sm" 
                        className="h-8 bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-1"
                        onClick={() => handleStartTask(task.id)}
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Start</span>
                      </Button>
                    ) : task.status === "running" ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-red-600 border-red-200 flex items-center gap-1"
                        onClick={() => handleStopTask(task.id)}
                      >
                        <StopCircle className="h-4 w-4" />
                        <span>Stop</span>
                      </Button>
                    ) : null}
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8"
                      onClick={() => handleViewDetails(task.id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
                
                {task.status === "running" || task.status === "completed" ? (
                  <div className="mb-4 px-8">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                      <span>Started: {task.startTime}</span>
                      <span>ETA: {task.eta}</span>
                    </div>
                  </div>
                ) : null}
                
                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 px-8">
                    {task.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm ${
                          step.status === 'running' ? 'border-l-4 border-brand-teal' : 
                          step.status === 'completed' ? 'border-l-4 border-green-500' : ''
                        }`}
                      >
                        <span className="truncate">{step.name}</span>
                        <StatusBadge status={step.status} />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">No Active Tasks</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start a new task using the "New Workflow" button above
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskMonitor;
