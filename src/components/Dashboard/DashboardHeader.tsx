
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  onCreateWorkflow: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateWorkflow }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b mb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-dark flex items-center gap-2">
          Knowledge Worker Dashboard
          <Star className="h-4 w-4 text-yellow-400 hidden sm:inline" />
        </h1>
        <p className="text-brand-gray text-sm sm:text-base mt-1">Configure and keep an eye on your autonomous agents</p>
      </div>
      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className="flex items-center gap-1 flex-1 sm:flex-initial justify-center hover-scale"
        >
          <Settings className="h-4 w-4" />
          <span>{!isMobile && "Settings"}</span>
        </Button>
        <Button 
          size={isMobile ? "sm" : "default"} 
          onClick={onCreateWorkflow} 
          className="bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-1 flex-1 sm:flex-initial justify-center hover-scale"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Workflow</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
