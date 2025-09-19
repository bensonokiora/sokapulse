export const metadata = {
  title: 'Yesterday\'s Football Predictions - Previous Match Results',
  description: 'Review yesterday\'s football predictions and match results. Analyze our prediction accuracy and get insights from past matches to improve future betting.',
  alternates: {
    canonical: 'https://sokapulse.com/yesterday-football-predictions'
  },
  openGraph: {
    title: 'Yesterday\'s Football Predictions - SokaPulse',
    description: 'Review our football predictions and match results from yesterday. Analyze prediction accuracy and get insights from past matches.',
    url: 'https://sokapulse.com/yesterday-football-predictions',
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
    title: 'Yesterday\'s Football Predictions - SokaPulse',
    description: 'Review our football predictions and match results from yesterday. Analyze prediction accuracy and get insights from past matches.',
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
    'yesterday football predictions',
    'previous match results',
    'prediction accuracy',
    'past match analysis',
    'yesterday soccer results',
    'historical betting tips',
    'match result verification'
  ].join(', ')
};

export default function YesterdayPredictionsLayout({ children }) {
  return <>{children}</>;
}