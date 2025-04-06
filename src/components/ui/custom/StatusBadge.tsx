
import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "idle" | "running" | "completed" | "failed" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "idle":
        return "bg-gray-100 text-gray-800";
      case "running":
        return "bg-blue-100 text-blue-800 animate-pulse";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center",
        getStatusColor(status),
        className
      )}
    >
      <div className={cn("w-2 h-2 rounded-full mr-1.5", {
        "bg-gray-500": status === "idle",
        "bg-blue-500": status === "running",
        "bg-green-500": status === "completed",
        "bg-red-500": status === "failed",
        "bg-yellow-500": status === "pending",
      })} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default StatusBadge;
