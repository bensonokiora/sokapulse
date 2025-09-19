export const metadata = {
  title: 'Search Results - Football Predictions',
  description: 'Find accurate football predictions and betting tips based on your search query. Access expert analysis and statistics for upcoming matches.',
  alternates: {
    canonical: 'https://sokapulse.com/search-results'
  },
  openGraph: {
    title: 'Search Results - Football Predictions | SokaPulse',
    description: 'Find football predictions and betting tips based on your search. Get expert analysis and statistics for matches.',
    url: 'https://sokapulse.com/search-results',
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
    title: 'Search Results - Football Predictions | SokaPulse',
    description: 'Find football predictions and betting tips based on your search. Get expert analysis and statistics for matches.',
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
    'search football predictions',
    'find matches',
    'search betting tips',
    'find teams',
    'search leagues',
    'football search results',
    'prediction search'
  ].join(', ')
};

export default function SearchResultsLayout({ children }) {
  return <>{children}</>;
}