// AI-Powered Agent Service
// This service connects agents to real AI capabilities

import {
  summarizeDocument,
  answerDocumentQuestion,
  extractData,
  generateReport,
  conductResearch,
  chatWithContext,
  ChatMessage,
} from "@/lib/openai";
import { extractTextFromFile, ProcessedDocument, chunkDocument } from "./DocumentProcessor";
import { Task, TaskStep, Agent, generateId, formatDuration } from "@/types";

// Task types that agents can perform
export type TaskType =
  | "summarize"
  | "qa"
  | "extract"
  | "report"
  | "research"
  | "analyze"
  | "chat";

export interface AITaskConfig {
  type: TaskType;
  documentContent?: string;
  documentFile?: File;
  question?: string;
  extractionType?: string;
  reportType?: string;
  researchTopic?: string;
  chatHistory?: ChatMessage[];
}

export interface AITaskResult {
  success: boolean;
  output: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Execute a real AI task
export async function executeAITask(
  config: AITaskConfig,
  agent: Agent,
  onProgress?: (progress: number, step: string) => void
): Promise<AITaskResult> {
  try {
    let documentContent = config.documentContent || "";

    // Extract text from file if provided
    if (config.documentFile && !documentContent) {
      onProgress?.(10, "Extracting document content...");
      const processed = await extractTextFromFile(config.documentFile);
      documentContent = processed.content;
    }

    // Truncate very long documents
    const maxLength = 50000;
    if (documentContent.length > maxLength) {
      documentContent = documentContent.substring(0, maxLength) + "\n\n[Document truncated for processing]";
    }

    onProgress?.(30, "Processing with AI...");

    let result: string;

    switch (config.type) {
      case "summarize":
        onProgress?.(50, "Generating summary...");
        result = await summarizeDocument(documentContent, agent.type);
        break;

      case "qa":
        if (!config.question) {
          throw new Error("Question is required for Q&A tasks");
        }
        onProgress?.(50, "Analyzing document for answer...");
        result = await answerDocumentQuestion(
          documentContent,
          config.question,
          agent.type
        );
        break;

      case "extract":
        onProgress?.(50, "Extracting structured data...");
        result = await extractData(
          documentContent,
          config.extractionType || "general",
          agent.type
        );
        break;

      case "report":
        onProgress?.(50, "Generating report...");
        result = await generateReport(
          documentContent,
          config.reportType || "analysis",
          agent.type
        );
        break;

      case "research":
        if (!config.researchTopic) {
          throw new Error("Research topic is required");
        }
        onProgress?.(50, "Conducting research...");
        result = await conductResearch(
          config.researchTopic,
          documentContent,
          agent.type
        );
        break;

      case "chat":
        onProgress?.(50, "Processing conversation...");
        result = await chatWithContext(
          config.chatHistory || [],
          config.question || "",
          documentContent,
          agent.type
        );
        break;

      case "analyze":
      default:
        onProgress?.(50, "Analyzing content...");
        result = await summarizeDocument(documentContent, agent.type);
        break;
    }

    onProgress?.(90, "Finalizing results...");

    return {
      success: true,
      output: result,
    };
  } catch (error: any) {
    console.error("AI Task Error:", error);
    return {
      success: false,
      output: "",
      error: error.message || "An error occurred during AI processing",
    };
  }
}

// Generate task steps based on task type
export function generateAITaskSteps(taskType: TaskType): TaskStep[] {
  const stepConfigs: Record<TaskType, string[]> = {
    summarize: [
      "Reading document",
      "Analyzing content structure",
      "Identifying key points",
      "Generating summary",
      "Formatting output",
    ],
    qa: [
      "Processing question",
      "Scanning document",
      "Finding relevant sections",
      "Analyzing context",
      "Generating answer",
    ],
    extract: [
      "Parsing document",
      "Identifying data fields",
      "Extracting values",
      "Validating data",
      "Structuring output",
    ],
    report: [
      "Analyzing source data",
      "Creating outline",
      "Writing sections",
      "Adding insights",
      "Formatting report",
    ],
    research: [
      "Processing topic",
      "Gathering information",
      "Analyzing perspectives",
      "Synthesizing findings",
      "Compiling report",
    ],
    analyze: [
      "Loading document",
      "Running analysis",
      "Identifying patterns",
      "Drawing conclusions",
      "Preparing results",
    ],
    chat: [
      "Processing context",
      "Understanding query",
      "Generating response",
    ],
  };

  const steps = stepConfigs[taskType] || stepConfigs.analyze;

  return steps.map((name) => ({
    id: generateId(),
    name,
    status: "idle" as const,
  }));
}

// Create an AI-powered task
export function createAITask(
  name: string,
  description: string,
  agent: Agent,
  taskType: TaskType,
  input?: string
): Task {
  const steps = generateAITaskSteps(taskType);

  return {
    id: generateId(),
    name,
    description,
    agentId: agent.id,
    agentName: agent.name,
    status: "queued",
    progress: 0,
    steps,
    input,
    createdAt: new Date().toISOString(),
  };
}

// Execute task with real AI and progress tracking
export async function executeAITaskWithProgress(
  task: Task,
  config: AITaskConfig,
  agent: Agent,
  onUpdate: (task: Task) => void,
  onComplete: (task: Task) => void
): Promise<void> {
  const startTime = Date.now();

  // Update task to running
  let currentTask: Task = {
    ...task,
    status: "running",
    startedAt: new Date().toISOString(),
  };
  onUpdate(currentTask);

  const totalSteps = currentTask.steps.length;

  const updateStep = (stepIndex: number, status: TaskStep["status"]) => {
    currentTask = {
      ...currentTask,
      steps: currentTask.steps.map((step, idx) =>
        idx === stepIndex ? { ...step, status } : step
      ),
      progress: Math.round(((stepIndex + 1) / totalSteps) * 80),
    };
    onUpdate(currentTask);
  };

  try {
    // Mark first step as running
    updateStep(0, "running");

    // Execute the AI task
    const result = await executeAITask(
      config,
      agent,
      (progress, stepName) => {
        // Update steps based on progress
        const stepIndex = Math.min(
          Math.floor((progress / 100) * totalSteps),
          totalSteps - 1
        );

        // Mark previous steps as completed
        for (let i = 0; i < stepIndex; i++) {
          if (currentTask.steps[i].status !== "completed") {
            updateStep(i, "completed");
          }
        }

        // Mark current step as running
        if (currentTask.steps[stepIndex].status !== "completed") {
          updateStep(stepIndex, "running");
        }
      }
    );

    if (result.success) {
      // Mark all steps as completed
      currentTask = {
        ...currentTask,
        steps: currentTask.steps.map((step) => ({
          ...step,
          status: "completed" as const,
          completedAt: new Date().toISOString(),
        })),
        status: "completed",
        progress: 100,
        output: result.output,
        completedAt: new Date().toISOString(),
        duration: formatDuration(Date.now() - startTime),
      };
    } else {
      // Mark task as failed
      currentTask = {
        ...currentTask,
        status: "failed",
        error: result.error,
        completedAt: new Date().toISOString(),
        duration: formatDuration(Date.now() - startTime),
      };
    }

    onUpdate(currentTask);
    onComplete(currentTask);
  } catch (error: any) {
    currentTask = {
      ...currentTask,
      status: "failed",
      error: error.message || "An unexpected error occurred",
      completedAt: new Date().toISOString(),
      duration: formatDuration(Date.now() - startTime),
    };
    onUpdate(currentTask);
    onComplete(currentTask);
  }
}

// Quick actions for common AI tasks
export const quickActions = {
  summarize: (agent: Agent) => ({
    name: "Summarize Document",
    type: "summarize" as TaskType,
    description: "Generate a comprehensive summary of the document",
    icon: "FileText",
  }),
  extract: (agent: Agent) => ({
    name: "Extract Data",
    type: "extract" as TaskType,
    description: "Extract structured data from the document",
    icon: "Database",
  }),
  analyze: (agent: Agent) => ({
    name: "Analyze Content",
    type: "analyze" as TaskType,
    description: "Perform detailed analysis of the content",
    icon: "BarChart",
  }),
  report: (agent: Agent) => ({
    name: "Generate Report",
    type: "report" as TaskType,
    description: "Create a professional report from the data",
    icon: "FileSpreadsheet",
  }),
};

export default {
  executeAITask,
  executeAITaskWithProgress,
  createAITask,
  generateAITaskSteps,
  quickActions,
};
