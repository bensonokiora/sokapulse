'use client';

import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    
    if (newState) {
      document.body.classList.add('sb-sidenav-toggled');
    } else {
      document.body.classList.remove('sb-sidenav-toggled');
    }
    
    localStorage.setItem('sb|sidebar-toggle', newState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    document.body.classList.remove('sb-sidenav-toggled');
    localStorage.setItem('sb|sidebar-toggle', false);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
} 