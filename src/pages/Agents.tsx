import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Plus, Settings, Trash2, Sparkles, Activity, Zap, MoreVertical, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAgents, useTasks } from "@/store/AppContext";
import { Agent, AGENT_COLORS } from "@/types";
import { createTask, executeTask } from "@/services/AgentService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentType, ModelType, INDUSTRY_SPECIALIZATIONS } from "@/types";

const Agents = () => {
  const { toast } = useToast();
  const { agents, addAgent, deleteAgent, getActiveAgents } = useAgents();
  const { addTask, updateTask } = useTasks();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentType, setNewAgentType] = useState<AgentType>("analyst");
  const [newAgentSpecialization, setNewAgentSpecialization] = useState("");

  const handleCreateAgent = () => {
    if (!newAgentName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your agent",
        variant: "destructive",
      });
      return;
    }

    if (!newAgentSpecialization) {
      toast({
        title: "Specialization required",
        description: "Please select a specialization",
        variant: "destructive",
      });
      return;
    }

    addAgent({
      name: newAgentName.trim(),
      type: newAgentType,
      specialization: newAgentSpecialization,
      model: "gpt-4o",
      temperature: 0.7,
      maxSteps: 10,
    });

    toast({
      title: "Agent created",
      description: `"${newAgentName}" has been added to your workforce`,
    });

    setNewAgentName("");
    setNewAgentSpecialization("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteAgent = (agent: Agent) => {
    deleteAgent(agent.id);
    toast({
      title: "Agent removed",
      description: `"${agent.name}" has been deleted`,
    });
  };

  const handleRunTask = async (agent: Agent) => {
    const sampleTasks = [
      { name: "Data Analysis", description: "Analyze and process data" },
      { name: "Document Review", description: "Review and summarize documents" },
      { name: "Research Task", description: "Conduct research and compile findings" },
      { name: "Report Generation", description: "Generate comprehensive report" },
    ];

    const sample = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
    const task = createTask(`${sample.name} - ${agent.specialization}`, sample.description, agent);

    addTask(task);

    toast({
      title: "Task Started",
      description: `Running "${task.name}" on ${agent.name}`,
    });

    await executeTask(
      task,
      (updated) => updateTask(updated.id, updated),
      (completed) => {
        if (completed.status === "completed") {
          toast({
            title: "Task Completed",
            description: `"${completed.name}" finished successfully`,
          });
        }
      }
    );
  };

  const activeCount = getActiveAgents().length;
  const totalTasks = agents.reduce((acc, a) => acc + a.tasksCompleted + a.tasksRunning, 0);
  const avgEfficiency = agents.length > 0
    ? Math.round(agents.reduce((acc, a) => acc + a.efficiency, 0) / agents.length)
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6 lg:space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Agent Management
              </h1>
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-niche-cyan" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm lg:text-base">
              Configure and manage your autonomous AI agents
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 btn-gradient shadow-lg shadow-niche-purple/25">
                <Plus className="h-4 w-4" />
                <span>Create Agent</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Agent</DialogTitle>
                <DialogDescription>
                  Configure your new autonomous AI agent
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input
                    id="agent-name"
                    placeholder="My Assistant"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Agent Type</Label>
                  <Select value={newAgentType} onValueChange={(v) => { setNewAgentType(v as AgentType); setNewAgentSpecialization(""); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accountant">Accounting</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="architect">Architecture</SelectItem>
                      <SelectItem value="researcher">Research</SelectItem>
                      <SelectItem value="analyst">Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Select value={newAgentSpecialization} onValueChange={setNewAgentSpecialization}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_SPECIALIZATIONS[newAgentType].map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-gradient" onClick={handleCreateAgent}>
                  Create Agent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total Agents", value: agents.length, icon: Bot },
            { label: "Active", value: activeCount, icon: Activity },
            { label: "Total Tasks", value: totalTasks, icon: Zap },
            { label: "Avg Efficiency", value: `${avgEfficiency}%`, icon: Sparkles },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs font-medium">{stat.label}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Agent Cards */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-niche-cyan to-niche-purple shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Your Agents
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Each agent is specialized for different tasks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {agents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Bot className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 text-lg">No agents configured</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-sm">
                  Create your first autonomous agent to start automating your workflows
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient Top Bar */}
                    <div className={`h-1 bg-gradient-to-r ${agent.color}`} />

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} shadow-md`}>
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                              {agent.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {agent.specialization}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                                agent.status === "active" || agent.status === "busy"
                                  ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                  : agent.status === "error"
                                    ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              )}>
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  (agent.status === "active" || agent.status === "busy") ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                )} />
                                {agent.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => handleDeleteAgent(agent)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tasks Done</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{agent.tasksCompleted}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Efficiency</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{agent.efficiency}%</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-lg border-slate-200 dark:border-slate-700"
                        >
                          <Settings className="h-3.5 w-3.5 mr-1.5" />
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          className={cn("flex-1 rounded-lg text-white bg-gradient-to-r", agent.color)}
                          onClick={() => handleRunTask(agent)}
                          disabled={agent.status === "busy"}
                        >
                          <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                          {agent.status === "busy" ? "Running..." : "Run Task"}
                        </Button>
                      </div>
                    </div>
                  </div>
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
