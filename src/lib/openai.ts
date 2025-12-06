import OpenAI from "openai";

// Lazy-initialized OpenAI client (to prevent crashes when API key is missing)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
      throw new Error("OpenAI API key not configured. Please add your API key to the .env file.");
    }
    openaiClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, use a backend
    });
  }
  return openaiClient;
}

export type AIModel = "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// System prompts for different agent types
export const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  accountant: `You are an expert AI accounting assistant. You specialize in:
- Tax preparation and planning
- Bookkeeping and financial record management
- Audit support and compliance
- Financial advisory and analysis
- Payroll processing
- Invoice management

Provide accurate, professional financial advice. Always note when users should consult a licensed CPA for complex matters.`,

  legal: `You are an expert AI legal assistant. You specialize in:
- Contract review and analysis
- Legal research and case law
- Compliance and regulatory matters
- Intellectual property guidance
- Due diligence support

Provide thorough legal analysis. Always note that you are an AI assistant and recommend consulting a licensed attorney for legal decisions.`,

  medical: `You are an expert AI medical documentation assistant. You specialize in:
- Patient record organization and analysis
- Insurance claim processing
- Medical coding (ICD-10, CPT)
- Treatment plan documentation
- Appointment scheduling optimization

Provide accurate medical documentation support. Always note that medical decisions should be made by licensed healthcare professionals.`,

  architect: `You are an expert AI architecture assistant. You specialize in:
- Drawing and blueprint review
- Building code compliance
- Project management support
- Material analysis and recommendations
- Cost estimation
- Permit documentation

Provide detailed architectural analysis and recommendations.`,

  researcher: `You are an expert AI research assistant. You specialize in:
- Market research and competitive analysis
- Data mining and synthesis
- Trend analysis and forecasting
- Report writing and documentation
- Citation management
- Literature review

Provide thorough, well-sourced research with proper citations when possible.`,

  analyst: `You are an expert AI data analyst. You specialize in:
- Data analysis and visualization recommendations
- Financial modeling
- Forecasting and predictive analysis
- KPI tracking and performance metrics
- Dashboard design recommendations
- Statistical analysis

Provide data-driven insights with clear explanations of methodology.`,
};

// Check if API key is configured
export function isAPIKeyConfigured(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!(apiKey && apiKey.length > 0 && apiKey !== "your_openai_api_key_here");
}

// Error types for better handling
export type AIErrorType = "quota_exceeded" | "invalid_key" | "rate_limit" | "network" | "unknown";

export interface AIError {
  type: AIErrorType;
  message: string;
  details?: string;
}

// Parse API errors
function parseAPIError(error: any): AIError {
  const errorMessage = error?.message || error?.error?.message || "";
  const errorCode = error?.code || error?.error?.code || "";
  const statusCode = error?.status || error?.response?.status;

  // Quota exceeded
  if (
    errorMessage.includes("quota") ||
    errorMessage.includes("exceeded") ||
    errorMessage.includes("insufficient_quota") ||
    errorCode === "insufficient_quota" ||
    statusCode === 429
  ) {
    return {
      type: "quota_exceeded",
      message: "API quota exceeded. Please check your OpenAI billing settings.",
      details: "Your OpenAI account has reached its usage limit. Add payment method or upgrade your plan at platform.openai.com/billing",
    };
  }

  // Invalid API key
  if (
    errorMessage.includes("invalid") ||
    errorMessage.includes("api_key") ||
    errorMessage.includes("Incorrect API key") ||
    statusCode === 401
  ) {
    return {
      type: "invalid_key",
      message: "Invalid API key. Please check your OpenAI API key.",
      details: "Verify your API key in the .env file and ensure it's active at platform.openai.com/api-keys",
    };
  }

  // Rate limit
  if (errorMessage.includes("rate") || errorMessage.includes("limit")) {
    return {
      type: "rate_limit",
      message: "Rate limit reached. Please wait a moment and try again.",
      details: "Too many requests in a short time. The system will retry automatically.",
    };
  }

  // Network error
  if (errorMessage.includes("network") || errorMessage.includes("ECONNREFUSED")) {
    return {
      type: "network",
      message: "Network error. Please check your internet connection.",
      details: "Unable to reach OpenAI servers. Check your connection and try again.",
    };
  }

  return {
    type: "unknown",
    message: errorMessage || "An unexpected error occurred",
    details: "Please try again or contact support if the issue persists.",
  };
}

// Generate AI response
export async function generateResponse(
  messages: ChatMessage[],
  model: AIModel = "gpt-4o-mini",
  temperature: number = 0.7
): Promise<AIResponse> {
  // Check API key first
  if (!isAPIKeyConfigured()) {
    throw new Error("OpenAI API key not configured. Please add your API key to the .env file.");
  }

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: 4096,
    });

    return {
      content: response.choices[0]?.message?.content || "No response generated.",
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    const parsedError = parseAPIError(error);
    throw new Error(`${parsedError.message}\n\n${parsedError.details}`);
  }
}

// Summarize document content
export async function summarizeDocument(
  content: string,
  agentType: string = "analyst"
): Promise<string> {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentType] || AGENT_SYSTEM_PROMPTS.analyst;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Please provide a comprehensive summary of the following document. Include:
1. Main topics and key points
2. Important data, figures, or statistics
3. Key conclusions or recommendations
4. Any action items or next steps mentioned

Document content:
${content}`,
    },
  ];

  const response = await generateResponse(messages, "gpt-4o-mini", 0.3);
  return response.content;
}

// Answer questions about document
export async function answerDocumentQuestion(
  documentContent: string,
  question: string,
  agentType: string = "analyst"
): Promise<string> {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentType] || AGENT_SYSTEM_PROMPTS.analyst;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Based on the following document, please answer this question: "${question}"

If the answer cannot be found in the document, say so clearly.

Document content:
${documentContent}`,
    },
  ];

  const response = await generateResponse(messages, "gpt-4o-mini", 0.3);
  return response.content;
}

// Extract structured data from document
export async function extractData(
  content: string,
  extractionType: string,
  agentType: string = "analyst"
): Promise<string> {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentType] || AGENT_SYSTEM_PROMPTS.analyst;

  const extractionPrompts: Record<string, string> = {
    invoice: `Extract all invoice data including:
- Invoice number, date, due date
- Vendor/seller information
- Buyer/customer information
- Line items with descriptions, quantities, prices
- Subtotal, taxes, total amount
- Payment terms`,
    contract: `Extract key contract information including:
- Parties involved
- Effective date and term
- Key obligations of each party
- Payment terms
- Termination clauses
- Important deadlines
- Liability and indemnification clauses`,
    financial: `Extract financial data including:
- Revenue/income figures
- Expenses and costs
- Profit/loss calculations
- Key ratios and metrics
- Year-over-year comparisons
- Notable trends`,
    general: `Extract all important structured data including:
- Names, dates, and numbers
- Key entities and relationships
- Important figures and statistics
- Action items and deadlines`,
  };

  const prompt = extractionPrompts[extractionType] || extractionPrompts.general;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${prompt}

Format the extracted data in a clear, structured format.

Document content:
${content}`,
    },
  ];

  const response = await generateResponse(messages, "gpt-4o", 0.2);
  return response.content;
}

// Generate report from data
export async function generateReport(
  content: string,
  reportType: string,
  agentType: string = "analyst"
): Promise<string> {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentType] || AGENT_SYSTEM_PROMPTS.analyst;

  const reportPrompts: Record<string, string> = {
    analysis: `Generate a comprehensive analysis report including:
- Executive Summary
- Key Findings
- Detailed Analysis
- Data Insights
- Recommendations
- Conclusion`,
    summary: `Generate a professional summary report including:
- Overview
- Main Points
- Key Takeaways
- Next Steps`,
    comparison: `Generate a comparison report including:
- Items Being Compared
- Comparison Criteria
- Side-by-Side Analysis
- Pros and Cons
- Recommendation`,
  };

  const prompt = reportPrompts[reportType] || reportPrompts.analysis;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${prompt}

Use professional formatting with clear sections and bullet points where appropriate.

Source data:
${content}`,
    },
  ];

  const response = await generateResponse(messages, "gpt-4o", 0.5);
  return response.content;
}

// Conduct research on a topic
export async function conductResearch(
  topic: string,
  context: string = "",
  agentType: string = "researcher"
): Promise<string> {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentType] || AGENT_SYSTEM_PROMPTS.researcher;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Conduct thorough research on the following topic: "${topic}"

${context ? `Additional context: ${context}` : ""}

Please provide:
1. Overview of the topic
2. Key facts and information
3. Different perspectives or approaches
4. Current trends and developments
5. Potential implications or applications
6. Recommendations for further exploration

Note: Base your response on your training data. Acknowledge any limitations in your knowledge.`,
    },
  ];

  const response = await generateResponse(messages, "gpt-4o", 0.6);
  return response.content;
}

// Chat with context
export async function chatWithContext(
  conversationHistory: ChatMessage[],
  userMessage: string,
  documentContext: string = "",
  agentType: string = "analyst"
): Promise<string> {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentType] || AGENT_SYSTEM_PROMPTS.analyst;

  const contextMessage = documentContext
    ? `\n\nYou have access to the following document for reference:\n${documentContext}`
    : "";

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt + contextMessage },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  const response = await generateResponse(messages, "gpt-4o-mini", 0.7);
  return response.content;
}

export { getOpenAIClient };
