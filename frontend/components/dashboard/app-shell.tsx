"use client";

import { useState } from "react";
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

  return "Overview";
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-72">
        <AppHeader
          title={getPageTitle(pathname)}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-5rem)]">{children}</main>
      </div>
    </div>
  );
}
