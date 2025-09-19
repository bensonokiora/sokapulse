export const metadata = {
  title: 'Weekend Football Predictions - Expert Analysis & Tips',
  description: 'Get accurate weekend football predictions for all matches happening this weekend. Expert analysis covers all major leagues and tournaments.',
  alternates: {
    canonical: 'https://sokapulse.com/weekend-football-predictions'
  },
  openGraph: {
    title: 'Weekend Football Predictions - SokaPulse',
    description: 'Accurate weekend football predictions for all matches. Expert analysis of major leagues and tournaments.',
    url: 'https://sokapulse.com/weekend-football-predictions',
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
    title: 'Weekend Football Predictions - SokaPulse',
    description: 'Accurate weekend football predictions for all matches. Expert analysis of major leagues and tournaments.',
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
    'weekend football predictions',
    'weekend match analysis',
    'weekend betting tips',
    'weekend soccer predictions',
    'weekend fixture analysis',
    'weekend match tips',
    'weekend game predictions'
  ].join(', ')
};

export default function WeekendPredictionsLayout({ children }) {
  return <>{children}</>;
}