export const metadata = {
  title: 'Football Predictions - Expert Betting Tips and Analysis',
  description: 'Get comprehensive football predictions and betting tips for all major leagues and tournaments. Access expert analysis, match statistics, and accurate predictions.',
  alternates: {
    canonical: 'https://sokapulse.com/football-predictions'
  },
  openGraph: {
    title: 'Football Predictions - Expert Tips | SokaPulse',
    description: 'Comprehensive football predictions and betting tips for all major leagues and tournaments.',
    url: 'https://sokapulse.com/football-predictions',
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
    title: 'Football Predictions - Expert Tips | SokaPulse',
    description: 'Comprehensive football predictions and betting tips for all major leagues and tournaments.',
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
    'football predictions',
    'betting tips',
    'match analysis',
    'expert predictions',
    'soccer predictions',
    'prediction accuracy',
    'league predictions'
  ].join(', ')
};

export default function FootballPredictionsLayout({ children }) {
  return <>{children}</>;
}