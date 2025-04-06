
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-brand-teal" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="p-8 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    General settings interface coming soon
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="api">
                <div className="p-8 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    API keys management interface coming soon
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="p-8 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Notification settings interface coming soon
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="p-8 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Advanced settings interface coming soon
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
