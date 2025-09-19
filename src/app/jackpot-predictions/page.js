import { fetchJackpots, fetchJackpotMatches, extractFixtureCount } from '@/utils/api';
import JackpotPredictionsPageClient from '@/components/JackpotPredictionsPageClient';
import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

// Helper function to format date for API calls (YYYY-MM-DD)
const formatDateForApi = (date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return dateObj.toISOString().split('T')[0];
};

// Helper function to get first match date for countdown
const getFirstMatchDateTime = (matches) => {
  if (!matches || matches.length === 0) return null;
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(`${a.matchDateOriginal}T${a.matchTime}`) - new Date(`${b.matchDateOriginal}T${b.matchTime}`)
  );
  const firstMatch = sortedMatches[0];
  return new Date(`${firstMatch.matchDateOriginal}T${firstMatch.matchTime}`);
};

// Generate metadata for SEO
export async function generateMetadata() {
  const title = "Jackpot Predictions | Expert Football Betting Tips & Analysis";
  const description = "Get expert jackpot predictions with accurate football match analysis, betting tips, and winning strategies for all major bookmakers.";
  
  return generateMetadataUtil({
    title,
    description,
    keywords: "jackpot predictions, football betting tips, soccer predictions, betting analysis, jackpot tips, sports betting",
    canonicalUrl: "https://jackpot-predictions.com/jackpot-predictions"
  });
}

export default async function JackpotPredictionsPage({ searchParams }) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  
  // Get date from URL params or default to today
  const urlDate = params?.date;
  const selectedDate = urlDate ? new Date(urlDate) : new Date();
  const formattedDate = formatDateForApi(selectedDate);
  
  // Get bookmaker from URL params
  const urlBookmakerId = params?.bookmaker;
  
  let initialBookmakers = [];
  let initialMatches = [];
  let initialSelectedBookmakerId = null;
  let initialError = null;
  let firstMatchDateISO = null;


  try {
    // Fetch bookmakers
    initialBookmakers = await fetchJackpots(formattedDate);

    if (initialBookmakers && initialBookmakers.length > 0) {
      // Use URL bookmaker or default to first one
      initialSelectedBookmakerId = urlBookmakerId ? 
        parseInt(urlBookmakerId) : 
        initialBookmakers[0].id;
      
      // Ensure the bookmaker exists
      const bookmakerExists = initialBookmakers.find(b => b.id === initialSelectedBookmakerId);
      if (!bookmakerExists) {
        initialSelectedBookmakerId = initialBookmakers[0].id;
      }

      // Extract fixture count from the selected bookmaker's description
      const selectedBookmaker = initialBookmakers.find(b => b.id === initialSelectedBookmakerId);
      const fixturesCount = selectedBookmaker ? extractFixtureCount(selectedBookmaker.description) : 20;

      // Fetch matches for the selected bookmaker
      try {
        initialMatches = await fetchJackpotMatches(formattedDate, initialSelectedBookmakerId, fixturesCount);

        // Get first match date for countdown
        const firstMatchDate = getFirstMatchDateTime(initialMatches);
        if (firstMatchDate) {
          firstMatchDateISO = firstMatchDate.toISOString();
        }

      } catch (matchError) {
        initialError = `Failed to load matches`;
        initialMatches = [];
      }
    } else {
      initialBookmakers = [];
      initialMatches = [];
      initialSelectedBookmakerId = null;
    }
  } catch (error) {
    initialError = `Failed to load jackpot data: ${error.message}`;
    initialBookmakers = [];
    initialMatches = [];
    initialSelectedBookmakerId = null;
  }

  // Generate SEO content
  const seoContent = {
    title: "Expert Jackpot Predictions & Football Betting Tips",
    description: "Get accurate jackpot predictions with detailed match analysis, betting tips, and winning strategies for all major bookmakers.",
    sections: [
      {
        id: 1,
        title: "Professional Jackpot Predictions",
        content: `<p>Our expert team provides comprehensive jackpot predictions with detailed analysis of each match. We cover all major bookmakers and provide accurate betting tips to maximize your winning potential.</p>
                  <p>Each prediction includes match analysis, team statistics, head-to-head records, and expert insights to help you make informed betting decisions.</p>`
      },
      {
        id: 2,
        title: "How Our Predictions Work",
        content: `<p>We analyze multiple factors including team form, player availability, historical data, and statistical models to generate our jackpot predictions.</p>
                  <p>Our predictions are updated daily and cover all major jackpot competitions from leading bookmakers.</p>`
      }
    ],
    features: [
      "Daily updated jackpot predictions",
      "Expert match analysis and tips", 
      "Coverage of all major bookmakers",
      "Historical win-loss tracking",
      "Mobile-optimized interface",
      "Real-time match results"
    ],
    accuracy: "85%+ accuracy rate on completed predictions",
    specialFeature: "Live match tracking with real-time updates",
    faqs: [
      {
        question: "How accurate are your jackpot predictions?",
        answer: "Our predictions maintain an 85%+ accuracy rate based on historical performance across all major jackpot competitions."
      },
      {
        question: "Which bookmakers do you cover?",
        answer: "We provide predictions for all major bookmakers including Sportpesa, Betika, Mozzart, and many others."
      },
      {
        question: "How often are predictions updated?",
        answer: "Predictions are updated daily with fresh analysis and tips. Match results are updated in real-time as games conclude."
      }
    ],
    predictionLinks: [
      { href: "/predictions/sportpesa-mega-jackpot-predictions", text: "Sportpesa Mega Jackpot" },
      { href: "/predictions/betika-midweek-jackpot-predictions", text: "Betika Midweek Jackpot" },
      { href: "/predictions/mozzart-grand-jackpot-predictions", text: "Mozzart Grand Jackpot" }
    ]
  };

  return (
    <JackpotPredictionsPageClient
      initialBookmakers={initialBookmakers}
      initialMatches={initialMatches}
      initialSelectedBookmakerId={initialSelectedBookmakerId}
      initialSelectedDate={formattedDate}
      initialError={initialError}
      firstMatchDateISO={firstMatchDateISO}
      seoContent={seoContent}
    />
  );
}