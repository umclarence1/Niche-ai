import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { useAgents, useTasks } from "@/store/AppContext";

interface DashboardHeaderProps {
  onCreateWorkflow: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateWorkflow }) => {
  const isMobile = useIsMobile();
  const { agents, getActiveAgents } = useAgents();
  const { tasks } = useTasks();

  // Calculate real stats from store
  const activeAgentCount = getActiveAgents().length;
  const totalAgents = agents.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const allTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0) + completedTasks;

  // Calculate average efficiency
  const avgEfficiency = agents.length > 0
    ? Math.round(agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length)
    : 0;

  const stats = [
    {
      label: "Active Agents",
      value: `${activeAgentCount}/${totalAgents}`,
      icon: Users,
      trend: totalAgents > 0 ? `${totalAgents} total configured` : "No agents yet",
      color: "from-niche-cyan to-cyan-400"
    },
    {
      label: "Tasks Completed",
      value: allTasks.toString(),
      icon: TrendingUp,
      trend: completedTasks > 0 ? `${completedTasks} this session` : "Start a workflow",
      color: "from-niche-purple to-purple-400"
    },
    {
      label: "Avg Efficiency",
      value: `${avgEfficiency}%`,
      icon: Zap,
      trend: avgEfficiency >= 90 ? "Excellent" : avgEfficiency >= 70 ? "Good" : "Needs improvement",
      color: "from-niche-pink to-pink-400"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back
            </h1>
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 animate-pulse" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm lg:text-base">
            Here's what's happening with your AI workforce today
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="flex-1 sm:flex-initial gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            asChild
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
              {!isMobile && <span>Settings</span>}
            </Link>
          </Button>
          <Button
            size={isMobile ? "sm" : "default"}
            onClick={onCreateWorkflow}
            className="flex-1 sm:flex-initial gap-2 btn-gradient shadow-lg shadow-niche-purple/25 hover:shadow-niche-purple/40 transition-all duration-300"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Workflow</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

            <div className="relative flex items-start justify-between">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
                  {stat.trend}
                </p>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;
