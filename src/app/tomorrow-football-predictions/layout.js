export const metadata = {
  title: 'Tomorrow\'s Football Predictions - Early Match Tips',
  description: 'Get early access to tomorrow\'s football predictions and betting tips. Access detailed analysis and expert predictions for upcoming matches with highest probability of winning.',
  alternates: {
    canonical: 'https://sokapulse.com/tomorrow-football-predictions'
  },
  openGraph: {
    title: 'Tomorrow\'s Football Predictions - SokaPulse',
    description: 'Early access to tomorrow\'s football predictions and betting tips. Get detailed analysis and expert predictions for upcoming matches.',
    url: 'https://sokapulse.com/tomorrow-football-predictions',
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
    title: 'Tomorrow\'s Football Predictions - SokaPulse',
    description: 'Early access to tomorrow\'s football predictions and betting tips. Get detailed analysis and expert predictions for upcoming matches.',
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
    'tomorrow football predictions',
    'early match tips',
    'advance betting analysis',
    'upcoming match predictions',
    'tomorrow soccer predictions',
    'advance betting tips',
    'early game predictions'
  ].join(', ')
};

export default function TomorrowPredictionsLayout({ children }) {
  return <>{children}</>;
}