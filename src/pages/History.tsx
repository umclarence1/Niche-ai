
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import WorkflowHistory from "../components/Dashboard/WorkflowHistory";

const History = () => {
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
            <p className="text-muted-foreground mb-4">
              View a complete history of all workflows executed by your autonomous agents.
            </p>
          </CardContent>
        </Card>
        
        <WorkflowHistory />
      </div>
    </MainLayout>
  );
};

export default History;
