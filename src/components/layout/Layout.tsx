import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  restaurantName?: string;
  breadcrumbs?: ReactNode;
  fullWidth?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export default function Layout({
  children,
  title,
  subtitle,
  actions,
  restaurantName,
  breadcrumbs,
  fullWidth = false,
  padding = 'md',
  sidebarCollapsed = false,
  onSidebarToggle,
}: LayoutProps) {
  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';
  
  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
  };

  const containerClasses = fullWidth
    ? 'w-full px-4 sm:px-6 lg:px-8'
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarWidth} flex-shrink-0 transition-all duration-300`}>
          <Sidebar
            restaurantName={restaurantName}
            collapsed={sidebarCollapsed}
            onToggle={onSidebarToggle}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            title={title}
            subtitle={subtitle}
            actions={actions}
            onSidebarToggle={onSidebarToggle}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <div className="bg-white border-b border-secondary-200 px-4 sm:px-6 lg:px-8 py-3">
              <nav className="flex" aria-label="Breadcrumb">
                {breadcrumbs}
              </nav>
            </div>
          )}
          
          {/* Page content */}
          <main className="flex-1 overflow-auto bg-secondary-50">
            <div className={paddingClasses[padding]}>
              <div className={containerClasses}>
                {title && !breadcrumbs && (
                  <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-secondary-900">{title}</h1>
                    {subtitle && (
                      <p className="mt-1 text-sm text-secondary-600">{subtitle}</p>
                    )}
                  </div>
                )}
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}