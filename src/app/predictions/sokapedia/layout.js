export const metadata = {
  title: 'Sokapedia Predictions & Expert Analysis - SokaPulse',
  description: 'Access professional Sokapedia football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
  alternates: {
    canonical: 'https://sokapulse.com/predictions/sokapedia'
  },
  openGraph: {
    title: 'Sokapedia Predictions & Expert Analysis - SokaPulse',
    description: 'Access professional Sokapedia football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
    url: 'https://sokapulse.com/predictions/sokapedia',
    siteName: 'SokaPulse',
    images: [
      {
        url: 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        width: 1024,
        height: 768,
      }
    ],
    locale: 'en_US',
    type: 'article',
  },
  other: {
    'article:published_time': '2025-03-20T18:54:21+00:00',
    'article:modified_time': new Date().toISOString(),
  }
};

export default function SokapediaLayout({ children }) {
  return <>{children}</>;
} 