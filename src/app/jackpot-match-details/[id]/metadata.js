export const metadata = {
  title: 'Match Details | SokaPulse',
  description: 'View detailed match analysis, head-to-head statistics, and predictions for upcoming football matches.',
  openGraph: {
    title: 'Match Details | SokaPulse',
    description: 'View detailed match analysis, head-to-head statistics, and predictions for upcoming football matches.',
    type: 'website',
    siteName: 'SokaPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Match Details | SokaPulse',
    description: 'View detailed match analysis, head-to-head statistics, and predictions for upcoming football matches.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Helper function to format date for display
const formatDisplayDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// This function is called during server-side rendering
export default function generateMetadata({ params, searchParams }) {
  // Extract match ID and team names from params
  const { id } = params;
  const homeTeamId = searchParams.get('homeTeamId');
  const awayTeamId = searchParams.get('awayTeamId');
  const matchDate = searchParams.get('date');
  const homeTeam = decodeURIComponent(params.slug?.split('-vs-')[0]?.replace(/-/g, ' ') || '');
  const awayTeam = decodeURIComponent(params.slug?.split('-vs-')[1]?.replace(/-/g, ' ') || '');
  
  // Create dynamic title and description
  const title = homeTeam && awayTeam 
    ? `${homeTeam} vs ${awayTeam} - Match Prediction & Analysis | SokaPulse`
    : 'Match Details | SokaPulse';
    
  const description = homeTeam && awayTeam && matchDate
    ? `View detailed match analysis, head-to-head statistics, and predictions for ${homeTeam} vs ${awayTeam} on ${formatDisplayDate(matchDate)}. Get expert football predictions and betting tips.`
    : 'View detailed match analysis, head-to-head statistics, and predictions for upcoming football matches.';

  // Create structured data for search engines
  const structuredData = homeTeam && awayTeam && matchDate ? {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    'name': `${homeTeam} vs ${awayTeam}`,
    'startDate': matchDate,
    'sport': 'Football',
    'homeTeam': {
      '@type': 'SportsTeam',
      'name': homeTeam
    },
    'awayTeam': {
      '@type': 'SportsTeam',
      'name': awayTeam
    },
    'description': description,
    'organizer': {
      '@type': 'Organization',
      'name': 'SokaPulse',
      'url': 'https://sokapulse.com'
    }
  } : null;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'SokaPulse',
      url: `https://sokapulse.com/jackpot-match-details/${id}/${homeTeam?.toLowerCase().replace(/\s+/g, '-')}-vs-${awayTeam?.toLowerCase().replace(/\s+/g, '-')}`,
      images: [
        {
          url: 'https://sokapulse.com/og-image.jpg', // Add your actual OG image URL
          width: 1200,
          height: 630,
          alt: `${homeTeam} vs ${awayTeam} match prediction`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://sokapulse.com/twitter-card.jpg'] // Add your actual Twitter card image URL
    },
    alternates: {
      canonical: `https://sokapulse.com/jackpot-match-details/${id}/${homeTeam?.toLowerCase().replace(/\s+/g, '-')}-vs-${awayTeam?.toLowerCase().replace(/\s+/g, '-')}`
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    },
    keywords: [
      'football predictions',
      'match analysis',
      'betting tips',
      homeTeam,
      awayTeam,
      'head to head stats',
      'football statistics',
      'soccer predictions'
    ].filter(Boolean).join(', '),
    jsonLd: structuredData
  };
} 