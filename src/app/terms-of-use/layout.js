export const metadata = {
  title: 'Terms of Use - SokaPulse',
  description: 'Read SokaPulse\'s terms of use to understand the rules, guidelines, and requirements for using our football predictions platform.',
  alternates: {
    canonical: 'https://sokapulse.com/terms-of-use'
  },
  openGraph: {
    title: 'Terms of Use - SokaPulse',
    description: 'Read our terms of use to understand the rules, guidelines, and requirements for using our football predictions platform.',
    url: 'https://sokapulse.com/terms-of-use',
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
    title: 'Terms of Use - SokaPulse',
    description: 'Read our terms of use to understand the rules, guidelines, and requirements for using our football predictions platform.',
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
    'terms of use',
    'legal terms',
    'usage policy',
    'football predictions terms',
    'service guidelines',
    'user agreement',
    'platform rules'
  ].join(', ')
};

export default function TermsOfUseLayout({ children }) {
  return <>{children}</>;
}