
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WorkflowHistory = () => {
  const recentWorkflows = [
    { 
      id: 1, 
      name: "Financial Data Analysis", 
      date: "Apr 6, 2025 10:23 AM", 
      status: "completed", 
      agent: "Data Analyzer" 
    },
    { 
      id: 2, 
      name: "Customer Survey Processing", 
      date: "Apr 5, 2025 2:15 PM", 
      status: "completed", 
      agent: "Document Processor" 
    },
    { 
      id: 3, 
      name: "Monthly Report Generation", 
      date: "Apr 4, 2025 9:05 AM", 
      status: "failed", 
      agent: "Research Assistant" 
    }
  ];

  const statusIcons = {
    completed: <Check className="h-3 w-3 mr-1" />,
    running: <Clock className="h-3 w-3 mr-1 animate-spin" />,
    failed: <X className="h-3 w-3 mr-1" />
  };

  const statusColors = {
    completed: "bg-green-500",
    running: "bg-blue-500 animate-pulse",
    failed: "bg-red-500"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-teal" />
            Recent Workflows
          </h3>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to="/history">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="px-3 py-2 text-sm font-medium">Workflow</th>
                <th className="px-3 py-2 text-sm font-medium">Agent</th>
                <th className="px-3 py-2 text-sm font-medium">Date & Time</th>
                <th className="px-3 py-2 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkflows.map((workflow) => (
                <tr key={workflow.id} className="border-b hover:bg-muted/50">
                  <td className="px-3 py-2">
                    <div className="font-medium">{workflow.name}</div>
                  </td>
                  <td className="px-3 py-2 text-sm">{workflow.agent}</td>
                  <td className="px-3 py-2 text-sm text-muted-foreground">{workflow.date}</td>
                  <td className="px-3 py-2">
                    <Badge 
                      className={statusColors[workflow.status as keyof typeof statusColors]}
                    >
                      {statusIcons[workflow.status as keyof typeof statusIcons]}
                      {workflow.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowHistory;
