
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import AgentConfiguration from "../components/Dashboard/AgentConfiguration";
import FileUpload from "../components/Dashboard/FileUpload";
import TaskMonitor from "../components/Dashboard/TaskMonitor";
import WorkflowHistory from "../components/Dashboard/WorkflowHistory";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  
  const handleCreateWorkflow = () => {
    toast({
      title: "Creating new workflow",
      description: "Your new workflow is being set up...",
    });
  };

  return (
    <MainLayout>
      <DashboardHeader onCreateWorkflow={handleCreateWorkflow} />
      <div className="grid grid-cols-1 gap-6">
        <AgentConfiguration />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FileUpload />
          <TaskMonitor />
        </div>
        <WorkflowHistory />
      </div>
    </MainLayout>
  );
};

export default Index;
