import { getStaticPageMetadata } from '../../utils/caching';

// Add static page caching configuration for the about-us page
export const metadata = getStaticPageMetadata({
  title: 'About SokaPulse | Our Football Prediction Service',
  description: 'Learn about SokaPulse, our mission, and how we provide accurate football predictions using advanced statistical analysis and expert insights.',
  keywords: 'about sokapulse, football prediction service, sokapulse mission, football analysis, sokapulse team',
});

// Add route segment config for static generation
export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate daily

export default function AboutUsLayout({ children }) {
  return <>{children}</>;
}