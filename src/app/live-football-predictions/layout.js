export const metadata = {
  title: 'Live Football Predictions - Real-Time Match Tips',
  description: 'Get real-time football predictions and live betting tips. Access in-play match analysis, live statistics, and expert predictions for ongoing matches.',
  alternates: {
    canonical: 'https://sokapulse.com/live-football-predictions'
  },
  openGraph: {
    title: 'Live Football Predictions - SokaPulse',
    description: 'Real-time football predictions and live betting tips. Get in-play match analysis and live statistics for ongoing matches.',
    url: 'https://sokapulse.com/live-football-predictions',
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
    title: 'Live Football Predictions - SokaPulse',
    description: 'Real-time football predictions and live betting tips. Get in-play match analysis and live statistics for ongoing matches.',
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
    'live football predictions',
    'real-time match tips',
    'in-play betting analysis',
    'live match statistics',
    'ongoing match predictions',
    'live betting advice',
    'live score predictions'
  ].join(', ')
};

export default function LivePredictionsLayout({ children }) {
  return <>{children}</>;
}