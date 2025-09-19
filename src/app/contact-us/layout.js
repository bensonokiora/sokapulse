export const metadata = {
  title: 'Contact SokaPulse - Get in Touch',
  description: 'Contact SokaPulse for any questions about our football predictions, betting tips, or general inquiries. We\'re here to help!',
  alternates: {
    canonical: 'https://sokapulse.com/contact-us'
  },
  openGraph: {
    title: 'Contact SokaPulse - Get in Touch',
    description: 'Contact us for any questions about our football predictions, betting tips, or general inquiries. We\'re here to help!',
    url: 'https://sokapulse.com/contact-us',
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
    title: 'Contact SokaPulse - Get in Touch',
    description: 'Contact us for any questions about our football predictions, betting tips, or general inquiries. We\'re here to help!',
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
    'contact sokapulse',
    'football predictions help',
    'betting tips support',
    'soccer predictions contact',
    'prediction site inquiry',
    'get in touch',
    'customer support'
  ].join(', ')
};

export default function ContactUsLayout({ children }) {
  return <>{children}</>;
}