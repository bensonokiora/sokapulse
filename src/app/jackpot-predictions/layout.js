export const metadata = {
  title: 'Jackpot Predictions - Football Betting Jackpot Tips',
  description: 'Get expert jackpot predictions and betting tips for football matches with high winning potential. Access accurate jackpot analysis for multiple betting platforms.',
  alternates: {
    canonical: 'https://sokapulse.com/jackpot-predictions'
  },
  openGraph: {
    title: 'Jackpot Predictions - SokaPulse',
    description: 'Expert jackpot predictions and betting tips for football matches. Get accurate jackpot analysis for major betting platforms.',
    url: 'https://sokapulse.com/jackpot-predictions',
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
    title: 'Jackpot Predictions - SokaPulse',
    description: 'Expert jackpot predictions and betting tips for football matches. Get accurate jackpot analysis for major betting platforms.',
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
    'jackpot predictions',
    'football jackpot tips',
    'betting jackpot analysis',
    'soccer jackpot predictions',
    'winning jackpot tips',
    'jackpot betting advice',
    'expert jackpot picks'
  ].join(', ')
};

export default function JackpotPredictionsLayout({ children }) {
  return <>{children}</>;
}