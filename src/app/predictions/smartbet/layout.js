export const metadata = {
  title: 'smartbet Football Predictions and Tips - sokapulse',
  description: 'Get the latest smartbet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
  keywords: 'smartbet predictions, football tips, betting tips, football predictions, smartbet football',
  openGraph: {
    title: 'smartbet Football Predictions and Tips - sokapulse',
    type: 'website',
    url: '/predictions/smartbet',
    images: [
      {
        url: 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        width: 1024,
        height: 768,
        type: 'image/jpeg',
      }
    ],
    description: 'Get the latest smartbet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
    siteName: 'SokaPulse'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'smartbet Football Predictions and Tips - sokapulse',
    description: 'Get the latest smartbet football predictions and tips for today\'s matches.',
    site: '@sokapulse'
  },
  alternates: {
    canonical: 'https://sokapulse.com/predictions/smartbet'
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

export default function SmartbetLayout({ children }) {
  return <>{children}</>;
}