'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Hide sidebar on homepage, VIP, VVIP, and Mega Jackpot pages
  const noSidebarPages = [
    '/',
    '/premium-soccer-betting-tips',
    '/vvip-soccer-betting-tips',
    '/free-sportpesa-mega-jackpot-predictions-and-analysis'
  ];

  const shouldHideSidebar = noSidebarPages.includes(pathname);

  if (shouldHideSidebar) {
    // Pages without sidebar - full width layout
    return <>{children}</>;
  }

  // Other pages - with sidebar
  return (
    <div className="container container-mob">
      <div id="wrapper" className="d-flex">
        <Sidebar />
        <div id="page-content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
