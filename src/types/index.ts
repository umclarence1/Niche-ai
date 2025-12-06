// Core Types for NICHE.AI Platform

// Agent Types
export type AgentType = "accountant" | "legal" | "medical" | "architect" | "researcher" | "analyst";
export type AgentStatus = "active" | "idle" | "busy" | "error";
export type ModelType = "gpt-4o" | "gpt-4o-mini" | "claude-3" | "llama3";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  specialization: string;
  status: AgentStatus;
  model: ModelType;
  temperature: number;
  maxSteps: number;
  tasksCompleted: number;
  tasksRunning: number;
  efficiency: number;
  createdAt: string;
  lastActiveAt: string;
  color: string;
}

export interface AgentConfig {
  name: string;
  type: AgentType;
  specialization: string;
  model: ModelType;
  temperature: number;
  maxSteps: number;
}

// Task Types
export type TaskStatus = "idle" | "queued" | "running" | "completed" | "failed" | "paused";

export interface TaskStep {
  id: string;
  name: string;
  status: TaskStatus;
  startedAt?: string;
  completedAt?: string;
  output?: string;
  error?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  agentId: string;
  agentName: string;
  status: TaskStatus;
  progress: number;
  steps: TaskStep[];
  input?: string;
  output?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: string;
  createdAt: string;
}

// Workflow Types
export type WorkflowStatus = "completed" | "running" | "failed" | "cancelled";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  taskIds: string[];
  agentId: string;
  agentName: string;
  status: WorkflowStatus;
  startedAt: string;
  completedAt?: string;
  duration?: string;
  result?: string;
}

// Document Types
export type DocumentType = "pdf" | "doc" | "spreadsheet" | "image" | "text" | "archive" | "other";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  sizeFormatted: string;
  mimeType: string;
  uploadedAt: string;
  lastAccessedAt?: string;
  content?: string;
  url?: string;
}

// AI Result Types
export type AIActionType = "summarize" | "extract" | "analyze" | "report" | "research" | "chat";

export interface AIResult {
  id: string;
  documentId: string;
  documentName: string;
  actionType: AIActionType;
  agentType: string;
  input?: string;
  output: string;
  createdAt: string;
  duration?: string;
}

// Settings Types
export interface GeneralSettings {
  systemName: string;
  defaultLanguage: string;
  timezone: string;
  autoSaveInterval: number;
  darkMode: boolean;
}

export interface ApiKeySettings {
  openAI: { key: string; connected: boolean; lastTested?: string };
  pinecone: { key: string; connected: boolean; lastTested?: string };
  slack: { webhookUrl: string; connected: boolean; lastTested?: string };
}

export interface NotificationSettings {
  email: boolean;
  slack: boolean;
  browser: boolean;
  onCompletion: boolean;
  onError: boolean;
  onAgentIdle: boolean;
}

export interface AdvancedSettings {
  maxMemoryMB: number;
  maxConcurrentTasks: number;
  logLevel: "debug" | "info" | "warning" | "error";
  developerMode: boolean;
}

export interface Settings {
  general: GeneralSettings;
  apiKeys: ApiKeySettings;
  notifications: NotificationSettings;
  advanced: AdvancedSettings;
}

// Store State Type
export interface AppState {
  agents: Agent[];
  tasks: Task[];
  workflows: Workflow[];
  documents: Document[];
  aiResults: AIResult[];
  settings: Settings;
}

// Industry Specializations
export const INDUSTRY_SPECIALIZATIONS: Record<AgentType, string[]> = {
  accountant: ["Tax Preparation", "Bookkeeping", "Audit", "Financial Advisory", "Payroll", "Invoicing"],
  legal: ["Contract Review", "Legal Research", "Case Management", "IP Filing", "Compliance", "Due Diligence"],
  medical: ["Patient Records", "Insurance Claims", "Appointment Scheduling", "Treatment Plans", "Medical Coding", "Billing"],
  architect: ["Drawing Review", "Project Management", "Building Codes", "Material Analysis", "Cost Estimation", "Permits"],
  researcher: ["Market Research", "Competitor Analysis", "Data Mining", "Trend Analysis", "Report Writing", "Citations"],
  analyst: ["Data Analysis", "Financial Modeling", "Forecasting", "KPI Tracking", "Dashboard Creation", "Reporting"],
};

// Agent Color Presets
export const AGENT_COLORS = [
  "from-niche-cyan to-cyan-400",
  "from-niche-purple to-purple-400",
  "from-niche-pink to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-blue-500 to-indigo-400",
  "from-rose-500 to-red-400",
  "from-lime-500 to-green-400",
];

// Default Settings
export const DEFAULT_SETTINGS: Settings = {
  general: {
    systemName: "NICHE.AI",
    defaultLanguage: "English",
    timezone: "UTC-5",
    autoSaveInterval: 5,
    darkMode: false,
  },
  apiKeys: {
    openAI: { key: "", connected: false },
    pinecone: { key: "", connected: false },
    slack: { webhookUrl: "", connected: false },
  },
  notifications: {
    email: true,
    slack: false,
    browser: true,
    onCompletion: true,
    onError: true,
    onAgentIdle: false,
  },
  advanced: {
    maxMemoryMB: 2048,
    maxConcurrentTasks: 5,
    logLevel: "info",
    developerMode: false,
  },
};

// Utility function to generate IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Utility function to get document type from mime type
export const getDocumentType = (mimeType: string, fileName: string): DocumentType => {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("word") || fileName.endsWith(".doc") || fileName.endsWith(".docx")) return "doc";
  if (mimeType.includes("sheet") || mimeType.includes("excel") || fileName.endsWith(".xlsx") || fileName.endsWith(".csv")) return "spreadsheet";
  if (mimeType.includes("image")) return "image";
  if (mimeType.includes("text")) return "text";
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return "archive";
  return "other";
};

// Utility function to format duration
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

// Utility function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
