
import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Save, Key, BellRing, Code, Network } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Autonomous Knowledge Worker",
    defaultLanguage: "English",
    timezone: "UTC-5 (Eastern Time)",
    saveInterval: "5 minutes"
  });

  const [apiKeys, setApiKeys] = useState({
    openAI: "sk-••••••••••••••••••••••••••••••",
    pinecone: "••••••••••••••••••••••••••••••",
    slackWebhook: "https://hooks.slack.com/services/••••••/••••••/•••••••"
  });

  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    browser: true,
    completionAlerts: true,
    errorAlerts: true
  });

  const handleSaveSettings = (tab: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${tab} settings have been updated successfully.`
    });
  };

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
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">System Name</Label>
                    <Input 
                      id="systemName" 
                      value={generalSettings.systemName} 
                      onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <select 
                      id="defaultLanguage" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={generalSettings.defaultLanguage}
                      onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select 
                      id="timezone" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    >
                      <option value="UTC+0 (Greenwich Mean Time)">UTC+0 (Greenwich Mean Time)</option>
                      <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                      <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                      <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                      <option value="UTC+8 (China Standard Time)">UTC+8 (China Standard Time)</option>
                    </select>
                  </div>
                  <Button 
                    className="mt-4 bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-2"
                    onClick={() => handleSaveSettings('general')}
                  >
                    <Save className="h-4 w-4" />
                    Save General Settings
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="api">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openAI" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      OpenAI API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id="openAI" 
                        type="password" 
                        value={apiKeys.openAI} 
                        onChange={(e) => setApiKeys({...apiKeys, openAI: e.target.value})}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pinecone" className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Pinecone API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id="pinecone" 
                        type="password" 
                        value={apiKeys.pinecone} 
                        onChange={(e) => setApiKeys({...apiKeys, pinecone: e.target.value})}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slackWebhook" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Slack Webhook URL
                    </Label>
                    <Input 
                      id="slackWebhook" 
                      value={apiKeys.slackWebhook} 
                      onChange={(e) => setApiKeys({...apiKeys, slackWebhook: e.target.value})}
                    />
                  </div>
                  <Button 
                    className="mt-4 bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-2"
                    onClick={() => handleSaveSettings('API')}
                  >
                    <Save className="h-4 w-4" />
                    Save API Settings
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Notification Channels</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotif" className="flex items-center gap-2 cursor-pointer">
                        <BellRing className="h-4 w-4" />
                        Email Notifications
                      </Label>
                      <Switch 
                        id="emailNotif" 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slackNotif" className="flex items-center gap-2 cursor-pointer">
                        <BellRing className="h-4 w-4" />
                        Slack Notifications
                      </Label>
                      <Switch 
                        id="slackNotif" 
                        checked={notifications.slack}
                        onCheckedChange={(checked) => setNotifications({...notifications, slack: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="browserNotif" className="flex items-center gap-2 cursor-pointer">
                        <BellRing className="h-4 w-4" />
                        Browser Notifications
                      </Label>
                      <Switch 
                        id="browserNotif" 
                        checked={notifications.browser}
                        onCheckedChange={(checked) => setNotifications({...notifications, browser: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-base font-medium">Notification Events</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="completionAlerts" className="flex items-center gap-2 cursor-pointer">
                        <BellRing className="h-4 w-4" />
                        Workflow Completion Alerts
                      </Label>
                      <Switch 
                        id="completionAlerts" 
                        checked={notifications.completionAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, completionAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="errorAlerts" className="flex items-center gap-2 cursor-pointer">
                        <BellRing className="h-4 w-4" />
                        Error Alerts
                      </Label>
                      <Switch 
                        id="errorAlerts" 
                        checked={notifications.errorAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, errorAlerts: checked})}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="mt-4 bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-2"
                    onClick={() => handleSaveSettings('notification')}
                  >
                    <Save className="h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-yellow-50">
                    <p className="text-yellow-800 text-sm">
                      Warning: These settings affect system performance and stability. 
                      Only modify if you understand the implications.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxMemory">Maximum Memory Usage (MB)</Label>
                    <Input 
                      id="maxMemory" 
                      type="number" 
                      defaultValue="2048" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="concurrentTasks">Maximum Concurrent Tasks</Label>
                    <Input 
                      id="concurrentTasks" 
                      type="number" 
                      defaultValue="5" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <select 
                      id="logLevel" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      defaultValue="info"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="developerMode" className="flex items-center gap-2 cursor-pointer">
                      <Code className="h-4 w-4" />
                      Developer Mode
                    </Label>
                    <Switch id="developerMode" />
                  </div>
                  
                  <Button 
                    className="mt-4 bg-brand-teal hover:bg-brand-teal/90 flex items-center gap-2"
                    onClick={() => handleSaveSettings('advanced')}
                  >
                    <Save className="h-4 w-4" />
                    Save Advanced Settings
                  </Button>
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
