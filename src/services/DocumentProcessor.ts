// Document Processing Service
// Extracts text content from various document types

export interface ProcessedDocument {
  content: string;
  pageCount?: number;
  wordCount: number;
  metadata?: Record<string, any>;
}

// Extract text from a File object
export async function extractTextFromFile(file: File): Promise<ProcessedDocument> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Text files
  if (fileType.includes("text") || fileName.endsWith(".txt") || fileName.endsWith(".md")) {
    return extractFromTextFile(file);
  }

  // PDF files
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractFromPDF(file);
  }

  // CSV files
  if (fileType === "text/csv" || fileName.endsWith(".csv")) {
    return extractFromCSV(file);
  }

  // JSON files
  if (fileType === "application/json" || fileName.endsWith(".json")) {
    return extractFromJSON(file);
  }

  // For unsupported types, try reading as text
  try {
    return extractFromTextFile(file);
  } catch {
    return {
      content: `[Unable to extract text from ${file.name}. File type: ${fileType}]`,
      wordCount: 0,
    };
  }
}

// Extract from plain text file
async function extractFromTextFile(file: File): Promise<ProcessedDocument> {
  const content = await file.text();
  return {
    content,
    wordCount: countWords(content),
  };
}

// Extract from PDF using pdf.js
async function extractFromPDF(file: File): Promise<ProcessedDocument> {
  try {
    // Dynamic import of pdfjs-dist
    const pdfjsLib = await import("pdfjs-dist");

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    const pageCount = pdf.numPages;

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return {
      content: fullText.trim(),
      pageCount,
      wordCount: countWords(fullText),
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    return {
      content: `[Error extracting PDF content: ${error}]`,
      wordCount: 0,
    };
  }
}

// Extract from CSV
async function extractFromCSV(file: File): Promise<ProcessedDocument> {
  const text = await file.text();
  const lines = text.split("\n");
  const headers = lines[0]?.split(",").map((h) => h.trim()) || [];

  let content = `CSV Document with ${lines.length - 1} rows and ${headers.length} columns.\n\n`;
  content += `Columns: ${headers.join(", ")}\n\n`;
  content += `Data:\n${text}`;

  return {
    content,
    wordCount: countWords(text),
    metadata: {
      rowCount: lines.length - 1,
      columnCount: headers.length,
      columns: headers,
    },
  };
}

// Extract from JSON
async function extractFromJSON(file: File): Promise<ProcessedDocument> {
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    const prettyJson = JSON.stringify(data, null, 2);
    return {
      content: `JSON Document:\n\n${prettyJson}`,
      wordCount: countWords(prettyJson),
      metadata: {
        type: Array.isArray(data) ? "array" : "object",
        itemCount: Array.isArray(data) ? data.length : Object.keys(data).length,
      },
    };
  } catch {
    return {
      content: text,
      wordCount: countWords(text),
    };
  }
}

// Count words in text
function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

// Get document preview (first N characters)
export function getDocumentPreview(content: string, maxLength: number = 500): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
}

// Chunk document for processing (for large documents)
export function chunkDocument(content: string, chunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  let currentChunk = "";
  const sentences = content.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export default {
  extractTextFromFile,
  getDocumentPreview,
  chunkDocument,
};
