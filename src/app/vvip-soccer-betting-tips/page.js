import { Suspense } from 'react';
import VVIPHeroSection from '@/components/VVIPHeroSection';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import VIPKickoffTime from '@/components/VIPKickoffTime';
import VIPPredictionTips from '@/components/VIPPredictionTips';
import PaymentInstructions from '@/components/PaymentInstructions';
import FreeTipsAndWins from '@/components/Homepage/FreeTipsAndWins';
import '../../styles/custom.css';
import '../../styles/homepage.css';

export const metadata = {
  title: 'VVIP Betting Tips - Elite Soccer Predictions | SokaPulse',
  description: 'Access elite VVIP soccer betting tips with premium multibets 5.0+ odds. Priority support, WhatsApp & SMS delivery, VIP jackpot access. Join the most successful betting community.',
  keywords: 'vvip betting tips, elite soccer predictions, premium football tips, high odds betting, jackpot vip access, soccer tips kenya',
  openGraph: {
    title: 'VVIP Betting Tips - Elite Soccer Predictions | SokaPulse',
    description: 'Access elite VVIP soccer betting tips with premium multibets 5.0+ odds. Priority support, WhatsApp & SMS delivery, VIP jackpot access.',
    type: 'website',
    url: 'https://sokapulse.com/vvip-soccer-betting-tips',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VVIP Betting Tips - Elite Soccer Predictions | SokaPulse',
    description: 'Access elite VVIP soccer betting tips with premium multibets 5.0+ odds. Priority support, WhatsApp & SMS delivery, VIP jackpot access.',
  },
  alternates: {
    canonical: 'https://sokapulse.com/vvip-soccer-betting-tips',
  },
};

export default function VVIPPage() {
  return (
    <div className="homepage-wrapper">
      <Suspense fallback={<div></div>}>
        {/* Hero Section */}
        <VVIPHeroSection />

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

            {/* Right Column - VVIP Prediction Tips + Payment Instructions (40%) */}
            <div className="lg:col-span-5">
              {/* VVIP Prediction Tips */}
              <VIPPredictionTips type="vvip" />

              {/* Payment Instructions */}
              <PaymentInstructions />
            </div>
          </div>
        </div>

        {/* Subscription Plans - VVIP Only */}
        <div className="homepage-plans-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SubscriptionPlans defaultTab="vvip" />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
