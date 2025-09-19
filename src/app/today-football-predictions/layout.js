export const metadata = {
  title: 'Today\'s Football Predictions - Latest Betting Tips',
  description: 'Get today\'s football predictions and betting tips. Access live match analysis, latest statistics, and expert predictions for all of today\'s matches.',
  alternates: {
    canonical: 'https://sokapulse.com/today-football-predictions'
  },
  openGraph: {
    title: 'Today\'s Football Predictions - SokaPulse',
    description: 'Latest football predictions and betting tips for today\'s matches. Get live match analysis and statistics for all games today.',
    url: 'https://sokapulse.com/today-football-predictions',
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
    title: 'Today\'s Football Predictions - SokaPulse',
    description: 'Latest football predictions and betting tips for today\'s matches. Get live match analysis and statistics for all games today.',
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
    'today football predictions',
    'today betting tips',
    'today match analysis',
    'today soccer predictions',
    'today match statistics',
    'today betting advice',
    'today game predictions'
  ].join(', ')
};

export default function TodayPredictionsLayout({ children }) {
  return <>{children}</>;
}