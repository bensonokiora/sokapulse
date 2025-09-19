import { getDynamicPageMetadata } from '../utils/caching';

// Add dynamic page caching configuration for the homepage
export const metadata = getDynamicPageMetadata({
  title: 'SokaPulse | Football Predictions & Live Scores',
  description: 'Get the latest football predictions with live scores, odds, and analysis. Mathematically analyzed predictions for better betting decisions.',
  keywords: 'football predictions, betting tips, live scores, soccer predictions, sports betting, football analysis',
});

// Add route segment config for dynamic revalidation
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate hourly for fresh content

export default function LayoutHome({ children }) {
  return children;
}