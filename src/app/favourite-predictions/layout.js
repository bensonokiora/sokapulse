export const metadata = {
  title: 'Favourite Predictions - Your Personalised Football Tips',
  description: 'Access your favourite football predictions and betting tips. Customise your predictions and get insights from past matches to improve future betting.',
  alternates: {
    canonical: 'https://sokapulse.com/favourite-predictions'
  },
  openGraph: {
    title: 'Favourite Predictions - Your Personalised Football Tips | SokaPulse',
    description: 'Access your favourite football predictions and betting tips. Customise your experience and get insights to improve future betting.',
    url: 'https://sokapulse.com/favourite-predictions',
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
    title: 'Favourite Predictions - Your Personalised Football Tips | SokaPulse',
    description: 'Access your favourite football predictions and betting tips. Customise your experience and get insights to improve future betting.',
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
    'favourite predictions',
    'personalised football tips',
    'custom betting tips',
    'saved predictions',
    'user preferences',
    'personal betting picks',
    'tailored match tips'
  ].join(', ')
};

export default function FavouritePredictionsLayout({ children }) {
  return <>{children}</>;
}