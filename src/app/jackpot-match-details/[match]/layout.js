export const generateMetadata = ({ params }) => {
  const match = params?.match || '';

  return {
    title: `${match} - Jackpot Match Analysis & Predictions`,
    description: `Detailed analysis and betting tips for ${match}. Get comprehensive match statistics, head-to-head data, and expert predictions for this jackpot fixture.`,
    alternates: {
      canonical: `https://sokapulse.com/jackpot-match-details/${match}`
    },
    openGraph: {
      title: `${match} - Jackpot Match Analysis | SokaPulse`,
      description: `Detailed analysis and predictions for ${match}. Get expert betting tips and comprehensive match statistics.`,
      url: `https://sokapulse.com/jackpot-match-details/${match}`,
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
      title: `${match} - Jackpot Match Analysis | SokaPulse`,
      description: `Detailed analysis and predictions for ${match}. Get expert betting tips and comprehensive match statistics.`,
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
      `${match} predictions`,
      'jackpot match analysis',
      'match statistics',
      'head to head stats',
      'betting tips',
      'expert predictions',
      'match preview'
    ].join(', ')
  };
};

export default function JackpotMatchDetailsLayout({ children }) {
  return <>{children}</>;
}