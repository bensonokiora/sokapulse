export const metadata = {
  title: 'Forebet Tips Today Prediction and Jackpot Predictions - SokaPulse',
  description: 'Get the latest Forebet tips, predictions and jackpot predictions for today\'s football matches.',
  alternates: {
    canonical: 'https://sokapulse.com/predictions/forebet'
  },
  openGraph: {
    title: 'Forebet Tips Today Prediction - SokaPulse',
    description: 'Get the latest Forebet tips, predictions and jackpot predictions.',
    url: 'https://sokapulse.com/predictions/forebet',
    siteName: 'SokaPulse',
    images: [
      {
        url: 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        width: 1024,
        height: 768,
      }
    ],
    locale: 'en_US',
    type: 'article',
  },
  other: {
    'article:published_time': '2025-03-20T18:54:21+00:00',
    'article:modified_time': new Date().toISOString(),
  }
};

export default function ForebetLayout({ children }) {
  return <>{children}</>;
} 