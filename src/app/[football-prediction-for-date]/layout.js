export const generateMetadata = async ({ params }) => {
  // Await params before accessing its properties
  const paramsObj = await params;
  const date = paramsObj?.['football-prediction-for-date'] || '';
  
  return {
    title: `Football Predictions for ${date} - Expert Betting Tips`,
    description: `Get expert football predictions and betting tips for ${date}. Access detailed match analysis, statistics and accurate predictions for all matches on ${date}.`,
    alternates: {
      canonical: `https://sokapulse.com/football-predictions-for-${date}`
    },
    openGraph: {
      title: `Football Predictions for ${date} - SokaPulse`,
      description: `Expert predictions and betting tips for ${date}. Get detailed match analysis and accurate predictions.`,
      url: `https://sokapulse.com/football-predictions-for-${date}`,
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
      title: `Football Predictions for ${date} - SokaPulse`,
      description: `Expert predictions and betting tips for ${date}. Get detailed match analysis and accurate predictions.`,
      images: ['https://sokapulse.com/twitter-card.jpg']
    },
    robots: {
      index: false,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    },
    keywords: [
      `${date} football predictions`,
      'daily betting tips',
      'match predictions',
      'soccer predictions',
      'betting analysis',
      'expert tips',
      'match preview'
    ].join(', ')
  };
};

export default function DatePredictionsLayout({ children }) {
  return <>{children}</>;
}