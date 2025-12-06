import React, { useState, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bot, FileText, Home, Settings, Clock, Sparkles, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppHeader = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 flex items-center h-14 md:h-16 px-4 md:px-6 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <SidebarTrigger className="mr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" />
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-niche-cyan to-niche-purple">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            Autonomous Knowledge Worker
          </h1>
          {!isMobile && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-powered workflow automation
            </p>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">System Active</span>
        </div>
      </div>
    </header>
  );
};

const AppSidebar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/", description: "Overview & stats" },
    { title: "Agents", icon: Bot, path: "/agents", description: "Manage AI agents" },
    { title: "Documents", icon: FileText, path: "/documents", description: "File storage" },
    { title: "History", icon: Clock, path: "/history", description: "Past workflows" },
    { title: "Settings", icon: Settings, path: "/settings", description: "Configuration" },
  ];

  return (
    <Sidebar className="border-r border-slate-200/80 dark:border-slate-800/80">
      <SidebarHeader className="px-4 md:px-6 py-5 md:py-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-niche-cyan via-niche-purple to-niche-pink rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-niche-cyan via-niche-purple to-niche-pink shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-niche-cyan via-niche-purple to-niche-pink bg-clip-text text-transparent">
              NICHE.AI
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive = currentPath === item.path;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={isMobile ? item.title : undefined}
                      isActive={isActive}
                      className={cn(
                        "relative group h-11 px-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-niche-cyan/10 via-niche-purple/10 to-niche-pink/10 text-niche-cyan dark:text-niche-cyan-light"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <Link to={item.path} className="flex items-center gap-3">
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-niche-cyan to-niche-purple" />
                        )}
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-br from-niche-cyan to-niche-purple text-white shadow-md"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-sm font-medium",
                            isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                          )}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-500 hidden lg:block">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 md:px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-niche-cyan/5 via-niche-purple/5 to-niche-pink/5 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-niche-cyan to-niche-purple">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Pro Plan</span>
              <span className="text-[10px] text-slate-500">Unlimited agents</span>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 dark:text-slate-600">
            © 2025 NICHE.AI • v1.0.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainLayout;
