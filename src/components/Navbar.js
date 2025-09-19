'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import SearchBar from '@/utils/SearchBar';
import ThemeSwitch from './ThemeSwitch';
import { useSidebar } from '@/context/SidebarContext';
import { ThemeContext } from '@/context/ThemeContext';

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize sidebar state from localStorage
    const initialToggleState = localStorage.getItem('sb|sidebar-toggle') === 'true';
    if (initialToggleState) {
      document.body.classList.add('sb-sidenav-toggled');
    }

    // Initialize Bootstrap collapse
    if (typeof window !== 'undefined') {
      const bootstrap = require('bootstrap');
      const searchCollapse = document.getElementById('searchBar');
      if (searchCollapse) {
        new bootstrap.Collapse(searchCollapse, {
          toggle: false
        });
      }
    }
  }, []);

  const handleSidebarToggle = (e) => {
    e.preventDefault();
    toggleSidebar();
  };

  const handleLogoClick = () => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg border-bottom">
      <div className="container position-relative d-flex align-items-center">
        <Link href="/" className="navbar-brand d-none d-xl-block d-lg-block" onClick={handleLogoClick}>
          <img 
            src={theme === 'dark' ? "/sokapulse-dark.webp" : "/sokapulse.webp"} 
            height="50" 
            width="220" 
            alt="logo" 
          />
        </Link>
        
        <button 
          className="btn d-lg-none" 
          onClick={handleSidebarToggle}
          id="sidebarToggle"
          aria-label="menu"
          type="button"
        >
          <i className="bi bi-list"></i>
        </button>

        <Link href="/" className="navbar-brand d-lg-none position-absolute start-50 translate-middle-x" onClick={handleLogoClick}>
          <img 
            src={theme === 'dark' ? "/sokapulse-dark.webp" : "/sokapulse.webp"} 
            height="50" 
            width="220" 
            alt="logo" 
          />
        </Link>

        <div className="ms-auto">
          <button 
            className="btn mobile-search-btn d-lg-none" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#searchBar" 
            aria-controls="searchBar" 
            aria-expanded="false" 
            aria-label="Toggle search"
            onClick={() => isSidebarOpen && toggleSidebar()}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>

        <SearchBar />
        <ThemeSwitch />
        
      </div>
    </nav>
  );
}
