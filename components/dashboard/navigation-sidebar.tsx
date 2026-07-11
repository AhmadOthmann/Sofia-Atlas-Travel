'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { AIAgent, GlobalKPIs } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  FileText,
  Phone,
  MessageCircle,
  BarChart3,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface NavigationSidebarProps {
  agents: AIAgent[];
  kpis: GlobalKPIs;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/' },
  { icon: Users, label: 'Leads', href: '/leads' },
  { icon: FileText, label: 'Drafts', href: '/drafts' },
  { icon: Phone, label: 'Calls', href: '/calls' },
  { icon: MessageCircle, label: 'Chat', href: '/chat' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

export function NavigationSidebar({ agents, kpis }: NavigationSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="relative z-20 flex w-full shrink-0 flex-row items-center border-b border-border bg-sidebar p-4 lg:h-screen lg:w-64 lg:flex-col lg:items-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-2 lg:mb-8">
        <Image src="/brand/atlas-logo-monogram.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
        <span className="text-lg font-semibold tracking-tight text-foreground lg:block">
          Atlas Travel
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 items-center gap-1 overflow-x-auto lg:mb-8 lg:w-full lg:flex-col lg:items-stretch lg:overflow-visible">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:gap-3 lg:py-2.5',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'justify-center lg:justify-start',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* AI Agent Status - Desktop only */}
      <div className="mb-6 hidden w-full px-2 lg:block">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Agents
        </h3>
        <div className="flex flex-col gap-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
            >
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    agent.status === 'in-call'
                      ? 'bg-info animate-pulse'
                      : agent.status === 'active'
                      ? 'bg-success'
                      : 'bg-muted-foreground/50'
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {agent.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {agent.status === 'in-call'
                    ? `On call: ${agent.currentLead}`
                    : agent.status === 'active'
                    ? 'Available'
                    : 'Idle'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global KPIs - Desktop only */}
      <div className="mt-auto hidden w-full px-2 lg:block">
        <h3 className="mb-3 hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:block">
          Key Metrics
        </h3>
        <div className="flex flex-col gap-3">
          <div className="rounded-lg bg-muted/50 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="hidden text-xs text-muted-foreground lg:block">
                Time to Quote
              </span>
              <span className="text-xs text-muted-foreground lg:hidden">
                TTQ
              </span>
              {kpis.timeToQuote.trend === 'down' ? (
                <TrendingDown className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5 text-destructive" />
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-semibold text-foreground">
                {kpis.timeToQuote.value}
              </span>
              <span className="text-xs text-success">
                {kpis.timeToQuote.change}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="hidden text-xs text-muted-foreground lg:block">
                AI Accuracy
              </span>
              <span className="text-xs text-muted-foreground lg:hidden">
                ACC
              </span>
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            </div>
            <div className="mt-1">
              <span className="text-lg font-semibold text-foreground">
                {kpis.aiAccuracy.value}%
              </span>
            </div>
          </div>

          <div className="hidden lg:flex gap-2">
            <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">Active</span>
              <p className="text-lg font-semibold text-foreground">
                {kpis.activeLeads}
              </p>
            </div>
            <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">Handoffs</span>
              <p className="text-lg font-semibold text-foreground">
                {kpis.handoffsToday}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
