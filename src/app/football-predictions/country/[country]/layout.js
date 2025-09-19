export const generateMetadata = ({ params }) => {
  const country = params?.country || '';
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);

  return {
    title: `${countryName} Football Predictions - Expert Tips and Analysis`,
    description: `Get expert ${countryName} football predictions and betting tips. Accurate predictions with statistics and analysis for all ${countryName} leagues and tournaments.`,
    alternates: {
      canonical: `https://sokapulse.com/football-predictions/country/${country}`
    },
    openGraph: {
      title: `${countryName} Football Predictions - SokaPulse`,
      description: `Expert football predictions and betting tips for ${countryName} leagues. Get accurate predictions with detailed statistics and analysis.`,
      url: `https://sokapulse.com/football-predictions/country/${country}`,
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
      title: `${countryName} Football Predictions - SokaPulse`,
      description: `Expert football predictions and betting tips for ${countryName} leagues. Get accurate predictions with detailed statistics and analysis.`,
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
      `${countryName} football predictions`,
      `${countryName} betting tips`,
      `${countryName} soccer predictions`,
      `${countryName} league predictions`,
      'football predictions',
      'betting tips'
    ].join(', ')
  };
};

export default function CountryPredictionsLayout({ children }) {
  return <>{children}</>;
}