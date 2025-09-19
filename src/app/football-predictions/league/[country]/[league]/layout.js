export const generateMetadata = ({ params }) => {
  const country = params?.country || '';
  const league = params?.league?.split('-')[0] || '';
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const leagueName = league.charAt(0).toUpperCase() + league.slice(1);

  return {
    title: `${leagueName} Football Predictions - Tips & Analysis | SokaPulse`,
    description: `Get expert football predictions and betting tips for ${leagueName} matches. Access detailed statistics, analysis and live updates for all ${leagueName} fixtures.`,
    alternates: {
      canonical: `https://sokapulse.com/football-predictions/league/${country}/${league}`
    },
    openGraph: {
      title: `${leagueName} Football Predictions - SokaPulse`,
      description: `Expert predictions and betting tips for ${leagueName} matches. Get detailed statistics and live updates.`,
      description: `Expert football predictions and betting tips for ${leagueName}. Get accurate predictions with detailed statistics and analysis for all matches.`,
      url: `https://sokapulse.com/football-predictions/league/${country}/${league}`,
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
      title: `${leagueName} Football Predictions - SokaPulse`,
      description: `Expert football predictions and betting tips for ${leagueName}. Get accurate predictions with detailed statistics and analysis for all matches.`,
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
      `${leagueName} predictions`,
      `${leagueName} betting tips`,
      `${leagueName} football tips`,
      `${countryName} league predictions`,
      'football predictions',
      'soccer predictions',
      'betting tips'
    ].join(', ')
  };
};

export default function LeaguePredictionsLayout({ children }) {
  return <>{children}</>;
}