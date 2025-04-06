
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";

interface DashboardHeaderProps {
  onCreateWorkflow: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateWorkflow }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Knowledge Worker Dashboard</h1>
        <p className="text-brand-gray mt-1">Configure and monitor your autonomous agents</p>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
        <Button size="sm" onClick={onCreateWorkflow} className="bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>New Workflow</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
