
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bot, FileText, Home, Settings, Clock, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-brand-light">
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center h-14 md:h-16 px-3 md:px-4 border-b bg-white">
            <SidebarTrigger />
            <div className="ml-3 md:ml-4 text-base md:text-lg font-medium truncate">Autonomous Knowledge Worker</div>
          </div>
          <div className="p-3 md:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const isMobile = useIsMobile();
  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Agents", icon: Bot, path: "/agents" },
    { title: "Documents", icon: FileText, path: "/documents" },
    { title: "History", icon: Clock, path: "/history" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-center space-x-2">
          <Workflow className="h-5 w-5 md:h-6 md:w-6 text-brand-teal" />
          <span className="font-bold text-base md:text-lg">NICHE.AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isMobile ? item.title : undefined}>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 md:px-6 py-3 md:py-4">
        <div className="text-xs text-gray-500">© 2025 NICHE.AI</div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainLayout;
