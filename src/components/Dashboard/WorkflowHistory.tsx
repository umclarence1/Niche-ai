
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ExternalLink, RefreshCw } from "lucide-react";
import StatusBadge from "../ui/custom/StatusBadge";

interface WorkflowHistoryItem {
  id: string;
  name: string;
  type: string;
  status: "completed" | "failed" | "running";
  completedAt: string;
  duration: string;
  documents: number;
}

const WorkflowHistory: React.FC = () => {
  // Mock data for demonstration
  const historyItems: WorkflowHistoryItem[] = [
    {
      id: "workflow-1",
      name: "March Financial Report",
      type: "Report Generation",
      status: "completed",
      completedAt: "Today, 11:42 AM",
      duration: "8m 23s",
      documents: 3,
    },
    {
      id: "workflow-2",
      name: "Client Onboarding - ABC Corp",
      type: "Client Onboarding",
      status: "failed",
      completedAt: "Yesterday, 3:15 PM",
      duration: "2m 05s",
      documents: 2,
    },
    {
      id: "workflow-3",
      name: "Quarterly Tax Filing",
      type: "Tax Filing",
      status: "completed",
      completedAt: "Apr 12, 9:30 AM",
      duration: "15m 47s",
      documents: 5,
    },
    {
      id: "workflow-4",
      name: "Expense Report Processing",
      type: "Expense Processing",
      status: "running",
      completedAt: "In progress",
      duration: "3m 12s",
      documents: 1,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-brand-teal" />
            <CardTitle className="text-lg">Recent Workflows</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
        <CardDescription>
          View your recently executed workflows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
            <div className="col-span-5 md:col-span-5">Workflow Name</div>
            <div className="col-span-3 md:col-span-2">Status</div>
            <div className="hidden md:block md:col-span-2">Duration</div>
            <div className="col-span-2 md:col-span-2">Completed</div>
            <div className="col-span-2 md:col-span-1">Actions</div>
          </div>
          <div className="divide-y">
            {historyItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 p-3 text-sm items-center">
                <div className="col-span-5 md:col-span-5">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.type}</div>
                </div>
                <div className="col-span-3 md:col-span-2">
                  <StatusBadge status={item.status} />
                </div>
                <div className="hidden md:block md:col-span-2">{item.duration}</div>
                <div className="col-span-2 md:col-span-2 text-xs md:text-sm">
                  {item.completedAt}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm">
            View All Workflows
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowHistory;
