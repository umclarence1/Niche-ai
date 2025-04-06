
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bot, Check, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const AgentConfiguration: React.FC = () => {
  const [agentType, setAgentType] = useState("accountant");
  const [temperature, setTemperature] = useState([0.7]);
  const [modelType, setModelType] = useState("gpt-4o");

  const industryOptions = {
    accountant: ["Tax Preparation", "Bookkeeping", "Audit", "Financial Advisory"],
    legal: ["Contract Review", "Legal Research", "Case Management", "IP Filing"],
    medical: ["Patient Records", "Insurance Claims", "Appointment Scheduling", "Treatment Plans"],
    architect: ["Drawing Review", "Project Management", "Building Codes", "Material Analysis"],
  };

  const selectedIndustry = agentType as keyof typeof industryOptions;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-brand-teal" />
          Agent Configuration
        </CardTitle>
        <CardDescription>
          Configure your autonomous agent's behavior and capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            <TabsTrigger value="integration">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input id="agent-name" placeholder="Finance Assistant" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agent-type">Industry Type</Label>
                  <Select value={agentType} onValueChange={setAgentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accountant">Accounting</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="architect">Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions[selectedIndustry].map((option) => (
                      <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agent-description">Agent Description</Label>
                <Input 
                  id="agent-description" 
                  placeholder="Describe what this agent should do"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Model Temperature ({temperature})</Label>
                </div>
                <Slider 
                  value={temperature} 
                  min={0} 
                  max={1} 
                  step={0.1} 
                  onValueChange={setTemperature} 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower values produce more focused, deterministic outputs. Higher values produce more creative results.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model-type">Model Type</Label>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="llama3">Llama 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-steps">Maximum Execution Steps</Label>
                <Input id="max-steps" type="number" placeholder="10" />
                <p className="text-xs text-muted-foreground mt-1">
                  The maximum number of steps the agent will execute before stopping. Set to 0 for unlimited.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integration">
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 flex items-start">
                  <div className="h-5 w-5 mr-2 mt-0.5 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Email Integration</h3>
                    <p className="text-xs text-muted-foreground">
                      Connect your email account to allow the agent to send and receive emails.
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-brand-teal">
                      Configure
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 flex items-start">
                  <div className="h-5 w-5 mr-2 mt-0.5 rounded bg-brand-light" />
                  <div>
                    <h3 className="font-medium text-sm">Document Storage</h3>
                    <p className="text-xs text-muted-foreground">
                      Connect to Google Drive, Dropbox, or OneDrive for document storage.
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-brand-teal">
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 flex items-start">
                  <div className="h-5 w-5 mr-2 mt-0.5 rounded bg-brand-light" />
                  <div>
                    <h3 className="font-medium text-sm">API Integration</h3>
                    <p className="text-xs text-muted-foreground">
                      Connect to third-party APIs and services.
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-brand-teal">
                      Add API
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 flex items-start">
                  <div className="h-5 w-5 mr-2 mt-0.5 rounded bg-brand-light" />
                  <div>
                    <h3 className="font-medium text-sm">Calendar</h3>
                    <p className="text-xs text-muted-foreground">
                      Connect your calendar for scheduling and reminders.
                    </p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-brand-teal">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" className="mr-2">Cancel</Button>
          <Button className="bg-brand-teal hover:bg-brand-teal/90">Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentConfiguration;
