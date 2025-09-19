export const metadata = {
  title: 'Football Predictions Grouped by Leagues',
  description: 'Browse football predictions organized by leagues and tournaments. Get expert match analysis and betting tips for all major competitions worldwide.',
  alternates: {
    canonical: 'https://sokapulse.com/football-predictions-grouped-by-leagues'
  },
  openGraph: {
    title: 'Football Predictions by League - SokaPulse',
    description: 'Browse football predictions organized by leagues. Get expert match analysis and betting tips for all major competitions.',
    url: 'https://sokapulse.com/football-predictions-grouped-by-leagues',
    siteName: 'SokaPulse',
    images: [
      {
        url: 'https://sokapulse.com/logo.png',
        width: 1200,
        height: 630
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Predictions by League - SokaPulse',
    description: 'Browse football predictions organized by leagues. Get expert match analysis and betting tips for all major competitions.',
    images: ['https://sokapulse.com/twitter-card.jpg']
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1
  },
  keywords: [
    'football predictions by league',
    'league match predictions',
    'competition-based betting tips',
    'tournament predictions',
    'league-specific analysis',
    'league football tips',
    'organized match predictions'
  ].join(', ')
};

export default function FootballPredictionsGroupedByLeaguesLayout({ children }) {
  return <>{children}</>;
}