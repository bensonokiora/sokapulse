export const metadata = {
  title: 'AI Football Predictions & Analysis - SokaPulse',
  description: 'Access advanced AI-powered football predictions with 90%+ accuracy. Comprehensive machine learning analysis across all major leagues and tournaments.',
  alternates: {
    canonical: 'https://sokapulse.com/predictions/ai-football-prediction'
  },
  openGraph: {
    title: 'AI Football Predictions & Analysis - SokaPulse',
    description: 'Access advanced AI-powered football predictions with 90%+ accuracy. Comprehensive machine learning analysis across all major leagues and tournaments.',
    url: 'https://sokapulse.com/predictions/ai-football-prediction',
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

export default function AiFootballPredictionLayout({ children }) {
  return <>{children}</>;
} 