
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, PlayCircle, StopCircle } from "lucide-react";
import StatusBadge from "../ui/custom/StatusBadge";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  name: string;
  status: "idle" | "running" | "completed" | "failed" | "pending";
  progress: number;
  startTime?: string;
  eta?: string;
  steps: {
    name: string;
    status: "idle" | "running" | "completed" | "failed" | "pending";
  }[];
}

const TaskMonitor: React.FC = () => {
  // Mock data for demonstration
  const tasks: Task[] = [
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
  ];

  return (
    <Card className="mb-6">
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
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <h3 className="font-medium">{task.name}</h3>
                    <StatusBadge status={task.status} className="ml-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === "idle" ? (
                      <Button 
                        size="sm" 
                        className="h-8 bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-1"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Start</span>
                      </Button>
                    ) : task.status === "running" ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-red-600 border-red-200 flex items-center gap-1"
                      >
                        <StopCircle className="h-4 w-4" />
                        <span>Stop</span>
                      </Button>
                    ) : null}
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8"
                    >
                      Details
                    </Button>
                  </div>
                </div>
                
                {task.status === "running" && (
                  <div className="mb-4">
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
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                  {task.steps.map((step, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm"
                    >
                      <span className="truncate">{step.name}</span>
                      <StatusBadge status={step.status} />
                    </div>
                  ))}
                </div>
              </div>
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
