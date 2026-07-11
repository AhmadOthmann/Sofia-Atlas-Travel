'use client';

import { NavigationSidebar } from './navigation-sidebar';
import { mockAIAgents, mockGlobalKPIs } from '@/lib/mock-data';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background lg:flex-row">
      {/* Left Navigation - Fixed sidebar */}
      <div className="shrink-0">
        <NavigationSidebar agents={mockAIAgents} kpis={mockGlobalKPIs} />
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {children}
      </div>
    </div>
  );
}
