import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import {
  Agent,
  Task,
  Workflow,
  Document,
  AIResult,
  Settings,
  AppState,
  DEFAULT_SETTINGS,
  generateId,
  AgentConfig,
  AGENT_COLORS,
  AIActionType,
} from "@/types";

// Storage key
const STORAGE_KEY = "niche_ai_state";

// Initial state with sample data
const getInitialState = (): AppState => {
  // Try to load from localStorage first
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate and merge with defaults to handle missing fields
      // Filter out documents with expired blob URLs
      const validDocuments = (parsed.documents || []).filter((doc: Document) => {
        // Keep non-blob URLs, they might be valid
        if (!doc.url?.startsWith('blob:')) return true;
        // For blob URLs, we can't validate them here, but we'll keep them
        // and handle errors when they're accessed
        return true;
      });

      return {
        agents: Array.isArray(parsed.agents) ? parsed.agents : [],
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        workflows: Array.isArray(parsed.workflows) ? parsed.workflows : [],
        documents: validDocuments,
        aiResults: Array.isArray(parsed.aiResults) ? parsed.aiResults : [],
        settings: parsed.settings && typeof parsed.settings === 'object'
          ? { ...DEFAULT_SETTINGS, ...parsed.settings }
          : DEFAULT_SETTINGS,
      };
    }
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    // Clear corrupted localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }

  // Return default initial state with sample data
  return {
    agents: [
      {
        id: generateId(),
        name: "Financial Analyst",
        type: "analyst",
        specialization: "Financial Modeling",
        status: "active",
        model: "gpt-4o",
        temperature: 0.7,
        maxSteps: 10,
        tasksCompleted: 24,
        tasksRunning: 1,
        efficiency: 94,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastActiveAt: new Date().toISOString(),
        color: AGENT_COLORS[0],
      },
      {
        id: generateId(),
        name: "Legal Assistant",
        type: "legal",
        specialization: "Contract Review",
        status: "idle",
        model: "gpt-4o",
        temperature: 0.3,
        maxSteps: 15,
        tasksCompleted: 18,
        tasksRunning: 0,
        efficiency: 89,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        color: AGENT_COLORS[1],
      },
      {
        id: generateId(),
        name: "Research Bot",
        type: "researcher",
        specialization: "Market Research",
        status: "busy",
        model: "claude-3",
        temperature: 0.5,
        maxSteps: 20,
        tasksCompleted: 42,
        tasksRunning: 2,
        efficiency: 97,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastActiveAt: new Date().toISOString(),
        color: AGENT_COLORS[2],
      },
    ],
    tasks: [],
    workflows: [],
    documents: [],
    aiResults: [],
    settings: DEFAULT_SETTINGS,
  };
};

// Action types
type Action =
  // Agent actions
  | { type: "ADD_AGENT"; payload: AgentConfig }
  | { type: "UPDATE_AGENT"; payload: { id: string; updates: Partial<Agent> } }
  | { type: "DELETE_AGENT"; payload: string }
  | { type: "SET_AGENT_STATUS"; payload: { id: string; status: Agent["status"] } }
  // Task actions
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt"> }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_TASK_STATUS"; payload: { id: string; status: Task["status"] } }
  // Workflow actions
  | { type: "ADD_WORKFLOW"; payload: Omit<Workflow, "id"> }
  | { type: "UPDATE_WORKFLOW"; payload: { id: string; updates: Partial<Workflow> } }
  | { type: "DELETE_WORKFLOW"; payload: string }
  // Document actions
  | { type: "ADD_DOCUMENT"; payload: Omit<Document, "id" | "uploadedAt"> }
  | { type: "DELETE_DOCUMENT"; payload: string }
  | { type: "UPDATE_DOCUMENT"; payload: { id: string; updates: Partial<Document> } }
  // AI Result actions
  | { type: "ADD_AI_RESULT"; payload: Omit<AIResult, "id" | "createdAt"> }
  | { type: "DELETE_AI_RESULT"; payload: string }
  | { type: "CLEAR_AI_RESULTS" }
  // Settings actions
  | { type: "UPDATE_SETTINGS"; payload: Partial<Settings> }
  | { type: "RESET_SETTINGS" }
  // Global actions
  | { type: "CLEAR_ALL_DATA" }
  | { type: "IMPORT_STATE"; payload: AppState };

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    // Agent actions
    case "ADD_AGENT": {
      const newAgent: Agent = {
        id: generateId(),
        ...action.payload,
        status: "idle",
        tasksCompleted: 0,
        tasksRunning: 0,
        efficiency: 100,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        color: AGENT_COLORS[state.agents.length % AGENT_COLORS.length],
      };
      return { ...state, agents: [...state.agents, newAgent] };
    }
    case "UPDATE_AGENT":
      return {
        ...state,
        agents: state.agents.map((agent) =>
          agent.id === action.payload.id
            ? { ...agent, ...action.payload.updates, lastActiveAt: new Date().toISOString() }
            : agent
        ),
      };
    case "DELETE_AGENT":
      return {
        ...state,
        agents: state.agents.filter((agent) => agent.id !== action.payload),
        tasks: state.tasks.filter((task) => task.agentId !== action.payload),
      };
    case "SET_AGENT_STATUS":
      return {
        ...state,
        agents: state.agents.map((agent) =>
          agent.id === action.payload.id
            ? { ...agent, status: action.payload.status, lastActiveAt: new Date().toISOString() }
            : agent
        ),
      };

    // Task actions
    case "ADD_TASK": {
      const newTask: Task = {
        id: generateId(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      // Update agent's running task count
      const agentId = action.payload.agentId;
      return {
        ...state,
        tasks: [...state.tasks, newTask],
        agents: state.agents.map((agent) =>
          agent.id === agentId
            ? { ...agent, tasksRunning: agent.tasksRunning + 1, status: "busy" as const }
            : agent
        ),
      };
    }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "SET_TASK_STATUS": {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (!task) return state;

      const wasRunning = task.status === "running";
      const isNowComplete = action.payload.status === "completed" || action.payload.status === "failed";

      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                status: action.payload.status,
                completedAt: isNowComplete ? new Date().toISOString() : t.completedAt,
              }
            : t
        ),
        agents: wasRunning && isNowComplete
          ? state.agents.map((agent) =>
              agent.id === task.agentId
                ? {
                    ...agent,
                    tasksRunning: Math.max(0, agent.tasksRunning - 1),
                    tasksCompleted: action.payload.status === "completed"
                      ? agent.tasksCompleted + 1
                      : agent.tasksCompleted,
                    status: agent.tasksRunning <= 1 ? "idle" as const : "busy" as const,
                  }
                : agent
            )
          : state.agents,
      };
    }

    // Workflow actions
    case "ADD_WORKFLOW": {
      const newWorkflow: Workflow = {
        id: generateId(),
        ...action.payload,
      };
      return { ...state, workflows: [...state.workflows, newWorkflow] };
    }
    case "UPDATE_WORKFLOW":
      return {
        ...state,
        workflows: state.workflows.map((workflow) =>
          workflow.id === action.payload.id
            ? { ...workflow, ...action.payload.updates }
            : workflow
        ),
      };
    case "DELETE_WORKFLOW":
      return {
        ...state,
        workflows: state.workflows.filter((workflow) => workflow.id !== action.payload),
      };

    // Document actions
    case "ADD_DOCUMENT": {
      const newDocument: Document = {
        id: generateId(),
        ...action.payload,
        uploadedAt: new Date().toISOString(),
      };
      return { ...state, documents: [...state.documents, newDocument] };
    }
    case "DELETE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.filter((doc) => doc.id !== action.payload),
      };
    case "UPDATE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, ...action.payload.updates } : doc
        ),
      };

    // AI Result actions
    case "ADD_AI_RESULT": {
      const newResult: AIResult = {
        id: generateId(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      return { ...state, aiResults: [newResult, ...state.aiResults] };
    }
    case "DELETE_AI_RESULT":
      return {
        ...state,
        aiResults: state.aiResults.filter((result) => result.id !== action.payload),
      };
    case "CLEAR_AI_RESULTS":
      return { ...state, aiResults: [] };

    // Settings actions
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
          general: { ...state.settings.general, ...action.payload.general },
          apiKeys: { ...state.settings.apiKeys, ...action.payload.apiKeys },
          notifications: { ...state.settings.notifications, ...action.payload.notifications },
          advanced: { ...state.settings.advanced, ...action.payload.advanced },
        },
      };
    case "RESET_SETTINGS":
      return { ...state, settings: DEFAULT_SETTINGS };

    // Global actions
    case "CLEAR_ALL_DATA":
      return {
        agents: [],
        tasks: [],
        workflows: [],
        documents: [],
        aiResults: [],
        settings: DEFAULT_SETTINGS,
      };
    case "IMPORT_STATE":
      return action.payload;

    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Helper functions
  addAgent: (config: AgentConfig) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: Task["status"]) => void;
  addDocument: (doc: Omit<Document, "id" | "uploadedAt">) => void;
  deleteDocument: (id: string) => void;
  addAIResult: (result: Omit<AIResult, "id" | "createdAt">) => void;
  deleteAIResult: (id: string) => void;
  clearAIResults: () => void;
  getAIResultsByDocument: (documentId: string) => AIResult[];
  updateSettings: (settings: Partial<Settings>) => void;
  getAgentById: (id: string) => Agent | undefined;
  getTasksByAgent: (agentId: string) => Task[];
  getActiveAgents: () => Agent[];
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  clearAllData: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  }, [state]);

  // Helper functions
  const addAgent = (config: AgentConfig) => {
    dispatch({ type: "ADD_AGENT", payload: config });
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    dispatch({ type: "UPDATE_AGENT", payload: { id, updates } });
  };

  const deleteAgent = (id: string) => {
    dispatch({ type: "DELETE_AGENT", payload: id });
  };

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    dispatch({ type: "ADD_TASK", payload: task });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: "UPDATE_TASK", payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  const setTaskStatus = (id: string, status: Task["status"]) => {
    dispatch({ type: "SET_TASK_STATUS", payload: { id, status } });
  };

  const addDocument = (doc: Omit<Document, "id" | "uploadedAt">) => {
    dispatch({ type: "ADD_DOCUMENT", payload: doc });
  };

  const deleteDocument = (id: string) => {
    dispatch({ type: "DELETE_DOCUMENT", payload: id });
  };

  const addAIResult = (result: Omit<AIResult, "id" | "createdAt">) => {
    dispatch({ type: "ADD_AI_RESULT", payload: result });
  };

  const deleteAIResult = (id: string) => {
    dispatch({ type: "DELETE_AI_RESULT", payload: id });
  };

  const clearAIResults = () => {
    dispatch({ type: "CLEAR_AI_RESULTS" });
  };

  const getAIResultsByDocument = (documentId: string) => {
    return state.aiResults.filter((result) => result.documentId === documentId);
  };

  const updateSettings = (settings: Partial<Settings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  };

  const getAgentById = (id: string) => {
    return state.agents.find((agent) => agent.id === id);
  };

  const getTasksByAgent = (agentId: string) => {
    return state.tasks.filter((task) => task.agentId === agentId);
  };

  const getActiveAgents = () => {
    return state.agents.filter((agent) => agent.status === "active" || agent.status === "busy");
  };

  const exportData = () => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as AppState;
      dispatch({ type: "IMPORT_STATE", payload: data });
      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  };

  const clearAllData = () => {
    dispatch({ type: "CLEAR_ALL_DATA" });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addAgent,
    updateAgent,
    deleteAgent,
    addTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    addDocument,
    deleteDocument,
    addAIResult,
    deleteAIResult,
    clearAIResults,
    getAIResultsByDocument,
    updateSettings,
    getAgentById,
    getTasksByAgent,
    getActiveAgents,
    exportData,
    importData,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Export individual hooks for specific state slices
export const useAgents = () => {
  const { state, addAgent, updateAgent, deleteAgent, getAgentById, getActiveAgents } = useApp();
  return {
    agents: state.agents,
    addAgent,
    updateAgent,
    deleteAgent,
    getAgentById,
    getActiveAgents,
  };
};

export const useTasks = () => {
  const { state, addTask, updateTask, deleteTask, setTaskStatus, getTasksByAgent } = useApp();
  return {
    tasks: state.tasks,
    addTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    getTasksByAgent,
  };
};

export const useDocuments = () => {
  const { state, addDocument, deleteDocument } = useApp();
  return {
    documents: state.documents,
    addDocument,
    deleteDocument,
  };
};

export const useAIResults = () => {
  const { state, addAIResult, deleteAIResult, clearAIResults, getAIResultsByDocument } = useApp();
  return {
    aiResults: state.aiResults,
    addAIResult,
    deleteAIResult,
    clearAIResults,
    getAIResultsByDocument,
  };
};

export const useWorkflows = () => {
  const { state, dispatch } = useApp();
  return {
    workflows: state.workflows,
    addWorkflow: (workflow: Omit<Workflow, "id">) =>
      dispatch({ type: "ADD_WORKFLOW", payload: workflow }),
    updateWorkflow: (id: string, updates: Partial<Workflow>) =>
      dispatch({ type: "UPDATE_WORKFLOW", payload: { id, updates } }),
    deleteWorkflow: (id: string) => dispatch({ type: "DELETE_WORKFLOW", payload: id }),
  };
};

export const useSettings = () => {
  const { state, updateSettings, dispatch } = useApp();
  return {
    settings: state.settings,
    updateSettings,
    resetSettings: () => dispatch({ type: "RESET_SETTINGS" }),
  };
};

export default AppContext;
