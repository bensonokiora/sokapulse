export const metadata = {
  title: 'Premium Tips - Best Betting Tips & Advice',
  description: 'Get the most accurate football predictions and top betting tips. Access expert analysis, statistics, and predictions for the highest probability matches.',
  alternates: {
    canonical: 'https://sokapulse.com/premium-tips'
  },
  openGraph: {
    title: 'Premium Tips - SokaPulse',
    description: 'Most accurate football predictions and top betting tips. Get expert analysis for highest probability matches.',
    url: 'https://sokapulse.com/premium-tips',
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
    title: 'Premium Tips - SokaPulse',
    description: 'Most accurate football predictions and top betting tips. Get expert analysis for highest probability matches.',
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
    'Premium Tips',
    'best betting tips',
    'highest probability matches',
    'expert football analysis',
    'premium betting advice',
    'accurate match predictions',
    'reliable betting tips'
  ].join(', ')
};

export default function TopPredictionsLayout({ children }) {
  return <>{children}</>;
}