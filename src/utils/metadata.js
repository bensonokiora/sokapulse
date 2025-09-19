// Utility function to generate Next.js metadata
export function generateMetadata({ 
  title, 
  description, 
  keywords = '', 
  canonicalUrl = '', 
  openGraphImage = '/images/og-image.jpg',
  twitterCard = 'summary_large_image' 
}) {
  return {
    metadataBase: new URL('https://jackpot-predictions.com'),
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonicalUrl,
      siteName: 'Jackpot Predictions',
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [openGraphImage],
    },
    alternates: canonicalUrl ? {
      canonical: canonicalUrl,
    } : undefined,
  };
}