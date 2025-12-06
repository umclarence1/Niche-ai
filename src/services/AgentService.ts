import { Task, TaskStep, Agent, generateId, formatDuration } from "@/types";

// Simulated step names for different task types
const STEP_TEMPLATES: Record<string, string[]> = {
  analysis: ["Parsing input data", "Identifying patterns", "Running analysis", "Generating insights", "Compiling report"],
  research: ["Gathering sources", "Reviewing documents", "Cross-referencing data", "Synthesizing findings", "Writing summary"],
  document: ["Reading document", "Extracting text", "Processing content", "Validating data", "Finalizing output"],
  default: ["Initializing", "Processing", "Analyzing", "Validating", "Completing"],
};

// Task execution callback type
type TaskUpdateCallback = (task: Task) => void;
type TaskCompleteCallback = (task: Task) => void;

// Active task runners
const activeRunners: Map<string, { abort: () => void }> = new Map();

// Get step template based on task name
const getStepTemplate = (taskName: string): string[] => {
  const lowerName = taskName.toLowerCase();
  if (lowerName.includes("analysis") || lowerName.includes("analyze")) {
    return STEP_TEMPLATES.analysis;
  }
  if (lowerName.includes("research") || lowerName.includes("find") || lowerName.includes("search")) {
    return STEP_TEMPLATES.research;
  }
  if (lowerName.includes("document") || lowerName.includes("read") || lowerName.includes("process")) {
    return STEP_TEMPLATES.document;
  }
  return STEP_TEMPLATES.default;
};

// Generate initial task steps
export const generateTaskSteps = (taskName: string): TaskStep[] => {
  const template = getStepTemplate(taskName);
  return template.map((name, index) => ({
    id: generateId(),
    name,
    status: index === 0 ? "queued" : "idle",
  }));
};

// Create a new task
export const createTask = (
  name: string,
  description: string,
  agent: Agent,
  input?: string
): Task => {
  const steps = generateTaskSteps(name);

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
};

// Simulate task execution
export const executeTask = async (
  task: Task,
  onUpdate: TaskUpdateCallback,
  onComplete: TaskCompleteCallback
): Promise<void> => {
  let aborted = false;
  const abort = () => {
    aborted = true;
  };

  activeRunners.set(task.id, { abort });

  // Start the task
  const startTime = Date.now();
  let currentTask: Task = {
    ...task,
    status: "running",
    startedAt: new Date().toISOString(),
  };
  onUpdate(currentTask);

  // Simulate processing each step
  const totalSteps = currentTask.steps.length;

  for (let i = 0; i < totalSteps; i++) {
    if (aborted) {
      currentTask = {
        ...currentTask,
        status: "paused",
        steps: currentTask.steps.map((step, idx) =>
          idx === i
            ? { ...step, status: "idle" }
            : step
        ),
      };
      onUpdate(currentTask);
      activeRunners.delete(task.id);
      return;
    }

    // Update current step to running
    currentTask = {
      ...currentTask,
      steps: currentTask.steps.map((step, idx) =>
        idx === i
          ? { ...step, status: "running", startedAt: new Date().toISOString() }
          : step
      ),
      progress: Math.round((i / totalSteps) * 100),
    };
    onUpdate(currentTask);

    // Simulate step processing time (1-3 seconds per step)
    const stepDuration = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, stepDuration));

    if (aborted) {
      currentTask = {
        ...currentTask,
        status: "paused",
        steps: currentTask.steps.map((step, idx) =>
          idx === i
            ? { ...step, status: "idle" }
            : step
        ),
      };
      onUpdate(currentTask);
      activeRunners.delete(task.id);
      return;
    }

    // Randomly simulate occasional failures (5% chance)
    if (Math.random() < 0.05) {
      currentTask = {
        ...currentTask,
        status: "failed",
        steps: currentTask.steps.map((step, idx) =>
          idx === i
            ? {
                ...step,
                status: "failed",
                completedAt: new Date().toISOString(),
                error: "Simulated processing error"
              }
            : step
        ),
        error: `Step "${currentTask.steps[i].name}" failed: Simulated processing error`,
        completedAt: new Date().toISOString(),
        duration: formatDuration(Date.now() - startTime),
      };
      onUpdate(currentTask);
      onComplete(currentTask);
      activeRunners.delete(task.id);
      return;
    }

    // Complete current step
    currentTask = {
      ...currentTask,
      steps: currentTask.steps.map((step, idx) =>
        idx === i
          ? {
              ...step,
              status: "completed",
              completedAt: new Date().toISOString(),
              output: `Step ${i + 1} completed successfully`
            }
          : idx === i + 1
            ? { ...step, status: "queued" }
            : step
      ),
    };
    onUpdate(currentTask);
  }

  // Complete the task
  const outputs = [
    "Analysis completed successfully. Found 3 key insights and 5 recommendations.",
    "Research concluded with 12 relevant sources identified and synthesized.",
    "Document processed. Extracted 1,247 data points across 15 categories.",
    "Task completed. Results have been compiled and are ready for review.",
    "Processing finished. Generated comprehensive report with actionable insights.",
  ];

  currentTask = {
    ...currentTask,
    status: "completed",
    progress: 100,
    output: outputs[Math.floor(Math.random() * outputs.length)],
    completedAt: new Date().toISOString(),
    duration: formatDuration(Date.now() - startTime),
  };

  onUpdate(currentTask);
  onComplete(currentTask);
  activeRunners.delete(task.id);
};

// Pause a running task
export const pauseTask = (taskId: string): boolean => {
  const runner = activeRunners.get(taskId);
  if (runner) {
    runner.abort();
    return true;
  }
  return false;
};

// Check if a task is running
export const isTaskRunning = (taskId: string): boolean => {
  return activeRunners.has(taskId);
};

// Cancel all running tasks
export const cancelAllTasks = (): void => {
  activeRunners.forEach(runner => runner.abort());
  activeRunners.clear();
};

// Batch execute multiple tasks
export const executeBatchTasks = async (
  tasks: Task[],
  onUpdate: TaskUpdateCallback,
  onComplete: TaskCompleteCallback,
  concurrency: number = 2
): Promise<void> => {
  const queue = [...tasks];
  const executing: Promise<void>[] = [];

  const executeNext = async (): Promise<void> => {
    if (queue.length === 0) return;

    const task = queue.shift()!;
    await executeTask(task, onUpdate, onComplete);
    await executeNext();
  };

  // Start initial batch
  for (let i = 0; i < Math.min(concurrency, tasks.length); i++) {
    executing.push(executeNext());
  }

  await Promise.all(executing);
};

// Get task statistics
export const getTaskStats = (tasks: Task[]) => {
  const completed = tasks.filter(t => t.status === "completed").length;
  const failed = tasks.filter(t => t.status === "failed").length;
  const running = tasks.filter(t => t.status === "running").length;
  const queued = tasks.filter(t => t.status === "queued").length;

  return {
    total: tasks.length,
    completed,
    failed,
    running,
    queued,
    successRate: tasks.length > 0
      ? Math.round((completed / (completed + failed || 1)) * 100)
      : 0,
  };
};

export default {
  createTask,
  executeTask,
  pauseTask,
  isTaskRunning,
  cancelAllTasks,
  executeBatchTasks,
  generateTaskSteps,
  getTaskStats,
};
