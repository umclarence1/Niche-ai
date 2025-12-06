import React, { useState, useRef, useCallback, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Search, FileArchive, Download, Eye, Trash2, File, FileSpreadsheet, FileImage, MoreVertical, FolderOpen, CloudUpload, MessageSquare, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useDocuments, useAgents } from "@/store/AppContext";
import { getDocumentType, formatFileSize, formatDate, Document } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentChat, DocumentActions } from "@/components/DocumentChat";

// Hook to detect mobile screen
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const Documents = () => {
  const { toast } = useToast();
  const { documents, addDocument, deleteDocument } = useDocuments();
  const { agents } = useAgents();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Get the first agent or use default type
  const activeAgentType = agents.length > 0 ? agents[0].type : "analyst";

  // Check if panel is open
  const isPanelOpen = showChat || showActions;

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const documentType = getDocumentType(file.type, file.name);

      addDocument({
        name: file.name,
        type: documentType,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        mimeType: file.type,
        url: URL.createObjectURL(file),
      });

      toast({
        title: "Upload complete",
        description: `${file.name} has been uploaded`,
      });
    });
  }, [addDocument, toast]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDeleteDocument = (doc: Document) => {
    deleteDocument(doc.id);
    toast({
      title: "Document deleted",
      description: `${doc.name} has been removed`,
    });
  };

  const handleDownload = (doc: Document) => {
    if (doc.url) {
      const link = document.createElement("a");
      link.href = doc.url;
      link.download = doc.name;
      link.click();
    }
  };

  const handleOpenChat = (doc: Document) => {
    setSelectedDocument(doc);
    setShowChat(true);
    setShowActions(false);
  };

  const handleOpenActions = (doc: Document) => {
    setSelectedDocument(doc);
    setShowActions(true);
    setShowChat(false);
  };

  const handleClosePanel = () => {
    setShowChat(false);
    setShowActions(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
        return <File className="h-5 w-5 text-blue-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
      case "image":
        return <FileImage className="h-5 w-5 text-purple-500" />;
      default:
        return <FileArchive className="h-5 w-5 text-amber-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className={cn(
          "flex-1 space-y-6 lg:space-y-8 animate-fade-in transition-all duration-300",
          isPanelOpen && !isMobile && "lg:max-w-[60%]"
        )}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.gif,.zip,.rar"
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Documents
              </h1>
              <FolderOpen className="h-6 w-6 text-niche-purple" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Manage your files and documents for AI processing
            </p>
          </div>
          <Button
            onClick={handleUploadClick}
            className="gap-2 btn-gradient shadow-lg shadow-niche-purple/25"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-xl border-2 border-dashed p-8 transition-all duration-300 text-center",
            isDragging
              ? "border-niche-cyan bg-niche-cyan/5 scale-[1.02]"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
              isDragging
                ? "bg-niche-cyan/20 text-niche-cyan"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            )}>
              <CloudUpload className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {isDragging ? "Drop files here" : "Drag and drop files here"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                or{" "}
                <button
                  onClick={handleUploadClick}
                  className="text-niche-cyan hover:text-niche-purple transition-colors"
                >
                  browse from your computer
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Documents", value: documents.length, color: "text-niche-cyan" },
            { label: "PDFs", value: documents.filter(d => d.type === "pdf").length, color: "text-red-500" },
            { label: "Spreadsheets", value: documents.filter(d => d.type === "spreadsheet").length, color: "text-emerald-500" },
            { label: "Other Files", value: documents.filter(d => !["pdf", "spreadsheet"].includes(d.type)).length, color: "text-amber-500" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-niche-purple to-niche-pink shadow-lg">
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    All Documents
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {filteredDocuments.length} files
                  </CardDescription>
                </div>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10 h-10 rounded-xl border-slate-200 dark:border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <FileArchive className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 text-lg">
                  {searchQuery ? "No matching documents" : "No documents yet"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-sm">
                  {searchQuery ? "Try adjusting your search query" : "Upload your first document to get started"}
                </p>
                {searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                ) : (
                  <Button onClick={handleUploadClick} className="btn-gradient">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
                {filteredDocuments.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                      {getFileIcon(doc.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-niche-cyan transition-colors">
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{doc.sizeFormatted}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Mobile: Always visible action buttons */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 sm:h-9 w-8 sm:w-auto sm:px-3 p-0 sm:gap-1 text-niche-cyan hover:text-niche-purple hover:bg-niche-cyan/10"
                        onClick={() => handleOpenChat(doc)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline text-xs">Chat</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 sm:h-9 w-8 sm:w-auto sm:px-3 p-0 sm:gap-1 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        onClick={() => handleOpenActions(doc)}
                      >
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline text-xs">AI</span>
                      </Button>
                      {/* Desktop: Additional buttons */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => doc.url && window.open(doc.url, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 sm:h-9 w-8 sm:w-9 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleOpenChat(doc)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat with AI
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenActions(doc)}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            AI Actions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => doc.url && window.open(doc.url, "_blank")}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDeleteDocument(doc)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* AI Panel - Desktop (Side Panel) */}
        {isPanelOpen && !isMobile && (
          <div className="w-[40%] min-w-[400px] max-w-[500px] animate-fade-in sticky top-4 h-[calc(100vh-8rem)]">
            {showChat && (
              <DocumentChat
                document={selectedDocument}
                agentType={activeAgentType}
                onClose={handleClosePanel}
              />
            )}
            {showActions && (
              <DocumentActions
                document={selectedDocument}
                agentType={activeAgentType}
                onClose={handleClosePanel}
              />
            )}
          </div>
        )}

        {/* AI Panel - Mobile (Full Screen Dialog) */}
        <Dialog open={isPanelOpen && isMobile} onOpenChange={(open) => !open && handleClosePanel()}>
          <DialogContent className="max-w-full h-[90vh] sm:h-[85vh] p-0 gap-0 rounded-t-2xl sm:rounded-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>{showChat ? "Document Chat" : "AI Actions"}</DialogTitle>
            </DialogHeader>
            <div className="h-full overflow-hidden">
              {showChat && (
                <DocumentChat
                  document={selectedDocument}
                  agentType={activeAgentType}
                  onClose={handleClosePanel}
                />
              )}
              {showActions && (
                <DocumentActions
                  document={selectedDocument}
                  agentType={activeAgentType}
                  onClose={handleClosePanel}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Documents;
