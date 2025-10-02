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
          <div className="container-fluid px-3 px-lg-4">
            <div className="row g-3">
              {/* Left Column - Jackpot Carousel */}
              <div className="col-lg-6 col-md-12">
                <JackpotCarousel />
              </div>

              {/* Right Column - Live Matches Widget */}
              <div className="col-lg-6 col-md-12">
                <LiveMatchesWidget />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans - Full Width */}
        <div className="homepage-plans-section">
          <div className="container-fluid px-3 px-lg-4">
            <SubscriptionPlans />
          </div>
        </div>

        {/* Free Predictions Section - Full Width */}
        <div className="homepage-predictions-section">
          <div className="container-fluid px-3 px-lg-4">
            <FreePredictionsSection />
          </div>
        </div>

        {/* SEO Content */}
        <div className="container-fluid px-3 px-lg-4 mt-5">
          <div id="seo-content-priority-wrapper">
            <SeoContent />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
