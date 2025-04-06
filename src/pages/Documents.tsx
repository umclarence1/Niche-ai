
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Documents = () => {
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
            <p className="text-muted-foreground">
              Manage all your documents in one place. Upload, organize, and track usage of your 
              documents across workflows.
            </p>
            <div className="mt-4 p-8 border-2 border-dashed rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Document library interface coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
