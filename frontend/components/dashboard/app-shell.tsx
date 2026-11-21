"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppShellProps {
  children: React.ReactNode;
}

function getPageTitle(pathname: string) {
  if (pathname === "/assessment") {
    return "New Assessment";
  }

  if (pathname.startsWith("/dashboard/assessments/")) {
    return "Assessment Details";
  }

  if (pathname === "/dashboard") {
    return "Overview";
  }

  return "Workspace";
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile navigation after route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F7FAFF]">
      {/* Application sidebar */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main application area */}
      <div className="min-h-screen lg:pl-[280px]">
        {/* Application header */}
        <AppHeader
          title={getPageTitle(pathname)}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="min-h-[calc(100vh-72px)]">{children}</main>
      </div>
    </div>
  );
}
