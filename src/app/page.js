import { Suspense } from 'react';
import '../styles/custom.css';
import '../styles/homepage.css';
import SeoContent from '@/components/SeoContent';
import HeroSection from '@/components/HeroSection';
import JackpotCarousel from '@/components/JackpotCarousel';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import LiveMatchesWidget from '@/components/LiveMatchesWidget';
import FreePredictionsSection from '@/components/FreePredictionsSection';

export default function Home() {
  return (
    <div className="homepage-wrapper">
      <Suspense fallback={<div></div>}>
        {/* Hero Section - Full Width */}
        <HeroSection />

        {/* 2-Column Section: Jackpot + Live Matches */}
        <div className="homepage-top-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <JackpotCarousel />
              <LiveMatchesWidget />
            </div>
          </div>
        </div>

        {/* Subscription Plans - Full Width */}
        <div className="homepage-plans-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SubscriptionPlans />
          </div>
        </div>

        {/* Free Predictions Section - Full Width */}
        <div className="homepage-predictions-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FreePredictionsSection />
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div id="seo-content-priority-wrapper">
            <SeoContent />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
