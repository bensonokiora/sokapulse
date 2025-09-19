export const generateMetadata = ({ params }) => {
  const match = params?.match?.replace(/-vs-/g, ' vs ') || '';
  
  return {
    title: `${match} Prediction - Match Analysis & Tips`,
    description: `Get expert predictions and betting tips for ${match}. Access detailed match analysis, head-to-head stats, and team performance data.`,
    alternates: {
      canonical: `https://sokapulse.com/football-predictions/${params?.match}`
    },
    openGraph: {
      title: `${match} Prediction - SokaPulse`,
      description: `Expert predictions and betting tips for ${match}. Get detailed match analysis and statistics.`,
      url: `https://sokapulse.com/football-predictions/${params?.match}`,
      siteName: 'SokaPulse',
      images: [
        {
          url: 'https://sokapulse.com/logo.png',
          width: 1200,
          height: 630
        }
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${match} Prediction - SokaPulse`,
      description: `Expert predictions and betting tips for ${match}. Get detailed match analysis and statistics.`,
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
      `${match} prediction`,
      'match analysis',
      'betting tips',
      'head to head stats',
      'team performance',
      'expert predictions',
      'match preview'
    ].join(', ')
  };
};

export default function MatchLayout({ children }) {
  return <>{children}</>;
}