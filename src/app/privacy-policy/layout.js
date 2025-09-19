export const metadata = {
  title: 'Privacy Policy - SokaPulse',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information when you use our football predictions platform.',
  alternates: {
    canonical: 'https://sokapulse.com/privacy-policy'
  },
  openGraph: {
    title: 'Privacy Policy - SokaPulse',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information when using our platform.',
    url: 'https://sokapulse.com/privacy-policy',
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
    title: 'Privacy Policy - SokaPulse',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information when using our platform.',
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
    'privacy policy',
    'data protection',
    'personal information',
    'data collection',
    'information usage',
    'privacy practices',
    'cookies policy'
  ].join(', ')
};

export default function PrivacyPolicyLayout({ children }) {
  return <>{children}</>;
}