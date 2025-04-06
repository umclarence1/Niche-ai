
import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const Agents = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState([
    { id: 1, name: "Research Assistant", status: "active", tasks: 8 },
    { id: 2, name: "Data Analyzer", status: "idle", tasks: 3 },
    { id: 3, name: "Document Processor", status: "active", tasks: 12 },
  ]);

  const handleCreateAgent = () => {
    toast({
      title: "Creating new agent",
      description: "Setting up a new autonomous agent...",
    });
    // In a real app, we would make an API call here
    const newAgent = { 
      id: agents.length + 1, 
      name: `New Agent ${agents.length + 1}`, 
      status: "idle", 
      tasks: 0 
    };
    setAgents([...agents, newAgent]);
  };

  const handleDeleteAgent = (id: number) => {
    toast({
      title: "Agent removed",
      description: "The agent has been successfully deleted",
    });
    setAgents(agents.filter(agent => agent.id !== id));
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand-teal" />
              Agent Management
            </CardTitle>
            <Button 
              onClick={handleCreateAgent}
              className="bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Agent</span>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Configure and manage your autonomous agents. Each agent can be specialized for different tasks.
            </p>
            
            {agents.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No agents configured. Create your first agent to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {agents.map(agent => (
                  <Card key={agent.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-brand-teal" />
                          <CardTitle className="text-base">{agent.name}</CardTitle>
                        </div>
                        <Badge className={agent.status === "active" ? "bg-green-500" : "bg-gray-400"}>
                          {agent.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Active tasks: {agent.tasks}
                      </p>
                      <div className="flex justify-between gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Agents;
