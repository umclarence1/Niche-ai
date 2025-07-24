
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import AgentConfiguration from "../components/Dashboard/AgentConfiguration";
import TaskMonitor from "../components/Dashboard/TaskMonitor";
import WorkflowHistory from "../components/Dashboard/WorkflowHistory";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleCreateWorkflow = () => {
    toast({
      title: "Creating new workflow",
      description: "Your new workflow is being set up...",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <DashboardHeader onCreateWorkflow={handleCreateWorkflow} />
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <AgentConfiguration />
          <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-2"} gap-4 md:gap-6`}>
            <TaskMonitor />
          </div>
          <WorkflowHistory />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
