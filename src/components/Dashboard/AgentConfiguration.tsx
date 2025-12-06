import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bot, Check, Mail, HardDrive, Globe, Calendar, Sparkles, Brain, Cpu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAgents } from "@/store/AppContext";
import { useToast } from "@/hooks/use-toast";
import { AgentType, ModelType, INDUSTRY_SPECIALIZATIONS } from "@/types";

const AgentConfiguration: React.FC = () => {
  const { addAgent } = useAgents();
  const { toast } = useToast();

  const [agentName, setAgentName] = useState("");
  const [agentType, setAgentType] = useState<AgentType>("accountant");
  const [specialization, setSpecialization] = useState("");
  const [temperature, setTemperature] = useState([0.7]);
  const [modelType, setModelType] = useState<ModelType>("gpt-4o");
  const [maxSteps, setMaxSteps] = useState("10");

  const integrations = [
    { name: "Email Integration", description: "Send and receive emails automatically", icon: Mail, connected: true },
    { name: "Document Storage", description: "Google Drive, Dropbox, OneDrive", icon: HardDrive, connected: false },
    { name: "API Integration", description: "Connect third-party APIs", icon: Globe, connected: false },
    { name: "Calendar", description: "Scheduling and reminders", icon: Calendar, connected: false },
  ];

  const models = [
    { value: "gpt-4o", label: "GPT-4o", badge: "Recommended", description: "Most capable model" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini", badge: null, description: "Fast & efficient" },
    { value: "claude-3", label: "Claude 3", badge: "New", description: "Advanced reasoning" },
    { value: "llama3", label: "Llama 3", badge: null, description: "Open source" },
  ];

  const handleSaveAgent = () => {
    if (!agentName.trim()) {
      toast({
        title: "Agent name required",
        description: "Please enter a name for your agent",
        variant: "destructive",
      });
      return;
    }

    if (!specialization) {
      toast({
        title: "Specialization required",
        description: "Please select a specialization for your agent",
        variant: "destructive",
      });
      return;
    }

    addAgent({
      name: agentName.trim(),
      type: agentType,
      specialization,
      model: modelType,
      temperature: temperature[0],
      maxSteps: parseInt(maxSteps) || 10,
    });

    toast({
      title: "Agent Created",
      description: `"${agentName}" has been added to your workforce`,
    });

    // Reset form
    setAgentName("");
    setSpecialization("");
    setTemperature([0.7]);
    setMaxSteps("10");
  };

  const handleCancel = () => {
    setAgentName("");
    setSpecialization("");
    setTemperature([0.7]);
    setModelType("gpt-4o");
    setMaxSteps("10");
  };

  return (
    <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-niche-cyan to-niche-purple shadow-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Agent Configuration
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Configure your autonomous agent's behavior and capabilities
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            <TabsTrigger value="basic" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
              <Brain className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="integration" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
              <Globe className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="agent-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Agent Name
                </Label>
                <Input
                  id="agent-name"
                  placeholder="Finance Assistant"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-niche-cyan/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-type" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Industry Type
                </Label>
                <Select value={agentType} onValueChange={(v) => { setAgentType(v as AgentType); setSpecialization(""); }}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="accountant">Accounting</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="architect">Architecture</SelectItem>
                    <SelectItem value="researcher">Research</SelectItem>
                    <SelectItem value="analyst">Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Specialization
              </Label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {INDUSTRY_SPECIALIZATIONS[agentType].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-0 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Model Temperature
                </Label>
                <span className="text-sm font-mono px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-niche-cyan">
                  {temperature[0].toFixed(1)}
                </span>
              </div>
              <Slider
                value={temperature}
                min={0}
                max={1}
                step={0.1}
                onValueChange={setTemperature}
                className="py-2"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lower values produce more focused outputs. Higher values produce more creative results.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Model Type
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {models.map((model) => (
                  <button
                    key={model.value}
                    onClick={() => setModelType(model.value as ModelType)}
                    className={cn(
                      "relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                      modelType === model.value
                        ? "border-niche-cyan bg-niche-cyan/5 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg",
                      modelType === model.value
                        ? "bg-gradient-to-br from-niche-cyan to-niche-purple text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}>
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{model.label}</span>
                        {model.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-niche-purple/10 text-niche-purple font-medium">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{model.description}</span>
                    </div>
                    {modelType === model.value && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-niche-cyan flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-steps" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Maximum Execution Steps
              </Label>
              <Input
                id="max-steps"
                type="number"
                placeholder="10"
                value={maxSteps}
                onChange={(e) => setMaxSteps(e.target.value)}
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-niche-cyan/20"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set to 0 for unlimited steps.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-sm"
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200",
                    integration.connected
                      ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                  )}>
                    <integration.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        {integration.name}
                      </h3>
                      {integration.connected && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Check className="h-3 w-3" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {integration.description}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 mt-2 text-niche-cyan hover:text-niche-purple transition-colors"
                    >
                      {integration.connected ? "Configure" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-700"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl btn-gradient shadow-lg shadow-niche-purple/25"
            onClick={handleSaveAgent}
          >
            Create Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentConfiguration;
