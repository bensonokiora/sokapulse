import { Suspense } from 'react';
import VIPHeroSection from '@/components/VIPHeroSection';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import VIPKickoffTime from '@/components/VIPKickoffTime';
import VIPPredictionTips from '@/components/VIPPredictionTips';
import PaymentInstructions from '@/components/PaymentInstructions';
import FreeTipsAndWins from '@/components/Homepage/FreeTipsAndWins';
import PremiumBetSlips from '@/components/PremiumBetSlips';
import '../../styles/custom.css';
import '../../styles/homepage.css';

export const metadata = {
  title: 'VIP Betting Tips - Premium Soccer Predictions | SokaPulse',
  description: 'Get access to premium VIP soccer betting tips with 87% win rate. Daily multibets with 3.0+ odds, jackpot access, and SMS delivery. Join 50,000+ successful bettors today.',
  keywords: 'vip betting tips, premium soccer predictions, football betting tips, daily multibets, jackpot predictions, soccer tips kenya',
  openGraph: {
    title: 'VIP Betting Tips - Premium Soccer Predictions | SokaPulse',
    description: 'Get access to premium VIP soccer betting tips with 87% win rate. Daily multibets with 3.0+ odds, jackpot access, and SMS delivery.',
    type: 'website',
    url: 'https://sokapulse.com/premium-soccer-betting-tips',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIP Betting Tips - Premium Soccer Predictions | SokaPulse',
    description: 'Get access to premium VIP soccer betting tips with 87% win rate. Daily multibets with 3.0+ odds, jackpot access, and SMS delivery.',
  },
  alternates: {
    canonical: 'https://sokapulse.com/premium-soccer-betting-tips',
  },
};

export default function VIPPage() {
  return (
    <div className="homepage-wrapper">
      <Suspense fallback={<div></div>}>
        {/* Hero Section */}
        <VIPHeroSection />

        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - VIP Kickoff Time + Latest VIP Wins (60%) */}
            <div className="lg:col-span-7">
              {/* VIP Kickoff Time */}
              <VIPKickoffTime />

              {/* Latest VIP Wins */}
              <div className="mt-6">
                <FreeTipsAndWins showOnlyVIPWins={true} />
              </div>
            </div>

            {/* Right Column - VIP Prediction Tips + Payment Instructions (40%) */}
            <div className="lg:col-span-5">
              {/* VIP Prediction Tips */}
              <VIPPredictionTips type="vip" />

              {/* Payment Instructions */}
              <PaymentInstructions />
            </div>
          </div>
        </div>

        {/* Subscription Plans - VIP Only */}
        <div className="homepage-plans-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SubscriptionPlans defaultTab="vip" />
          </div>
        </div>

        {/* Premium Bet Slips Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PremiumBetSlips isLocked={true} />
        </div>
      </Suspense>
    </div>
  );
}
