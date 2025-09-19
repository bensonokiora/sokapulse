export const metadata = {
  title: 'Upcoming Football Predictions - Future Match Tips',
  description: 'Get early predictions and betting tips for upcoming football matches. Access pre-match analysis, team statistics, and expert predictions for future fixtures.',
  alternates: {
    canonical: 'https://sokapulse.com/upcoming-football-predictions'
  },
  openGraph: {
    title: 'Upcoming Football Predictions - SokaPulse',
    description: 'Early predictions and betting tips for upcoming football matches. Get pre-match analysis and statistics for future fixtures.',
    url: 'https://sokapulse.com/upcoming-football-predictions',
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
    title: 'Upcoming Football Predictions - SokaPulse',
    description: 'Early predictions and betting tips for upcoming football matches. Get pre-match analysis and statistics for future fixtures.',
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
    'upcoming football predictions',
    'future match tips',
    'advance predictions',
    'pre-match analysis',
    'upcoming fixtures',
    'early betting tips',
    'future game predictions'
  ].join(', ')
};

export default function UpcomingPredictionsLayout({ children }) {
  return <>{children}</>;
}