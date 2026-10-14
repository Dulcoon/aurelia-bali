'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Home,
  CalendarDays,
  Tag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';

interface AdminShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function AdminShell({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    settings,
    isAdminAuthenticated,
    loginAdminDemo,
    logoutAdminDemo,
    resetDemoData,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { href: '/admin/villas', label: 'Villas', icon: Home },
    { href: '/admin/calendar', label: 'Availability Calendar', icon: CalendarDays },
    { href: '/admin/pricing', label: 'Pricing & Promos', icon: Tag },
    { href: '/admin/guests', label: 'Guest Directory', icon: Users },
    { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutAdminDemo();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-charcoal flex flex-col lg:flex-row">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-ivory flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-ivory/10 flex items-center justify-between">
            <div>
              <Link href="/admin" className="font-serif text-xl tracking-[0.2em] uppercase text-ivory block">
                {settings.brandName}
              </Link>
              <span className="text-[10px] uppercase tracking-[0.22em] text-bronze">
                Hospitality Admin Suite
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-ivory/70 hover:text-ivory"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Demo Session Badge */}
          <div className="px-4 py-3 bg-deepGreen/60 border-b border-ivory/10 flex items-center justify-between text-[11px]">
            <span className="text-sand flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {isAdminAuthenticated ? 'Demo Session Active' : 'Preview Mode'}
            </span>
            {!isAdminAuthenticated && (
              <button
                type="button"
                onClick={loginAdminDemo}
                className="text-bronze underline hover:text-ivory"
              >
                Activate
              </button>
            )}
          </div>

          {/* Nav Links */}
          <nav aria-label="Admin Sidebar Navigation" className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs tracking-wide transition-colors ${
                    active
                      ? 'bg-deepGreen text-ivory font-medium border-l-2 border-bronze'
                      : 'text-sand/75 hover:bg-ivory/5 hover:text-ivory'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-bronze" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-ivory/10 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 bg-ivory/5 hover:bg-ivory/10 text-sand transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-bronze" />
          </Link>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-ivory/5 hover:bg-amber-900/30 text-sand/85 transition-colors text-left"
          >
            <span>Reset Demo Data</span>
            <RotateCcw className="w-3.5 h-3.5 text-bronze" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-900/30 text-sand/70 hover:text-ivory transition-colors text-left"
          >
            <span>Exit Demo Admin</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="bg-ivory border-b border-stone px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 border border-stone bg-white text-charcoal"
              aria-label="Open admin navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-charcoal/60">
                <Link href="/admin" className="hover:text-charcoal">
                  Admin
                </Link>
                {breadcrumbs.map((bc, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3" />
                    {bc.href ? (
                      <Link href={bc.href} className="hover:text-charcoal">
                        {bc.label}
                      </Link>
                    ) : (
                      <span className="text-charcoal font-medium">{bc.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
              <h1 className="font-serif text-2xl sm:text-3xl text-charcoal leading-tight">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-charcoal/65 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-sand/50 border border-stone text-[11px] text-charcoal/80">
              <ShieldAlert className="w-3.5 h-3.5 text-bronze shrink-0" />
              <span>Simulated Back-Office • Changes Persist in Browser</span>
            </div>
            {actions}
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1440px] w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Reset Demo Confirmation Modal */}
      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory border border-stone max-w-md w-full p-6 shadow-editorial space-y-4">
            <h3 className="font-serif text-2xl text-charcoal">Restore Original Seed Data?</h3>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              This will clear all custom bookings, villa edits, blocked calendar dates, and pricing changes stored in your browser and restore the initial deterministic AURELIA BALI seed inventory.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider border border-stone text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 text-xs uppercase tracking-wider bg-deepGreen text-ivory hover:bg-forestGreen"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
