
import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Search, Filter, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [workflows, setWorkflows] = useState([
    { 
      id: 1, 
      name: "Financial Data Analysis", 
      date: "Apr 6, 2025 10:23 AM", 
      status: "completed", 
      duration: "12m 30s",
      agent: "Data Analyzer" 
    },
    { 
      id: 2, 
      name: "Customer Survey Processing", 
      date: "Apr 5, 2025 2:15 PM", 
      status: "completed", 
      duration: "34m 12s",
      agent: "Document Processor" 
    },
    { 
      id: 3, 
      name: "Monthly Report Generation", 
      date: "Apr 4, 2025 9:05 AM", 
      status: "failed", 
      duration: "2m 45s",
      agent: "Research Assistant" 
    },
    { 
      id: 4, 
      name: "Competitor Analysis", 
      date: "Apr 3, 2025 11:30 AM", 
      status: "completed", 
      duration: "55m 03s",
      agent: "Research Assistant" 
    },
    { 
      id: 5, 
      name: "Client Data Import", 
      date: "Apr 2, 2025 3:45 PM", 
      status: "completed", 
      duration: "8m 17s",
      agent: "Data Analyzer" 
    }
  ]);

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    completed: "bg-green-500",
    failed: "bg-red-500",
    running: "bg-blue-500 animate-pulse"
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-teal" />
              Workflow History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search workflows..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>

            {filteredWorkflows.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <Clock className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No matching workflows found." : "No workflow history available."}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="px-3 py-2 text-sm font-medium">Workflow</th>
                      <th className="px-3 py-2 text-sm font-medium">Agent</th>
                      <th className="px-3 py-2 text-sm font-medium">Date & Time</th>
                      <th className="px-3 py-2 text-sm font-medium">Duration</th>
                      <th className="px-3 py-2 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkflows.map(workflow => (
                      <tr key={workflow.id} className="border-b hover:bg-muted/50">
                        <td className="px-3 py-2">
                          <div className="font-medium">{workflow.name}</div>
                        </td>
                        <td className="px-3 py-2 text-sm">{workflow.agent}</td>
                        <td className="px-3 py-2 text-sm text-muted-foreground">{workflow.date}</td>
                        <td className="px-3 py-2 text-sm text-muted-foreground">{workflow.duration}</td>
                        <td className="px-3 py-2">
                          <Badge className={statusColors[workflow.status as keyof typeof statusColors]}>
                            {workflow.status === "completed" ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : workflow.status === "failed" ? (
                              <X className="h-3 w-3 mr-1" />
                            ) : null}
                            {workflow.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default History;
