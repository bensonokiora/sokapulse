export const metadata = {
  title: 'Oddspedia Tips Today Prediction and Jackpot Predictions - SokaPulse',
  description: 'Get the latest Oddspedia tips, predictions and jackpot predictions for today\'s football matches.',
  alternates: {
    canonical: 'https://sokapulse.com/predictions/oddspedia'
  },
  openGraph: {
    title: 'Oddspedia Tips Today Prediction - SokaPulse',
    description: 'Get the latest Oddspedia tips, predictions and jackpot predictions.',
    url: 'https://sokapulse.com/predictions/oddspedia',
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

export default function OddspediaLayout({ children }) {
  return <>{children}</>;
} 