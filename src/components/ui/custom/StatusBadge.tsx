import React from "react";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertCircle, Loader2, Circle } from "lucide-react";

type StatusType = "idle" | "running" | "completed" | "failed" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, showIcon = true }) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "idle":
        return {
          styles: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          dotColor: "bg-slate-400",
          icon: Circle
        };
      case "running":
        return {
          styles: "bg-niche-cyan/10 text-niche-cyan border-niche-cyan/20",
          dotColor: "bg-niche-cyan",
          icon: Loader2
        };
      case "completed":
        return {
          styles: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
          dotColor: "bg-emerald-500",
          icon: Check
        };
      case "failed":
        return {
          styles: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
          dotColor: "bg-red-500",
          icon: AlertCircle
        };
      case "pending":
        return {
          styles: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          dotColor: "bg-amber-500",
          icon: Clock
        };
      default:
        return {
          styles: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          dotColor: "bg-slate-400",
          icon: Circle
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 border transition-colors",
        config.styles,
        className
      )}
    >
      {showIcon ? (
        <IconComponent className={cn("h-3 w-3", status === "running" && "animate-spin")} />
      ) : (
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          config.dotColor,
          status === "running" && "animate-pulse"
        )} />
      )}
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default StatusBadge;
