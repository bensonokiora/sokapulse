export const metadata = {
  title: 'Top Football Trends - Latest Match Statistics',
  description: 'Discover the latest football trends and statistical insights. Access comprehensive analysis of team performance, scoring patterns, and betting trends.',
  alternates: {
    canonical: 'https://sokapulse.com/top-trends'
  },
  openGraph: {
    title: 'Top Football Trends - SokaPulse',
    description: 'Latest football trends and statistical insights. Get comprehensive analysis of team performance and betting patterns.',
    url: 'https://sokapulse.com/top-trends',
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
    title: 'Top Football Trends - SokaPulse',
    description: 'Latest football trends and statistical insights. Get comprehensive analysis of team performance and betting patterns.',
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
    'football trends',
    'match statistics',
    'team performance analysis',
    'betting trends',
    'soccer statistics',
    'performance patterns',
    'statistical insights'
  ].join(', ')
};

export default function TopTrendsLayout({ children }) {
  return <>{children}</>;
}