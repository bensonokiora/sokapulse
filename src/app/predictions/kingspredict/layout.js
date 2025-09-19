export const metadata = {
  title: 'kingspredict Football Predictions and Tips - sokapulse',
  description: 'Get the latest kingspredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
  keywords: 'kingspredict predictions, football tips, betting tips, football predictions, kingspredict football',
  openGraph: {
    title: 'kingspredict Football Predictions and Tips - sokapulse',
    type: 'website',
    url: '/predictions/kingspredict',
    images: [
      {
        url: 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        width: 1024,
        height: 768,
        type: 'image/jpeg',
      }
    ],
    description: 'Get the latest kingspredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
    siteName: 'SokaPulse'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kingspredict Football Predictions and Tips - sokapulse',
    description: 'Get the latest kingspredict football predictions and tips for today\'s matches.',
    site: '@sokapulse'
  },
  alternates: {
    canonical: 'https://sokapulse.com/predictions/kingspredict'
  },
  other: {
    'article:publisher': [
      'https://www.facebook.com/sokapulse.fb',
      'https://whatsapp.com/channel/0029VaKdIWZ6WaKssgU4gc1y',
      'https://t.me/jackpots_predictions',
      'https://www.instagram.com/_sokapulse'
    ],
    'article:published_time': '2025-03-20T18:54:21+00:00',
    'article:modified_time': new Date().toISOString(),
    'geo.placename': 'Nairobi',
    'geo.region': 'Kenya',
  }
};

export default function KingsPredictLayout({ children }) {
  return <>{children}</>;
}