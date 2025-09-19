export const metadata = {
  title: 'Pepeatips Today and Pepea Jackpot Predictions - SokaPulse',
  description: 'Access expert Pepea football tips and jackpot predictions with high accuracy. Comprehensive analysis across all major leagues and tournaments.',
  alternates: {
    canonical: 'https://sokapulse.com/predictions/pepeatips'
  },
  openGraph: {
    title: 'Pepeatips Today and Pepea Jackpot Predictions - SokaPulse',
    description: 'Access expert Pepea football tips and jackpot predictions with high accuracy. Comprehensive analysis across all major leagues and tournaments.',
    url: 'https://sokapulse.com/predictions/pepeatips',
    siteName: 'SokaPulse',
    images: [
      {
        url: 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        width: 1024,
        height: 768,
        alt: 'Pepeatips Today and Pepea Jackpot Predictions'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepeatips Today and Pepea Jackpot Predictions - SokaPulse',
    description: 'Access expert Pepea football tips and jackpot predictions with high accuracy. Comprehensive analysis across all major leagues and tournaments.',
    images: ['https://sokapulse.com/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
  metadataBase: new URL('https://sokapulse.com'),
  authors: [{ name: 'SokaPulse' }],
  creator: 'SokaPulse',
  publisher: 'SokaPulse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'sports',
  classification: 'sports',
  referrer: 'origin-when-cross-origin',
  keywords: ['Pepeatips', 'Pepea predictions', 'football predictions', 'betting tips', 'jackpot betting', 'SokaPulse'],
  authors: [{ name: 'SokaPulse' }],
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/assets/images/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pepeatips - SokaPulse',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Pepeatips - SokaPulse',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'application-name': 'Pepeatips - SokaPulse',
  },
  datePublished: '2025-03-20T18:54:21+00:00',
  dateModified: new Date().toISOString(),
};

export default function PepeatipsLayout({ children }) {
  return <>{children}</>;
} 