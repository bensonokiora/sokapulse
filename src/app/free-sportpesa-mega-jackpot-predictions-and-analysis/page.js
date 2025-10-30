import { Suspense } from 'react';
import { fetchMoreAllJp } from '@/utils/api';
import sportpesaMegaJackpotContent from '@/data/seo/pages/sportpesa-mega-jackpot-predictions';
import MegaJackpotHeroSection from '@/components/MegaJackpotHeroSection';
import MegaJackpotMatches from '@/components/MegaJackpotMatches';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import VIPKickoffTime from '@/components/VIPKickoffTime';
import VIPPredictionTips from '@/components/VIPPredictionTips';
import PaymentInstructions from '@/components/PaymentInstructions';
import '../../styles/custom.css';
import '../../styles/homepage.css';

export async function generateMetadata() {
  return {
    title: 'Free Sportpesa Mega Jackpot Predictions & Analysis | SokaPulse',
    description: 'Get free Sportpesa Mega Jackpot predictions with expert analysis. Access free and premium predictions for all 17 matches. Win big with our accurate jackpot tips.',
    keywords: 'sportpesa mega jackpot predictions, free jackpot tips, mega jackpot analysis, sportpesa predictions, jackpot betting tips kenya',
    openGraph: {
      title: 'Free Sportpesa Mega Jackpot Predictions & Analysis | SokaPulse',
      description: 'Get free Sportpesa Mega Jackpot predictions with expert analysis. Access free and premium predictions for all 17 matches.',
      type: 'website',
      url: 'https://sokapulse.com/free-sportpesa-mega-jackpot-predictions-and-analysis',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Sportpesa Mega Jackpot Predictions & Analysis | SokaPulse',
      description: 'Get free Sportpesa Mega Jackpot predictions with expert analysis. Access free and premium predictions for all 17 matches.',
    },
    alternates: {
      canonical: 'https://sokapulse.com/free-sportpesa-mega-jackpot-predictions-and-analysis',
    },
  };
}

export default async function FreeSportpesaMegaJackpotPage() {
  let initialPredictions = [];
  let error = null;

  // Parameters for Sportpesa Mega Jackpot (bookmakerId=1, type=10, total=17)
  const bookmakerId = 1;
  const typeId = 10;
  const totalMatches = 17;

  try {
    console.log(`Fetching Sportpesa Mega Jackpot (ID: ${bookmakerId}) predictions server-side...`);
    const response = await fetchMoreAllJp(bookmakerId, typeId, totalMatches);

    if (!response.error && response.body && Array.isArray(response.body)) {
      initialPredictions = response.body;
    } else {
      console.error('API error fetching mega jackpot predictions (server-side):', response.message);
      error = response.message || 'Failed to load mega jackpot predictions';
    }
  } catch (err) {
    console.error('Error fetching mega jackpot predictions (server-side):', err);
    error = err instanceof Error ? err.message : 'Failed to fetch mega jackpot predictions due to an unknown error';
    initialPredictions = [];
  }

  return (
    <div className="homepage-wrapper">
      <Suspense fallback={<div></div>}>
        {/* Hero Section */}
        <MegaJackpotHeroSection />

        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Mega Jackpot Predictions (60%) */}
            <div className="lg:col-span-7">
              {/* Mega Jackpot Matches */}
              {error ? (
                <div className="jp-error-message text-red-500 text-center p-8">
                  <p>Error: {error}</p>
                </div>
              ) : (
                <MegaJackpotMatches predictions={initialPredictions} />
              )}
            </div>

            {/* Right Column - VIP Prediction Tips + Payment Instructions (40%) */}
            <div className="lg:col-span-5">
              <VIPPredictionTips type="mega-jackpot" />
              <PaymentInstructions />
            </div>
          </div>
        </div>

        {/* Flexible Pricing Plans */}
        <div className="homepage-plans-section" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SubscriptionPlans />
          </div>
        </div>

        {/* SEO Content */}
        {sportpesaMegaJackpotContent.content && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="seo-content">
              <div dangerouslySetInnerHTML={{ __html: sportpesaMegaJackpotContent.content }} />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}
