
import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Search, FileArchive, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Documents = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([
    { id: 1, name: "Financial Report Q1 2025.pdf", size: "2.4 MB", date: "Apr 4, 2025" },
    { id: 2, name: "Project Requirements.docx", size: "1.8 MB", date: "Apr 1, 2025" },
    { id: 3, name: "User Research Data.xlsx", size: "4.2 MB", date: "Mar 28, 2025" },
    { id: 4, name: "Contract Template.pdf", size: "1.1 MB", date: "Mar 25, 2025" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = () => {
    toast({
      title: "Upload initiated",
      description: "Your document is being processed...",
    });
    // In a real app, we would have a file upload dialog here
    setTimeout(() => {
      const newDoc = {
        id: documents.length + 1,
        name: `New Document ${Math.floor(Math.random() * 1000)}.pdf`,
        size: `${(Math.random() * 5).toFixed(1)} MB`,
        date: "Apr 6, 2025",
      };
      setDocuments([newDoc, ...documents]);
      toast({
        title: "Upload complete",
        description: `${newDoc.name} has been successfully uploaded`,
      });
    }, 1500);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-teal" />
              Document Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
             
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <FileArchive className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No matching documents found." : "No documents found. Upload your first document to get started."}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="px-3 py-2 text-sm font-medium">Name</th>
                      <th className="px-3 py-2 text-sm font-medium">Size</th>
                      <th className="px-3 py-2 text-sm font-medium">Date</th>
                      <th className="px-3 py-2 text-sm font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map(doc => (
                      <tr key={doc.id} className="border-b hover:bg-muted/50">
                        <td className="px-3 py-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-teal" />
                          <span className="truncate max-w-[200px] md:max-w-none">{doc.name}</span>
                        </td>
                        <td className="px-3 py-2 text-sm text-muted-foreground">{doc.size}</td>
                        <td className="px-3 py-2 text-sm text-muted-foreground">{doc.date}</td>
                        <td className="px-3 py-2 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
