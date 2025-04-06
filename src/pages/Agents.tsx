
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

const Agents = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand-teal" />
              Agent Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure and manage your autonomous agents. This section allows you to create, 
              edit, and monitor your AI workers.
            </p>
            <div className="mt-4 p-8 border-2 border-dashed rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Agent management interface coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Agents;
