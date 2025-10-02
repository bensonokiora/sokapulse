'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Hide sidebar on homepage
  const isHomepage = pathname === '/';

  if (isHomepage) {
    // Homepage layout - no sidebar wrapper
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
