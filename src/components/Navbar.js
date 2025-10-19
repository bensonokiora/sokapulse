'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import SearchBar from '@/utils/SearchBar';
import ThemeSwitch from './ThemeSwitch';
import { useSidebar } from '@/context/SidebarContext';
import { ThemeContext } from '@/context/ThemeContext';

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJackpotDropdownOpen, setIsJackpotDropdownOpen] = useState(false);
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

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  const handleLogoClick = () => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Toggle body scroll
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const toggleJackpotDropdown = () => {
    setIsJackpotDropdownOpen(!isJackpotDropdownOpen);
  };

  const jackpotLinks = [
    { name: 'Sportpesa Mega JP', url: '/jackpot-predictions/sportpesa-mega-jackpot' },
    { name: 'Sportpesa Midweek JP', url: '/jackpot-predictions/sportpesa-midweek-jackpot' },
    { name: 'Betika Midweek JP', url: '/jackpot-predictions/betika-midweek-jackpot' },
    { name: 'Odibets Laki Tatu JP', url: '/jackpot-predictions/odibets-laki-tatu-jackpot' },
    { name: 'Mozzart Daily JP', url: '/jackpot-predictions/mozzart-daily-jackpot' },
    { name: 'Mozzart Grand JP', url: '/jackpot-predictions/mozzart-grand-jackpot' },
    { name: 'SportyBet JP', url: '/jackpot-predictions/sportybet-jackpot' },
    { name: 'Betpawa JP', url: '/jackpot-predictions/betpawa-jackpot' }
  ];

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Mobile Top Bar - Login/Register */}
      <div className="mobile-top-bar d-lg-none">
        <div className="container">
          <div className="mobile-auth-top">
            <Link href="/login">Login</Link>
            <span>|</span>
            <Link href="/register">Register</Link>
          </div>
        </div>
      </div>

      {/* Top Bar - Desktop Only */}
      <div className="top-bar d-none d-lg-block">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="social-links">
              <a href="https://www.facebook.com/sokapulse.fb" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com/sokapulse" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://www.instagram.com/_sokapulse" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://whatsapp.com/channel/0029VaKdIWZ6WaKssgU4gc1y" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
            <div className="contact-info">
              <span>+254759054876 | info@betwinner360.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar">
        <div className="container">
          <div className="navbar-content">
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-toggle d-lg-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              type="button"
            >
              <i className="bi bi-list"></i>
            </button>

            {/* Logo */}
            <Link href="/" className="navbar-brand" onClick={handleLogoClick}>
              <img
                src={theme === 'dark' ? "/sokapulse-dark.webp" : "/sokapulse.webp"}
                height="50"
                width="220"
                alt="SokaPulse"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-menu d-none d-lg-flex">
              <Link href="/" className="nav-item">
                Free Tips
              </Link>
              <Link href="/premium-soccer-betting-tips" className="nav-item">
                VIP
              </Link>
              <Link href="/vvip-soccer-betting-tips" className="nav-item">
                VVIP
              </Link>
              <Link href="/jackpot-predictions/sportpesa-mega-jackpot" className="nav-item">
                Mega Jackpot
              </Link>
              <Link href="/jackpot-predictions/sportpesa-midweek-jackpot" className="nav-item">
                Midweek Jackpot
              </Link>

              {/* Jackpots Dropdown */}
              <div className="nav-dropdown">
                <button className="nav-item dropdown-toggle" onClick={toggleJackpotDropdown}>
                  <i className="bi bi-trophy"></i> Jackpots
                </button>
                {isJackpotDropdownOpen && (
                  <div className="dropdown-menu show">
                    <div className="dropdown-menu-header">Featured Jackpots</div>
                    <div className="dropdown-menu-subtitle">Choose from our premium selection of jackpot games</div>
                    <div className="dropdown-items-grid">
                      {jackpotLinks.map((link, index) => (
                        <Link key={index} href={link.url} className="dropdown-item">
                          <i className="bi bi-trophy-fill"></i> {link.name}
                        </Link>
                      ))}
                    </div>
                    <div className="dropdown-footer">
                      <Link href="/jackpot-predictions" className="view-all-jackpots">
                        View All Jackpots
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="auth-buttons d-none d-lg-flex">
              <Link href="/login" className="btn-sign-in">
                SIGN IN
              </Link>
              <Link href="/register" className="btn-sign-up">
                SIGN UP
              </Link>
            </div>

            {/* Mobile VIP TIPS Button */}
            <Link href="/vip-tips" className="d-lg-none btn-vip-mobile">
              VIP TIPS
            </Link>

            <ThemeSwitch />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <img
                src={theme === 'dark' ? "/sokapulse-dark.webp" : "/sokapulse.webp"}
                alt="SokaPulse"
                width="200"
                height="45"
              />
            </div>
            <button className="close-btn" onClick={toggleMobileMenu}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="mobile-menu-body">
            {/* Menu Items */}
            <div className="mobile-menu-items">
              <Link href="/" className="mobile-menu-item" onClick={() => { toggleMobileMenu(); }}>
                Free Tips
              </Link>
              <Link href="/premium-soccer-betting-tips" className="mobile-menu-item" onClick={() => { toggleMobileMenu(); }}>
                VIP
              </Link>
              <Link href="/vvip-soccer-betting-tips" className="mobile-menu-item" onClick={() => { toggleMobileMenu(); }}>
                VVIP
              </Link>

              {/* Jackpot Links */}
              {jackpotLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="mobile-menu-item jackpot-item"
                  onClick={() => { toggleMobileMenu(); }}
                >
                  <i className="bi bi-trophy-fill"></i> {link.name}
                  <i className="bi bi-chevron-right"></i>
                </Link>
              ))}

              <Link href="/jackpot-predictions" className="mobile-menu-item view-all" onClick={() => { toggleMobileMenu(); }}>
                View All Jackpots
              </Link>
            </div>

            {/* Mobile Menu Footer with Auth Buttons */}
            <div className="mobile-menu-footer">
              <Link href="/login" className="btn-sign-in" onClick={() => { toggleMobileMenu(); }}>
                SIGN IN
              </Link>
              <Link href="/register" className="btn-sign-up" onClick={() => { toggleMobileMenu(); }}>
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SearchBar />
    </>
  );
}
