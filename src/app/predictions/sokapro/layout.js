export const metadata = {
  title: 'sokapro Football Predictions and Tips - sokapulse',
  description: 'Get the latest sokapro football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
  keywords: 'sokapro predictions, football tips, betting tips, football predictions, sokapro football',
  openGraph: {
    title: 'sokapro Football Predictions and Tips - sokapulse',
    type: 'website',
    url: '/predictions/sokapro',
    images: [
      {
        url: 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        width: 1024,
        height: 768,
        type: 'image/jpeg',
      }
    ],
    description: 'Get the latest sokapro football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
    siteName: 'SokaPulse'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sokapro Football Predictions and Tips - sokapulse',
    description: 'Get the latest sokapro football predictions and tips for today\'s matches.',
    site: '@sokapulse'
  },
  alternates: {
    canonical: 'https://sokapulse.com/predictions/sokapro'
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

export default function SokaproLayout({ children }) {
  return <>{children}</>;
}