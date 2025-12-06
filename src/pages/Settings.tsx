import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Save, Key, BellRing, Code, Network, Globe, Clock, Shield, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Autonomous Knowledge Worker",
    defaultLanguage: "English",
    timezone: "UTC-5",
    saveInterval: "5"
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
      <div className="space-y-6 lg:space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Settings
              </h1>
              <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-niche-cyan" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm lg:text-base">
              Configure your NICHE.AI platform
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-niche-cyan to-niche-purple shadow-lg">
                <SettingsIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  System Settings
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Manage your platform configuration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-4 sm:mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl h-auto">
                <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm text-xs sm:text-sm py-2">
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="api" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm text-xs sm:text-sm py-2">
                  <Key className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">API Keys</span>
                  <span className="sm:hidden">API</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm text-xs sm:text-sm py-2">
                  <BellRing className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm text-xs sm:text-sm py-2">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Advanced</span>
                  <span className="sm:hidden">More</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="systemName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      System Name
                    </Label>
                    <Input
                      id="systemName"
                      value={generalSettings.systemName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Default Language
                    </Label>
                    <Select value={generalSettings.defaultLanguage} onValueChange={(v) => setGeneralSettings({ ...generalSettings, defaultLanguage: v })}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Timezone
                    </Label>
                    <Select value={generalSettings.timezone} onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="UTC+0">UTC+0 (Greenwich)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                        <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                        <SelectItem value="UTC+1">UTC+1 (Central Europe)</SelectItem>
                        <SelectItem value="UTC+8">UTC+8 (China)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saveInterval" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Auto-save Interval (minutes)
                    </Label>
                    <Input
                      id="saveInterval"
                      type="number"
                      value={generalSettings.saveInterval}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, saveInterval: e.target.value })}
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSaveSettings('general')}
                  className="rounded-xl btn-gradient shadow-lg shadow-niche-purple/25"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </TabsContent>

              <TabsContent value="api" className="mt-0 space-y-6">
                {[
                  { id: "openAI", label: "OpenAI API Key", icon: Key, value: apiKeys.openAI, connected: true },
                  { id: "pinecone", label: "Pinecone API Key", icon: Network, value: apiKeys.pinecone, connected: false },
                  { id: "slack", label: "Slack Webhook URL", icon: Code, value: apiKeys.slackWebhook, connected: true },
                ].map((api) => (
                  <div key={api.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <api.icon className="h-4 w-4" />
                        {api.label}
                      </Label>
                      <span className={cn(
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium",
                        api.connected
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}>
                        {api.connected ? <CheckCircle2 className="h-3 w-3" /> : null}
                        {api.connected ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id={api.id}
                        type="password"
                        value={api.value}
                        className="flex-1 h-11 rounded-xl border-slate-200 dark:border-slate-700"
                        readOnly
                      />
                      <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700">
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => handleSaveSettings('API')}
                  className="rounded-xl btn-gradient shadow-lg shadow-niche-purple/25"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save API Settings
                </Button>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Notification Channels
                  </h3>
                  {[
                    { id: "email", label: "Email Notifications", checked: notifications.email },
                    { id: "slack", label: "Slack Notifications", checked: notifications.slack },
                    { id: "browser", label: "Browser Notifications", checked: notifications.browser },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <Label htmlFor={item.id} className="flex items-center gap-3 cursor-pointer">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <BellRing className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
                      </Label>
                      <Switch
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, [item.id]: checked })}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Notification Events
                  </h3>
                  {[
                    { id: "completionAlerts", label: "Workflow Completion Alerts", checked: notifications.completionAlerts },
                    { id: "errorAlerts", label: "Error Alerts", checked: notifications.errorAlerts },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <Label htmlFor={item.id} className="flex items-center gap-3 cursor-pointer">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <BellRing className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
                      </Label>
                      <Switch
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, [item.id]: checked })}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSaveSettings('notification')}
                  className="rounded-xl btn-gradient shadow-lg shadow-niche-purple/25"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0 space-y-6">
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">Caution</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        These settings affect system performance and stability. Only modify if you understand the implications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxMemory" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Maximum Memory Usage (MB)
                    </Label>
                    <Input
                      id="maxMemory"
                      type="number"
                      defaultValue="2048"
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concurrentTasks" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Maximum Concurrent Tasks
                    </Label>
                    <Input
                      id="concurrentTasks"
                      type="number"
                      defaultValue="5"
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logLevel" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Log Level
                    </Label>
                    <Select defaultValue="info">
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Label htmlFor="developerMode" className="flex items-center gap-3 cursor-pointer">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Code className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-100 block">Developer Mode</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Enable advanced debugging features</span>
                    </div>
                  </Label>
                  <Switch id="developerMode" />
                </div>

                <Button
                  onClick={() => handleSaveSettings('advanced')}
                  className="rounded-xl btn-gradient shadow-lg shadow-niche-purple/25"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Advanced Settings
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
