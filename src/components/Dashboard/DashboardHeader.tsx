
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  onCreateWorkflow: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateWorkflow }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-dark">Knowledge Worker Dashboard</h1>
        <p className="text-brand-gray text-sm sm:text-base mt-1">Configure and monitor your autonomous agents</p>
      </div>
      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className="flex items-center gap-1 flex-1 sm:flex-initial justify-center"
        >
          <Settings className="h-4 w-4" />
          <span>{!isMobile && "Settings"}</span>
        </Button>
        <Button 
          size={isMobile ? "sm" : "default"} 
          onClick={onCreateWorkflow} 
          className="bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-1 flex-1 sm:flex-initial justify-center"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Workflow</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
