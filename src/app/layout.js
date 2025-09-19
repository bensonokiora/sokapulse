import '../styles/bootstrap-custom.css'; // Replace the full Bootstrap import
import '../styles/globals.css';
import '../styles/search.css';
import '../styles/footer.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons from local package
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import Script from 'next/script';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import Popup from '../components/Popup'; // Added import for Popup component
import { headers } from 'next/headers';
import AdManager from '@/components/AdManager';
import GoogleAutoAds from '@/components/GoogleAutoAds';

// Define all schemas in a single place
const schemas = {
  // Home/Organization schema
  'organization': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Place', 'LocalBusiness'],
        '@id': 'https://sokapulse.com/#organization',
        'name': 'sokapulse',
        'alternateName': 'sokapulse',
        'url': 'https://sokapulse.com/',
        'logo': {
          '@id': 'https://sokapulse.com/#local-main-organization-logo'
        },
        'image': {
          '@id': 'https://sokapulse.com/#local-main-organization-logo'
        },
        'sameAs': [
          'https://www.facebook.com/sokapulse.fb',
          'https://whatsapp.com/channel/0029VaKdIWZ6WaKssgU4gc1y',
          'https://t.me/jackpots_predictions',
          'https://www.instagram.com/_sokapulse'
        ],
        'description': 'Mathematically analyzed free football predictions',
        'legalName': 'sokapulse',
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '-1.2921',
          'longitude': '36.8219'
        },
        'hasMap': 'https://www.google.com/maps?q=Nairobi,Kenya',
        'areaServed': {
          '@type': 'GeoCircle',
          'geoMidpoint': {
            '@type': 'GeoCoordinates',
            'latitude': '-1.2921',
            'longitude': '36.8219'
          },
          'geoRadius': '50000'
        },
        'numberOfEmployees': {
          '@type': 'QuantitativeValue',
          'minValue': '1',
          'maxValue': '10'
        },
        'address': {
          '@id': 'https://sokapulse.com/#local-main-place-address'
        },
        'telephone': [],
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opens': '00:00',
            'closes': '23:59'
          }
        ]
      },
      {
        '@type': 'PostalAddress',
        '@id': 'https://sokapulse.com/#local-main-place-address',
        'streetAddress': '408',
        'addressLocality': 'Nairobi',
        'postalCode': '00100',
        'addressCountry': 'KE'
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/#local-main-organization-logo',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'sokapulse'
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sokapulse.com/#faq',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How accurate are your football predictions?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Our predictions are based on mathematical analysis, historical data, and current team form. While we strive for high accuracy, we recommend responsible betting practices.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Are your predictions free?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, our basic predictions are completely free. We also offer premium predictions for more detailed analysis.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How often are predictions updated?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Our predictions are updated daily with the latest matches and analysis.'
            }
          }
        ]
      },
      {
        '@type': 'HowTo',
        '@id': 'https://sokapulse.com/#howto',
        'name': 'How to Use Our Football Predictions',
        'description': 'Learn how to effectively use our football predictions for better betting decisions.',
        'step': [
          {
            '@type': 'HowToStep',
            'name': 'Check Daily Predictions',
            'text': 'Visit our website daily for the latest football predictions and analysis.'
          },
          {
            '@type': 'HowToStep',
            'name': 'Review Match Analysis',
            'text': 'Read our detailed match analysis including team form, head-to-head stats, and injury reports.'
          },
          {
            '@type': 'HowToStep',
            'name': 'Make Informed Decisions',
            'text': 'Use our predictions alongside your own research to make informed betting decisions.'
          }
        ],
        'totalTime': 'PT15M'
      }
    ]
  },
  
  // Sokafans schema
  'predictions/sokafans': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sokafans',
        'url': 'https://sokapulse.com/predictions/sokafans',
        'name': 'Sokafans Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Sokafans tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sokafans#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sokafans#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sokafans#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sokafans#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sokafans Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sokafans#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sokafans',
            'item': 'https://sokapulse.com/predictions/sokafans'
          }
        ]
      }
    ]
  },
  
   // sportpesa mega jp schema
   'predictions/sportpesa-mega-jackpot-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions',
        'url': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions',
        'name': 'Sportpesa Mega Jackpot Predictions',
        'description': 'Get Sure Mega Jackpot Prediction this Weekend &amp; increase your chances of winning the Sportpesa Mega Jackpot - 17 games &amp; bonuses this weekend',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sportpesa Mega Jackpot Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sportpesa Mega Jackpot Predictions',
            'item': 'https://sokapulse.com/predictions/sportpesa-mega-jackpot-predictions'
          }
        ]
      }
    ]
  },

   // sportpesa midweek jp schema
   'predictions/sportpesa-midweek-jackpot-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions',
        'url': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions',
        'name': 'Sportpesa Midweek Jackpot Predictions',
        'description': 'Get Sure Midweek Jackpot Prediction this Weekend &amp; increase your chances of winning the Sportpesa Mega Jackpot - 17 games &amp; bonuses this weekend',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sportpesa Midweek Jackpot Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sportpesa Midweek Jackpot Predictions',
            'item': 'https://sokapulse.com/predictions/sportpesa-midweek-jackpot-predictions'
          }
        ]
      }
    ]
  },

   // betika-midweek-jackpot-predictions mega jp schema
   'predictions/betika-midweek-jackpot-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions',
        'url': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions',
        'name': 'Betika Midweek Jackpot Predictions',
        'description': 'Get Sure Betika Midweek Jackpot Predictions this Weekend &amp; increase your chances of winning the Betika Midweek Jackpot Predictions games &amp; bonuses this weekend',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betika Midweek Jackpot Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betika Midweek Jackpot Predictions',
            'item': 'https://sokapulse.com/predictions/betika-midweek-jackpot-predictions'
          }
        ]
      }
    ]
  },

  // AI Football Prediction schema
  'predictions/ai-football-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/ai-football-prediction',
        'url': 'https://sokapulse.com/predictions/ai-football-prediction',
        'name': 'AI Football Predictions & Analysis - SokaPulse',
        'description': 'Access advanced AI-powered football predictions with 90%+ accuracy. Comprehensive machine learning analysis across all major leagues and tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/ai-football-prediction#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/ai-football-prediction#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/ai-football-prediction#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/ai-football-prediction#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'AI Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/ai-football-prediction#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'AI Football Predictions',
            'item': 'https://sokapulse.com/predictions/ai-football-prediction'
          }
        ]
      }
    ]
  },
  
  // Adibet schema
  'predictions/adibet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/adibet',
        'url': 'https://sokapulse.com/predictions/adibet',
        'name': 'Adibet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Adibet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/adibet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/adibet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/adibet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/adibet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Adibet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/adibet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Adibet',
            'item': 'https://sokapulse.com/predictions/adibet'
          }
        ]
      }
    ]
  },
  
  // Betclan schema
  'predictions/betclan': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betclan',
        'url': 'https://sokapulse.com/predictions/betclan',
        'name': 'Betclan Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betclan tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betclan#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betclan#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betclan#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betclan#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betclan Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betclan#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betclan',
            'item': 'https://sokapulse.com/predictions/betclan'
          }
        ]
      }
    ]
  },
  
  // Betensured schema
  'predictions/betensured': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betensured',
        'url': 'https://sokapulse.com/predictions/betensured',
        'name': 'Betensured Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betensured tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betensured#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betensured#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betensured#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betensured#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betensured Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betensured#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betensured',
            'item': 'https://sokapulse.com/predictions/betensured'
          }
        ]
      }
    ]
  },
  
  // Betexplorer schema
  'predictions/betexplorer': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betexplorer',
        'url': 'https://sokapulse.com/predictions/betexplorer',
        'name': 'Betexplorer Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betexplorer tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betexplorer#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betexplorer#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betexplorer#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betexplorer#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betexplorer Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betexplorer#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betexplorer',
            'item': 'https://sokapulse.com/predictions/betexplorer'
          }
        ]
      }
    ]
  },
  
  // Betgenuine schema
  'predictions/betgenuine': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betgenuine',
        'url': 'https://sokapulse.com/predictions/betgenuine',
        'name': 'Betgenuine Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betgenuine tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betgenuine#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betgenuine#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betgenuine#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betgenuine#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betgenuine Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betgenuine#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betgenuine',
            'item': 'https://sokapulse.com/predictions/betgenuine'
          }
        ]
      }
    ]
  },
  
  // Betinum schema
  'predictions/betinum': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betinum',
        'url': 'https://sokapulse.com/predictions/betinum',
        'name': 'Betinum Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betinum tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betinum#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betinum#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betinum#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betinum#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betinum Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betinum#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betinum',
            'item': 'https://sokapulse.com/predictions/betinum'
          }
        ]
      }
    ]
  },
  
  // Betnumbers schema
  'predictions/betnumbers': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betnumbers',
        'url': 'https://sokapulse.com/predictions/betnumbers',
        'name': 'Betnumbers Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betnumbers tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betnumbers#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betnumbers#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betnumbers#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betnumbers#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betnumbers Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betnumbers#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betnumbers',
            'item': 'https://sokapulse.com/predictions/betnumbers'
          }
        ]
      }
    ]
  },
  
  // Betpera schema
  'predictions/betpera': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betpera',
        'url': 'https://sokapulse.com/predictions/betpera',
        'name': 'Betpera Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betpera tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betpera#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betpera#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betpera#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/betpera#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betpera Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betpera#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betpera',
            'item': 'https://sokapulse.com/predictions/betpera'
          }
        ]
      }
    ]
  },
  
  // Betpro360 schema
  'predictions/betpro360': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betpro360',
        'url': 'https://sokapulse.com/predictions/betpro360',
        'name': 'Betpro360 Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betpro360 tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betpro360#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betpro360#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betpro360#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/betpro360#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betpro360 Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betpro360#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betpro360',
            'item': 'https://sokapulse.com/predictions/betpro360'
          }
        ]
      }
    ]
  },
  
  // Betshoot schema
  'predictions/betshoot': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betshoot',
        'url': 'https://sokapulse.com/predictions/betshoot',
        'name': 'Betshoot Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betshoot tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betshoot#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betshoot#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betshoot#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/betshoot#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betshoot Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betshoot#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betshoot',
            'item': 'https://sokapulse.com/predictions/betshoot'
          }
        ]
      }
    ]
  },
  
  // Bettingexpert schema
  'predictions/bettingexpert': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/bettingexpert',
        'url': 'https://sokapulse.com/predictions/bettingexpert',
        'name': 'Bettingexpert Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Bettingexpert tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/bettingexpert#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/bettingexpert#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/bettingexpert#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/bettingexpert#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Bettingexpert Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/bettingexpert#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Bettingexpert',
            'item': 'https://sokapulse.com/predictions/bettingexpert'
          }
        ]
      }
    ]
  },
  
  // Betwinner360 schema
  'predictions/betwinner360': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betwinner360',
        'url': 'https://sokapulse.com/predictions/betwinner360',
        'name': 'Betwinner360 Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betwinner360 tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betwinner360#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betwinner360#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betwinner360#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/betwinner360#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betwinner360 Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betwinner360#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betwinner360',
            'item': 'https://sokapulse.com/predictions/betwinner360'
          }
        ]
      }
    ]
  },
  
  // Betwizad schema
  'predictions/betwizad': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betwizad',
        'url': 'https://sokapulse.com/predictions/betwizad',
        'name': 'Betwizad Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Betwizad tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betwizad#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betwizad#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betwizad#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/betwizad#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betwizad Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betwizad#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betwizad',
            'item': 'https://sokapulse.com/predictions/betwizad'
          }
        ]
      }
    ]
  },
  
  // Cheerplex schema
  'predictions/cheerplex': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/cheerplex',
        'url': 'https://sokapulse.com/predictions/cheerplex',
        'name': 'Cheerplex Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Cheerplex tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/cheerplex#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/cheerplex#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/cheerplex#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/cheerplex#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Cheerplex Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/cheerplex#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Cheerplex',
            'item': 'https://sokapulse.com/predictions/cheerplex'
          }
        ]
      }
    ]
  },
  
  // 1960tips schema
  'predictions/1960tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/1960tips',
        'url': 'https://sokapulse.com/predictions/1960tips',
        'name': '1960tips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest 1960tips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/1960tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/1960tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/1960tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/1960tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': '1960tips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/1960tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': '1960tips',
            'item': 'https://sokapulse.com/predictions/1960tips'
          }
        ]
      }
    ]
  },
  
  // Today football predictions schema
  'today-football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/today-football-predictions',
        'url': 'https://sokapulse.com/today-football-predictions',
        'name': 'Today\'s Football Predictions - Latest Betting Tips',
        'description': 'Get today\'s football predictions and betting tips. Access live match analysis, latest statistics, and expert predictions for all of today\'s matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/today-football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/today-football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/today-football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/today-football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/today-football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Today\'s Predictions'
          }
        ]
      }
    ]
  },
  
  // Tomorrow football predictions schema
  'tomorrow-football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/tomorrow-football-predictions',
        'url': 'https://sokapulse.com/tomorrow-football-predictions',
        'name': 'Tomorrow\'s Football Predictions - Early Match Tips',
        'description': 'Get early access to tomorrow\'s football predictions and betting tips. Access detailed analysis and expert predictions for upcoming matches with highest probability of winning.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/tomorrow-football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/tomorrow-football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/tomorrow-football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/tomorrow-football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/tomorrow-football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Tomorrow\'s Predictions'
          }
        ]
      }
    ]
  },
  
  // Weekend football predictions schema
  'weekend-football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/weekend-football-predictions',
        'url': 'https://sokapulse.com/weekend-football-predictions',
        'name': 'Weekend Football Predictions - Expert Analysis & Tips',
        'description': 'Get accurate weekend football predictions for all matches happening this weekend. Expert analysis covers all major leagues and tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/weekend-football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/weekend-football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/weekend-football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/weekend-football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/weekend-football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Weekend Predictions'
          }
        ]
      }
    ]
  },
  
  // Live football predictions schema
  'live-football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/live-football-predictions',
        'url': 'https://sokapulse.com/live-football-predictions',
        'name': 'Live Football Predictions - Real-Time Match Tips',
        'description': 'Get real-time football predictions and live betting tips. Access in-play match analysis, live statistics, and expert predictions for ongoing matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/live-football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/live-football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/live-football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/live-football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/live-football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Live Predictions'
          }
        ]
      }
    ]
  },
  
  // Yesterday football predictions schema 
  'yesterday-football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/yesterday-football-predictions',
        'url': 'https://sokapulse.com/yesterday-football-predictions',
        'name': 'Yesterday\'s Football Predictions - Previous Match Results',
        'description': 'Review yesterday\'s football predictions and match results. Analyze our prediction accuracy and get insights from past matches to improve future betting.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/yesterday-football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/yesterday-football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/yesterday-football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/yesterday-football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/yesterday-football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Yesterday\'s Predictions'
          }
        ]
      }
    ]
  },
  
  // Top trends schema
  'top-trends': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/top-trends',
        'url': 'https://sokapulse.com/top-trends',
        'name': 'Top Football Trends - Latest Match Statistics',
        'description': 'Discover the latest football trends and statistical insights. Access comprehensive analysis of team performance, scoring patterns, and betting trends.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/top-trends#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/top-trends#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/top-trends#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/top-trends']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/top-trends#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Top Trends'
          }
        ]
      }
    ]
  },
  
  // About us schema
  'about-us': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://sokapulse.com/about-us',
        'url': 'https://sokapulse.com/about-us',
        'name': 'About SokaPulse - Football Predictions Platform',
        'description': 'Learn about SokaPulse, our prediction methodology, and our commitment to providing accurate football predictions and betting tips.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/about-us#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/about-us#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/about-us#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/about-us']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/about-us#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'About Us'
          }
        ]
      }
    ]
  },
  
  // Contact us schema
  'contact-us': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': 'https://sokapulse.com/contact-us',
        'url': 'https://sokapulse.com/contact-us',
        'name': 'Contact SokaPulse - Get in Touch',
        'description': 'Contact SokaPulse for any questions about our football predictions, betting tips, or general inquiries. We\'re here to help!',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/contact-us#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/contact-us#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/contact-us#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/contact-us']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/contact-us#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Contact Us'
          }
        ]
      }
    ]
  },
  
  // Terms of use schema
  'terms-of-use': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://sokapulse.com/terms-of-use',
        'url': 'https://sokapulse.com/terms-of-use',
        'name': 'Terms of Use - SokaPulse',
        'description': 'Read SokaPulse\'s terms of use to understand the rules, guidelines, and requirements for using our football predictions platform.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/terms-of-use#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/terms-of-use#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/terms-of-use#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/terms-of-use']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/terms-of-use#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Terms of Use'
          }
        ]
      }
    ]
  },
  
  // Privacy policy schema
  'privacy-policy': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://sokapulse.com/privacy-policy',
        'url': 'https://sokapulse.com/privacy-policy',
        'name': 'Privacy Policy - SokaPulse',
        'description': 'Read our privacy policy to understand how we collect, use, and protect your personal information when you use our football predictions platform.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/privacy-policy#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/privacy-policy#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/privacy-policy#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/privacy-policy']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/privacy-policy#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Privacy Policy'
          }
        ]
      }
    ]
  },
  
  // Jackpot predictions schema
  'jackpot-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/jackpot-predictions',
        'url': 'https://sokapulse.com/jackpot-predictions',
        'name': 'Jackpot Predictions - Football Betting Jackpot Tips',
        'description': 'Get expert jackpot predictions and betting tips for football matches with high winning potential. Access accurate jackpot analysis for multiple betting platforms.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/jackpot-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/jackpot-predictions']
          }
        ]
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/jackpot-predictions#primaryimage',
        'url': 'https://sokapulse.com/logo.png',
        'contentUrl': 'https://sokapulse.com/logo.png',
        'width': 1024,
        'height': 768,
        'caption': 'Football Jackpot Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/jackpot-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Jackpot Predictions',
            'item': 'https://sokapulse.com/jackpot-predictions'
          }
        ]
      }
    ]
  },
  
  // Jackpot match details schema - Enhanced for dynamic URLs
  'jackpot-match-details': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SportsEvent',
        '@id': 'https://sokapulse.com/jackpot-match-details',
        'name': 'Football Match Prediction & Analysis',
        'description': 'In-depth analysis and predictions for this football match with team statistics, head-to-head record, and expert betting tips.',
        'url': 'https://sokapulse.com/jackpot-match-details',
        'startDate': new Date().toISOString(), // This will be replaced dynamically by the date parameter
        'endDate': new Date().toISOString(), // This will be replaced dynamically 
        'location': {
          '@type': 'Place',
          'name': 'Match Venue',
          'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'Match Country'
          }
        },
        'organizer': {
          '@type': 'Organization',
          'name': 'Football League/Tournament'
        },
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'performer': [
          {
            '@type': 'SportsTeam',
            'name': 'Home Team' // Will be replaced dynamically
          },
          {
            '@type': 'SportsTeam',
            'name': 'Away Team' // Will be replaced dynamically
          }
        ],
        'homeTeam': {
          '@type': 'SportsTeam',
          'name': 'Home Team' // Will be replaced dynamically
        },
        'awayTeam': {
          '@type': 'SportsTeam',
          'name': 'Away Team' // Will be replaced dynamically
        },
        'competitor': [
          {
            '@type': 'SportsTeam',
            'name': 'Home Team' // Will be replaced dynamically
          },
          {
            '@type': 'SportsTeam',
            'name': 'Away Team' // Will be replaced dynamically
          }
        ],
        'sport': 'Football',
        'eventStatus': 'EventScheduled',
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/jackpot-match-details#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/jackpot-match-details#primaryimage'
        },
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/jackpot-match-details#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/jackpot-match-details']
          }
        ]
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/jackpot-match-details#primaryimage',
        'url': 'https://sokapulse.com/logo.png',
        'contentUrl': 'https://sokapulse.com/logo.png',
        'width': 1024,
        'height': 768,
        'caption': 'Football Match Analysis'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/jackpot-match-details#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Jackpot Predictions',
            'item': 'https://sokapulse.com/jackpot-predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Match Details',
            'item': 'https://sokapulse.com/jackpot-match-details'
          }
        ]
      }
    ]
  },
  
  // Top football predictions schema
  'top-football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/top-football-predictions',
        'url': 'https://sokapulse.com/top-football-predictions',
        'name': 'Top Football Predictions - Latest Match Statistics',
        'description': 'Discover the latest football trends and statistical insights. Access comprehensive analysis of team performance, scoring patterns, and betting trends.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/top-football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/top-football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/top-football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/top-football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/top-football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Top Football Predictions'
          }
        ]
      }
    ]
  },
  
  // Football predictions grouped by leagues schema
  'football-predictions-grouped-by-leagues': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/football-predictions-grouped-by-leagues',
        'url': 'https://sokapulse.com/football-predictions-grouped-by-leagues',
        'name': 'Football Predictions Grouped by Leagues - Expert Analysis',
        'description': 'Get accurate football predictions for all matches happening in various leagues and tournaments. Expert analysis covers all major leagues and tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/football-predictions-grouped-by-leagues#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/football-predictions-grouped-by-leagues#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/football-predictions-grouped-by-leagues#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/football-predictions-grouped-by-leagues']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/football-predictions-grouped-by-leagues#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Football Predictions Grouped by Leagues'
          }
        ]
      }
    ]
  },
  
  // Favourite predictions schema
  'favourite-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/favourite-predictions',
        'url': 'https://sokapulse.com/favourite-predictions',
        'name': 'Favourite Predictions - Your Personalised Football Predictions',
        'description': 'Access your favourite football predictions and betting tips. Customise your predictions and get insights from past matches to improve future betting.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/favourite-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/favourite-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/favourite-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/favourite-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/favourite-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Favourite Predictions'
          }
        ]
      }
    ]
  },
  
  // Search results schema
  'search-results': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/search-results',
        'url': 'https://sokapulse.com/search-results',
        'name': 'Search Results - Football Predictions',
        'description': 'Find accurate football predictions and betting tips based on your search query. Access expert analysis and statistics for upcoming matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/search-results#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/search-results#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/search-results#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/search-results']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/search-results#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Search Results'
          }
        ]
      }
    ]
  },
  
  // Upcoming football predictions schema
  'upcoming-football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/upcoming-football-predictions',
        'url': 'https://sokapulse.com/upcoming-football-predictions',
        'name': 'Upcoming Football Predictions - Expert Analysis & Tips',
        'description': 'Get accurate football predictions for upcoming matches. Expert analysis covers all major leagues and tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/upcoming-football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/upcoming-football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/upcoming-football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/upcoming-football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/upcoming-football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Upcoming Football Predictions'
          }
        ]
      }
    ]
  },
  
  // Football predictions schema
  'football-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/football-predictions',
        'url': 'https://sokapulse.com/football-predictions',
        'name': 'Football Predictions - Expert Match Analysis & Betting Tips',
        'description': 'Get comprehensive football predictions and expert betting tips for matches across all major leagues and tournaments worldwide.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/football-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/football-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/football-predictions#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/football-predictions']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/football-predictions#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Football Predictions'
          }
        ]
      }
    ]
  },
  
  // Country football predictions schema
  'football-predictions/country': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/football-predictions/country',
        'url': 'https://sokapulse.com/football-predictions/country',
        'name': 'Country Football Predictions - Match Analysis by Nation',
        'description': 'Get football predictions and betting tips for matches from specific countries. Expert analysis covers national leagues and competitions.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/football-predictions/country#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/football-predictions/country#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/football-predictions/country#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/football-predictions/country']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/football-predictions/country#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Football Predictions',
            'item': 'https://sokapulse.com/football-predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Country Predictions'
          }
        ]
      }
    ]
  },
  
  // League football predictions schema
  'football-predictions/league': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/football-predictions/league',
        'url': 'https://sokapulse.com/football-predictions/league',
        'name': 'League Football Predictions - Competition-Specific Analysis',
        'description': 'Get detailed football predictions and betting tips for specific leagues and competitions. Expert analysis covers matches from individual tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/football-predictions/league#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/football-predictions/league#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/football-predictions/league#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/football-predictions/league']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/football-predictions/league#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Football Predictions',
            'item': 'https://sokapulse.com/football-predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'League Predictions'
          }
        ]
      }
    ]
  },
  
  // Date-specific football predictions schema
  'football-prediction-for-date': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/football-prediction-for-date',
        'url': 'https://sokapulse.com/football-prediction-for-date',
        'name': 'Football Predictions by Date - Specific Day Match Tips',
        'description': 'Get football predictions and betting tips for matches happening on a specific date. Expert analysis for all games on the selected day.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/football-prediction-for-date#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/football-prediction-for-date#primaryimage'
        },
        'thumbnailUrl': 'https://sokapulse.com/logo.png',
        'datePublished': '2025-03-20T00:00:00+00:00',
        
        'breadcrumb': {
          '@id': 'https://sokapulse.com/football-prediction-for-date#breadcrumb'
        },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': ['https://sokapulse.com/football-prediction-for-date']
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/football-prediction-for-date#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Date Predictions'
          }
        ]
      }
    ]
  },
  
  // Confirmbets schema
  'predictions/confirmbets': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/confirmbets',
        '@context': 'https://schema.org',
        'url': 'https://sokapulse.com/predictions/confirmbets',
        'name': 'Confirmbets Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Confirmbets tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/confirmbets#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/confirmbets#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/confirmbets#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/confirmbets#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Confirmbets Tips Today Prediction'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/confirmbets#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Confirmbets',
            'item': 'https://sokapulse.com/predictions/confirmbets'
          }
        ]
      }
    ]
  },
  
  // Forebet schema
  'predictions/forebet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/forebet',
        'url': 'https://sokapulse.com/predictions/forebet',
        'name': 'Forebet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Forebet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/forebet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/forebet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/forebet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/forebet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Forebet Tips Today Prediction'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/forebet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Forebet',
            'item': 'https://sokapulse.com/predictions/forebet'
          }
        ]
      }
    ]
  },
  
  // Freesupertips schema
  'predictions/freesupertips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/freesupertips',
        'url': 'https://sokapulse.com/predictions/freesupertips',
        'name': 'Freesupertips Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Freesupertips tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/freesupertips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/freesupertips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/freesupertips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/freesupertips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Freesupertips Tips Today Prediction'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/freesupertips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Freesupertips',
            'item': 'https://sokapulse.com/predictions/freesupertips'
          }
        ]
      }
    ]
  },
  
  // Freetips schema
  'predictions/freetips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/freetips',
        'url': 'https://sokapulse.com/predictions/freetips',
        'name': 'Freetips Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Freetips tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/freetips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/freetips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/freetips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/freetips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Freetips Tips Today Prediction'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/freetips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Freetips',
            'item': 'https://sokapulse.com/predictions/freetips'
          }
        ]
      }
    ]
  },
  
  // Futbol24 schema
  'predictions/futbol24': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/futbol24',
        'url': 'https://sokapulse.com/predictions/futbol24',
        'name': 'Futbol24 Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Futbol24 tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/futbol24#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/futbol24#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/futbol24#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/futbol24#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Futbol24 Tips Today Prediction'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/futbol24#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Futbol24',
            'item': 'https://sokapulse.com/predictions/futbol24'
          }
        ]
      }
    ]
  },
  
  // Liobet schema
  'predictions/liobet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/liobet',
        'url': 'https://sokapulse.com/predictions/liobet',
        'name': 'Liobet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Liobet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/liobet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/liobet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/liobet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/liobet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Liobet Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/liobet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Liobet'
          }
        ]
      }
    ]
  },
  
  // Mighty-tips schema
  'predictions/mighty-tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/mighty-tips',
        'url': 'https://sokapulse.com/predictions/mighty-tips',
        'name': 'Mightytips Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Mightytips tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/mighty-tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/mighty-tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/mighty-tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/mighty-tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Mightytips Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/mighty-tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Mightytips'
          }
        ]
      }
    ]
  },
  
  // Mwanasoka schema
  'predictions/mwanasoka': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/mwanasoka',
        'url': 'https://sokapulse.com/predictions/mwanasoka',
        'name': 'Mwanasoka Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Mwanasoka tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/mwanasoka#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/mwanasoka#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/mwanasoka#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/mwanasoka#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Mwanasoka Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/mwanasoka#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Mwanasoka'
          }
        ]
      }
    ]
  },
  
  // Oddspedia schema
  'predictions/oddspedia': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/oddspedia',
        'url': 'https://sokapulse.com/predictions/oddspedia',
        'name': 'Oddspedia Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Oddspedia tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/oddspedia#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/oddspedia#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/oddspedia#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/oddspedia#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Oddspedia Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/oddspedia#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Oddspedia'
          }
        ]
      }
    ]
  },
  
  // Predictz schema
  'predictions/predictz': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/predictz',
        'url': 'https://sokapulse.com/predictions/predictz',
        'name': 'Predictz Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Predictz tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/predictz#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/predictz#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/predictz#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/predictz#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Predictz Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/predictz#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Predictz'
          }
        ]
      }
    ]
  },
  
  // Primatips schema
  'predictions/primatips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/primatips',
        'url': 'https://sokapulse.com/predictions/primatips',
        'name': 'Primatips Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Primatips tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/primatips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/primatips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/primatips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/primatips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Primatips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/primatips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Primatips'
          }
        ]
      }
    ]
  },
  
  // Soccervista schema
  'predictions/soccervista': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/soccervista',
        'url': 'https://sokapulse.com/predictions/soccervista',
        'name': 'Soccervista Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Soccervista tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/soccervista#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/soccervista#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/soccervista#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/soccervista#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Soccervista Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/soccervista#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Soccervista'
          }
        ]
      }
    ]
  },
  
  // Solopredict schema
  'predictions/solopredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/solopredict',
        'url': 'https://sokapulse.com/predictions/solopredict',
        'name': 'Solopredict Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Solopredict tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/solopredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/solopredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/solopredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/solopredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Solopredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/solopredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Solopredict'
          }
        ]
      }
    ]
  },
  
  // Sunpel schema
  'predictions/sunpel': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sunpel',
        'url': 'https://sokapulse.com/predictions/sunpel',
        'name': 'Sunpel Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Sunpel tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sunpel#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sunpel#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sunpel#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/sunpel#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sunpel Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sunpel#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sunpel'
          }
        ]
      }
    ]
  },
  
  // Supatips schema
  'predictions/supatips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/supatips',
        'url': 'https://sokapulse.com/predictions/supatips',
        'name': 'Supatips Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Supatips tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/supatips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/supatips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/supatips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/supatips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Supatips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/supatips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Supatips'
          }
        ]
      }
    ]
  },
  
  // Tips180 schema
  'predictions/tips180': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/tips180',
        'url': 'https://sokapulse.com/predictions/tips180',
        'name': 'Tips180 Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Tips180 tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/tips180#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/tips180#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/tips180#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/tips180#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Tips180 Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/tips180#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Tips180'
          }
        ]
      }
    ]
  },
  
  // Tipsbet schema
  'predictions/tipsbet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/tipsbet',
        'url': 'https://sokapulse.com/predictions/tipsbet',
        'name': 'Tipsbet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Tipsbet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/tipsbet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/tipsbet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/tipsbet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/tipsbet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Tipsbet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/tipsbet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Tipsbet'
          }
        ]
      }
    ]
  },
  
  // Topbets schema
  'predictions/topbets': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/topbets',
        'url': 'https://sokapulse.com/predictions/topbets',
        'name': 'Topbets Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Topbets tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/topbets#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/topbets#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/topbets#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/topbets#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Topbets Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/topbets#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Topbets'
          }
        ]
      }
    ]
  },
  
  // Venasbet schema
  'predictions/venasbet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/venasbet',
        'url': 'https://sokapulse.com/predictions/venasbet',
        'name': 'Venasbet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Venasbet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/venasbet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/venasbet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/venasbet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/venasbet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Venasbet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/venasbet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Venasbet'
          }
        ]
      }
    ]
  },
  
  // Victorspredict schema
  'predictions/victorspredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/victorspredict',
        'url': 'https://sokapulse.com/predictions/victorspredict',
        'name': 'Victorspredict Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Victorspredict tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/victorspredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/victorspredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/victorspredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/victorspredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Victorspredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/victorspredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Victorspredict'
          }
        ]
      }
    ]
  },
  
  // Vitibet schema
  'predictions/vitibet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/vitibet',
        'url': 'https://sokapulse.com/predictions/vitibet',
        'name': 'Vitibet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Vitibet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/vitibet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/vitibet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sokapulse.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Predictions',
              'item': 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Vitibet'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/vitibet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Vitibet Football Predictions'
      }
    ]
  },


  // Zulubet schema
  'predictions/zulubet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/zulubet',
        'url': 'https://sokapulse.com/predictions/zulubet',
        'name': 'Zulubet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Zulubet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/zulubet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/zulubet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
              'name': 'Zulubet'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/zulubet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Zulubet Football Predictions'
      }
    ]
  },

  // BBC Mega and Midweek Jackpot Prediction schema
  'predictions/bbc-mega-and-midweek-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction',
        'url': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction',
        'name': 'BBC Jackpot Prediction Predictions & Expert Analysis - SokaPulse',
        'description': 'Access professional BBC football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'BBC Jackpot Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'BBC Jackpot Predictions',
            'item': 'https://sokapulse.com/predictions/bbc-mega-and-midweek-jackpot-prediction'
          }
        ]
      }
    ]
  },

  // Statarea Mega Jackpot Prediction schema
  'predictions/statarea-mega-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction',
        'url': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction',
        'name': 'Statarea Predictions & Professional Analysis - SokaPulse',
        'description': 'Access professional Statarea football predictions with 87%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Statarea Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Statarea Predictions',
            'item': 'https://sokapulse.com/predictions/statarea-mega-jackpot-prediction'
          }
        ]
      }
    ]
  },

  // Sokapedia schema
  'predictions/sokapedia': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sokapedia',
        'url': 'https://sokapulse.com/predictions/sokapedia',
        'name': 'Sokapedia Predictions & Expert Analysis - SokaPulse',
        'description': 'Access professional Sokapedia football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sokapedia#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sokapedia#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Predictions',
              'item': 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Sokapedia Predictions',
              'item': 'https://sokapulse.com/predictions/sokapedia'
            }
          ]
        }
      }
    ]
  },

  'predictions/king-mega-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/king-mega-jackpot-prediction',
        url: 'https://sokapulse.com/predictions/king-mega-jackpot-prediction',
        name: 'King Mega Jackpot Predictions & Expert Analysis - SokaPulse',
        description: 'Get expert King Mega Jackpot predictions with over 87% accuracy. Access professional analysis, statistics, and betting tips for successful jackpot predictions.',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://sokapulse.com/images/og-image.jpg',
          width: '1200',
          height: '630',
          caption: 'King Mega Jackpot Predictions - SokaPulse'
        },
        image: 'https://sokapulse.com/images/og-image.jpg',
        thumbnailUrl: 'https://sokapulse.com/images/og-image.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'King Mega Jackpot Predictions',
              item: 'https://sokapulse.com/predictions/king-mega-jackpot-prediction'
            }
          ]
        }
      }
    ]
  },

  'predictions/flashscore-mega-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/flashscore-mega-jackpot-prediction',
        url: 'https://sokapulse.com/predictions/flashscore-mega-jackpot-prediction',
        name: 'Flashscore Predictions & Analysis - SokaPulse',
        description: 'Access professional Flashscore football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://sokapulse.com/images/og-image.jpg',
          width: '1200',
          height: '630',
          caption: 'Flashscore Predictions - SokaPulse'
        },
        image: 'https://sokapulse.com/images/og-image.jpg',
        thumbnailUrl: 'https://sokapulse.com/images/og-image.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Flashscore Predictions',
              item: 'https://sokapulse.com/predictions/flashscore-mega-jackpot-prediction'
            }
          ]
        }
      }
    ]
  },

  'predictions/betarazi-mega-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betarazi-mega-jackpot-prediction',
        url: 'https://sokapulse.com/predictions/betarazi-mega-jackpot-prediction',
        name: 'Betarazi Predictions & Professional Analysis - SokaPulse',
        description: 'Access professional Betarazi football predictions with 89%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://sokapulse.com/images/og-image.jpg',
          width: '1200',
          height: '630',
          caption: 'Betarazi Predictions - SokaPulse'
        },
        image: 'https://sokapulse.com/images/og-image.jpg',
        thumbnailUrl: 'https://sokapulse.com/images/og-image.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Betarazi Predictions',
              item: 'https://sokapulse.com/predictions/betarazi-mega-jackpot-prediction'
            }
          ]
        }
      }
    ]
  },

  'predictions/jambofutaa': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/jambofutaa',
        url: 'https://sokapulse.com/predictions/jambofutaa',
        name: 'Jambofutaa Predictions & Expert Analysis - SokaPulse',
        description: 'Expert football predictions, analysis, and betting tips with 85%+ accuracy rate. Access comprehensive Jambofutaa predictions and jackpot insights.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/jambofutaa#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/jambofutaa#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/jambofutaa-predictions.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/jambofutaa#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Jambofutaa Predictions',
              item: 'https://sokapulse.com/predictions/jambofutaa'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/jambofutaa#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/jambofutaa-predictions.jpg',
        contentUrl: 'https://sokapulse.com/images/jambofutaa-predictions.jpg',
        width: 1200,
        height: 630,
        caption: 'Jambofutaa Predictions & Analysis'
      }
    ]
  },

  'predictions/octopus-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/octopus-jackpot-prediction',
        url: 'https://sokapulse.com/predictions/octopus-jackpot-prediction',
        name: 'Octopus Predictions & Analysis - SokaPulse',
        description: 'Access expert Octopus football predictions with 85%+ accuracy, inspired by Paul the Octopus. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/octopus-jackpot-prediction#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/octopus-jackpot-prediction#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/octopus-predictions.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/octopus-jackpot-prediction#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Octopus Predictions',
              item: 'https://sokapulse.com/predictions/octopus-jackpot-prediction'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/octopus-jackpot-prediction#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/octopus-predictions.jpg',
        contentUrl: 'https://sokapulse.com/images/octopus-predictions.jpg',
        width: 1200,
        height: 630,
        caption: 'Octopus Predictions & Analysis'
      }
    ]
  },

  'predictions/7sport-mega-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/7sport-mega-jackpot-prediction',
        url: 'https://sokapulse.com/predictions/7sport-mega-jackpot-prediction',
        name: '7sport Predictions & Analysis - SokaPulse',
        description: 'Access expert 7sport football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/7sport-mega-jackpot-prediction#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/7sport-mega-jackpot-prediction#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/7sport-predictions.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/7sport-mega-jackpot-prediction#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: '7sport Predictions',
              item: 'https://sokapulse.com/predictions/7sport-mega-jackpot-prediction'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/7sport-mega-jackpot-prediction#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/7sport-predictions.jpg',
        contentUrl: 'https://sokapulse.com/images/7sport-predictions.jpg',
        width: 1200,
        height: 630,
        caption: '7sport Predictions & Analysis'
      }
    ]
  },

  'predictions/4bet-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/4bet-predictions',
        url: 'https://sokapulse.com/predictions/4bet-predictions',
        name: '4bet Predictions & Expert Analysis - SokaPulse',
        description: 'Access expert 4bet football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/4bet-predictions#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/4bet-predictions#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/4bet-predictions.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/4bet-predictions#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: '4bet Predictions',
              item: 'https://sokapulse.com/predictions/4bet-predictions'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/4bet-predictions#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/4bet-predictions.jpg',
        contentUrl: 'https://sokapulse.com/images/4bet-predictions.jpg',
        width: 1200,
        height: 630,
        caption: '4bet Predictions & Expert Analysis'
      }
    ]
  },

  'predictions/sporty-bet-jackpot-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sporty-bet-jackpot-predictions',
        url: 'https://sokapulse.com/predictions/sporty-bet-jackpot-predictions',
        name: 'Sportybet Jackpot Predictions & Expert Analysis - SokaPulse',
        description: 'Access expert Sportybet jackpot football predictions with 85%+ accuracy. Comprehensive analysis and winning strategies for Sportybet jackpot competition.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/sporty-bet-jackpot-predictions#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/sporty-bet-jackpot-predictions#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/sportybet-jackpot-predictions.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/sporty-bet-jackpot-predictions#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Sportybet Jackpot Predictions',
              item: 'https://sokapulse.com/predictions/sporty-bet-jackpot-predictions'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/sporty-bet-jackpot-predictions#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/sportybet-jackpot-predictions.jpg',
        contentUrl: 'https://sokapulse.com/images/sportybet-jackpot-predictions.jpg',
        width: 1200,
        height: 630,
        caption: 'Sportybet Jackpot Predictions & Expert Analysis'
      }
    ]
  },

  'predictions/onemillion-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/onemillion-predictions',
        url: 'https://sokapulse.com/predictions/onemillion-predictions',
        name: 'OneMillion Predictions & Expert Analysis - SokaPulse',
        description: 'Access expert OneMillion football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/onemillion-predictions#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/onemillion-predictions#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/onemillion-predictions.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/onemillion-predictions#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'OneMillion Predictions',
              item: 'https://sokapulse.com/predictions/onemillion-predictions'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/onemillion-predictions#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/onemillion-predictions.jpg',
        contentUrl: 'https://sokapulse.com/images/onemillion-predictions.jpg',
        width: 1200,
        height: 630,
        caption: 'OneMillion Predictions & Expert Analysis'
      }
    ]
  },

  'predictions/goaloo-mega-jackpot-prediction': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/goaloo-mega-jackpot-prediction',
        url: 'https://sokapulse.com/predictions/goaloo-mega-jackpot-prediction',
        name: 'Goaloo Predictions & Expert Analysis - SokaPulse',
        description: 'Access expert Goaloo football predictions with 85%+ accuracy. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/goaloo-mega-jackpot-prediction#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/goaloo-mega-jackpot-prediction#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/goaloo-mega-jackpot-prediction.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/goaloo-mega-jackpot-prediction#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Goaloo Mega Jackpot Predictions',
              item: 'https://sokapulse.com/predictions/goaloo-mega-jackpot-prediction'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/goaloo-mega-jackpot-prediction#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/goaloo-mega-jackpot-prediction.jpg',
        contentUrl: 'https://sokapulse.com/images/goaloo-mega-jackpot-prediction.jpg',
        width: 1200,
        height: 630,
        caption: 'Goaloo Predictions & Expert Analysis'
      }
    ]
  },
  
  'predictions/pepeatips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/pepeatips',
        url: 'https://sokapulse.com/predictions/pepeatips',
        name: 'Pepeatips Today and Pepea Jackpot Predictions - SokaPulse',
        description: 'Access expert Pepea football tips and jackpot predictions with high accuracy. Comprehensive analysis across all major leagues and tournaments.',
        primaryImageOfPage: {
          '@id': 'https://sokapulse.com/predictions/pepeatips#primaryimage'
        },
        image: {
          '@id': 'https://sokapulse.com/predictions/pepeatips#primaryimage'
        },
        thumbnailUrl: 'https://sokapulse.com/images/pepeatips.jpg',
        datePublished: '2025-03-20T18:54:21+00:00',
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': 'https://sokapulse.com/predictions/pepeatips#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://sokapulse.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Predictions',
              item: 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Pepeatips',
              item: 'https://sokapulse.com/predictions/pepeatips'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/pepeatips#primaryimage',
        inLanguage: 'en-US',
        url: 'https://sokapulse.com/images/pepeatips.jpg',
        contentUrl: 'https://sokapulse.com/images/pepeatips.jpg',
        width: 1200,
        height: 630,
        caption: 'Pepeatips Today and Pepea Jackpot Predictions'
      }
    ]
  },

   // 254suretips schema
   'predictions/254suretips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/254suretips',
        'url': 'https://sokapulse.com/predictions/254suretips',
        'name': '254suretips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest 254suretips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/254suretips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/254suretips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/254suretips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/254suretips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': '254suretips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/254suretips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': '254suretips',
            'item': 'https://sokapulse.com/predictions/254suretips'
          }
        ]
      }
    ]
  },

   // betagamers schema
   'predictions/betagamers': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betagamers',
        'url': 'https://sokapulse.com/predictions/betagamers',
        'name': 'Betagamers Football Predictions and Tips - sokapulse',
        'description': 'Get the latest betagamers football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betagamers#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betagamers#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betagamers#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betagamers#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betagamers Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betagamers#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betagamers',
            'item': 'https://sokapulse.com/predictions/betagamers'
          }
        ]
      }
    ]
  },
  // betsloaded schema
  'predictions/betsloaded': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betsloaded',
        'url': 'https://sokapulse.com/predictions/betsloaded',
        'name': 'Betsloaded Football Predictions and Tips - sokapulse',
        'description': 'Get the latest betsloaded football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betsloaded#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betsloaded#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betsloaded#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betsloaded#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betsloaded Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betsloaded#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betsloaded',
            'item': 'https://sokapulse.com/predictions/betsloaded'
          }
        ]
      }
    ]
  },
  // betstudy schema
  'predictions/betstudy': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/betstudy',
        'url': 'https://sokapulse.com/predictions/betstudy',
        'name': 'Betstudy Football Predictions and Tips - sokapulse',
        'description': 'Get the latest betstudy football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/betstudy#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/betstudy#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/betstudy#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/betstudy#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Betstudy Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/betstudy#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Betstudy',
            'item': 'https://sokapulse.com/predictions/betstudy'
          }
        ]
      }
    ]
  },
  // clevertips schema
  'predictions/clevertips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/clevertips',
        'url': 'https://sokapulse.com/predictions/clevertips',
        'name': 'Clevertips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest clevertips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/clevertips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/clevertips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/clevertips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/clevertips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Clevertips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/clevertips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Clevertips',
            'item': 'https://sokapulse.com/predictions/clevertips'
          }
        ]
      }
    ]
  },
  // eagle-predict schema
  'predictions/eagle-predict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/eagle-predict',
        'url': 'https://sokapulse.com/predictions/eagle-predict',
        'name': 'Eagle-predict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest eagle-predict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/eagle-predict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/eagle-predict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/eagle-predict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/eagle-predict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Eagle-predict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/eagle-predict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Eagle-predict',
            'item': 'https://sokapulse.com/predictions/eagle-predict'
          }
        ]
      }
    ]
  },
  // fcpredict schema
  'predictions/fcpredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/fcpredict',
        'url': 'https://sokapulse.com/predictions/fcpredict',
        'name': 'Fcpredict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest fcpredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/fcpredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/fcpredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/fcpredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/fcpredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Fcpredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/fcpredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Fcpredict',
            'item': 'https://sokapulse.com/predictions/fcpredict'
          }
        ]
      }
    ]
  },
  // feedinco schema
  'predictions/feedinco': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/feedinco',
        'url': 'https://sokapulse.com/predictions/feedinco',
        'name': 'Feedinco Football Predictions and Tips - sokapulse',
        'description': 'Get the latest feedinco football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/feedinco#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/feedinco#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/feedinco#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/feedinco#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Feedinco Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/feedinco#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Feedinco',
            'item': 'https://sokapulse.com/predictions/feedinco'
          }
        ]
      }
    ]
  },
  // fizzley-tips schema
  'predictions/fizzley-tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/fizzley-tips',
        'url': 'https://sokapulse.com/predictions/fizzley-tips',
        'name': 'Fizzley-tips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest fizzley-tips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/fizzley-tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/fizzley-tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/fizzley-tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/fizzley-tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Fizzley-tips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/fizzley-tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Fizzley-tips',
            'item': 'https://sokapulse.com/predictions/fizzley-tips'
          }
        ]
      }
    ]
  },
  // foobol schema
  'predictions/foobol': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/foobol',
        'url': 'https://sokapulse.com/predictions/foobol',
        'name': 'Foobol Football Predictions and Tips - sokapulse',
        'description': 'Get the latest foobol football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/foobol#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/foobol#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/foobol#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/foobol#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Foobol Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/foobol#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Foobol',
            'item': 'https://sokapulse.com/predictions/foobol'
          }
        ]
      }
    ]
  },
  // football-expert schema
  'predictions/football-expert': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/football-expert',
        'url': 'https://sokapulse.com/predictions/football-expert',
        'name': 'Football-expert Football Predictions and Tips - sokapulse',
        'description': 'Get the latest football-expert football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/football-expert#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/football-expert#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/football-expert#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/football-expert#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Football-expert Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/football-expert#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Football-expert',
            'item': 'https://sokapulse.com/predictions/football-expert'
          }
        ]
      }
    ]
  },
  // football-super-tips schema
  'predictions/football-super-tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/football-super-tips',
        'url': 'https://sokapulse.com/predictions/football-super-tips',
        'name': 'Football-super-tips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest football-super-tips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/football-super-tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/football-super-tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/football-super-tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/football-super-tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Football-super-tips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/football-super-tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Football-super-tips',
            'item': 'https://sokapulse.com/predictions/football-super-tips'
          }
        ]
      }
    ]
  },
  // football-whispers schema
  'predictions/football-whispers': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/football-whispers',
        'url': 'https://sokapulse.com/predictions/football-whispers',
        'name': 'Football-whispers Football Predictions and Tips - sokapulse',
        'description': 'Get the latest football-whispers football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/football-whispers#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/football-whispers#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/football-whispers#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/football-whispers#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Football-whispers Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/football-whispers#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Football-whispers',
            'item': 'https://sokapulse.com/predictions/football-whispers'
          }
        ]
      }
    ]
  },
  // frybet schema
  'predictions/frybet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/frybet',
        'url': 'https://sokapulse.com/predictions/frybet',
        'name': 'Frybet Football Predictions and Tips - sokapulse',
        'description': 'Get the latest frybet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/frybet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/frybet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/frybet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/frybet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Frybet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/frybet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Frybet',
            'item': 'https://sokapulse.com/predictions/frybet'
          }
        ]
      }
    ]
  },
  // fulltime-predict schema
  'predictions/fulltime-predict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/fulltime-predict',
        'url': 'https://sokapulse.com/predictions/fulltime-predict',
        'name': 'Fulltime-predict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest fulltime-predict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/fulltime-predict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/fulltime-predict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/fulltime-predict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/fulltime-predict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Fulltime-predict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/fulltime-predict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Fulltime-predict',
            'item': 'https://sokapulse.com/predictions/fulltime-predict'
          }
        ]
      }
    ]
  },
  // goal-goal-tips schema
  'predictions/goal-goal-tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/goal-goal-tips',
        'url': 'https://sokapulse.com/predictions/goal-goal-tips',
        'name': 'Goal-goal-tips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest goal-goal-tips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/goal-goal-tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/goal-goal-tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/goal-goal-tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/goal-goal-tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Goal-goal-tips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/goal-goal-tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Goal-goal-tips',
            'item': 'https://sokapulse.com/predictions/goal-goal-tips'
          }
        ]
      }
    ]
  },
  // hello-predict schema
  'predictions/hello-predict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/hello-predict',
        'url': 'https://sokapulse.com/predictions/hello-predict',
        'name': 'Hello-predict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest hello-predict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/hello-predict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/hello-predict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/hello-predict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/hello-predict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Hello-predict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/hello-predict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Hello-predict',
            'item': 'https://sokapulse.com/predictions/hello-predict'
          }
        ]
      }
    ]
  },
  // hostpredict schema
  'predictions/hostpredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/hostpredict',
        'url': 'https://sokapulse.com/predictions/hostpredict',
        'name': 'Hostpredict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest hostpredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/hostpredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/hostpredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/hostpredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/hostpredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Hostpredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/hostpredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Hostpredict',
            'item': 'https://sokapulse.com/predictions/hostpredict'
          }
        ]
      }
    ]
  },
  // kingspredict schema
  'predictions/kingspredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/kingspredict',
        'url': 'https://sokapulse.com/predictions/kingspredict',
        'name': 'Kingspredict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest kingspredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/kingspredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/kingspredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/kingspredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/kingspredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Kingspredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/kingspredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Kingspredict',
            'item': 'https://sokapulse.com/predictions/kingspredict'
          }
        ]
      }
    ]
  },
  // leaguelane schema
  'predictions/leaguelane': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/leaguelane',
        'url': 'https://sokapulse.com/predictions/leaguelane',
        'name': 'Leaguelane Football Predictions and Tips - sokapulse',
        'description': 'Get the latest leaguelane football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/leaguelane#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/leaguelane#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/leaguelane#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/leaguelane#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Leaguelane Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/leaguelane#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Leaguelane',
            'item': 'https://sokapulse.com/predictions/leaguelane'
          }
        ]
      }
    ]
  },
  // meritpredict schema
  'predictions/meritpredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/meritpredict',
        'url': 'https://sokapulse.com/predictions/meritpredict',
        'name': 'Meritpredict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest meritpredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/meritpredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/meritpredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/meritpredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/meritpredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Meritpredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/meritpredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Meritpredict',
            'item': 'https://sokapulse.com/predictions/meritpredict'
          }
        ]
      }
    ]
  },
  // mybets-today schema
  'predictions/mybets-today': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/mybets-today',
        'url': 'https://sokapulse.com/predictions/mybets-today',
        'name': 'Mybets-today Football Predictions and Tips - sokapulse',
        'description': 'Get the latest mybets-today football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/mybets-today#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/mybets-today#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/mybets-today#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/mybets-today#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Mybets-today Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/mybets-today#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Mybets-today',
            'item': 'https://sokapulse.com/predictions/mybets-today'
          }
        ]
      }
    ]
  },
  // nora-bet schema
  'predictions/nora-bet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/nora-bet',
        'url': 'https://sokapulse.com/predictions/nora-bet',
        'name': 'Nora-bet Football Predictions and Tips - sokapulse',
        'description': 'Get the latest nora-bet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/nora-bet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/nora-bet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/nora-bet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/nora-bet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Nora-bet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/nora-bet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Nora-bet',
            'item': 'https://sokapulse.com/predictions/nora-bet'
          }
        ]
      }
    ]
  },
  // odds-lot schema
  'predictions/odds-lot': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/odds-lot',
        'url': 'https://sokapulse.com/predictions/odds-lot',
        'name': 'Odds-lot Football Predictions and Tips - sokapulse',
        'description': 'Get the latest odds-lot football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/odds-lot#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/odds-lot#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/odds-lot#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/odds-lot#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Odds-lot Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/odds-lot#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Odds-lot',
            'item': 'https://sokapulse.com/predictions/odds-lot'
          }
        ]
      }
    ]
  },
  // over25tips schema
  'predictions/over25tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/over25tips',
        'url': 'https://sokapulse.com/predictions/over25tips',
        'name': 'Over25tips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest over25tips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/over25tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/over25tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/over25tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/over25tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Over25tips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/over25tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Over25tips',
            'item': 'https://sokapulse.com/predictions/over25tips'
          }
        ]
      }
    ]
  },
  // pepea-tips schema
  'predictions/pepea-tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/pepea-tips',
        'url': 'https://sokapulse.com/predictions/pepea-tips',
        'name': 'Pepea-tips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest pepea-tips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/pepea-tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/pepea-tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/pepea-tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/pepea-tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Pepea-tips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/pepea-tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Pepea-tips',
            'item': 'https://sokapulse.com/predictions/pepea-tips'
          }
        ]
      }
    ]
  },
  // pesaodds schema
  'predictions/pesaodds': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/pesaodds',
        'url': 'https://sokapulse.com/predictions/pesaodds',
        'name': 'Pesaodds Football Predictions and Tips - sokapulse',
        'description': 'Get the latest pesaodds football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/pesaodds#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/pesaodds#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/pesaodds#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/pesaodds#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Pesaodds Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/pesaodds#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Pesaodds',
            'item': 'https://sokapulse.com/predictions/pesaodds'
          }
        ]
      }
    ]
  },
  // pokeabet schema
  'predictions/pokeabet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/pokeabet',
        'url': 'https://sokapulse.com/predictions/pokeabet',
        'name': 'Pokeabet Football Predictions and Tips - sokapulse',
        'description': 'Get the latest pokeabet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/pokeabet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/pokeabet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/pokeabet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/pokeabet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Pokeabet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/pokeabet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Pokeabet',
            'item': 'https://sokapulse.com/predictions/pokeabet'
          }
        ]
      }
    ]
  },
  // r2bet schema
  'predictions/r2bet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/r2bet',
        'url': 'https://sokapulse.com/predictions/r2bet',
        'name': 'R2bet Football Predictions and Tips - sokapulse',
        'description': 'Get the latest r2bet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/r2bet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/r2bet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/r2bet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/r2bet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'R2bet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/r2bet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'R2bet',
            'item': 'https://sokapulse.com/predictions/r2bet'
          }
        ]
      }
    ]
  },
  // rowdie schema
  'predictions/rowdie': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/rowdie',
        'url': 'https://sokapulse.com/predictions/rowdie',
        'name': 'Rowdie Football Predictions and Tips - sokapulse',
        'description': 'Get the latest rowdie football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/rowdie#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/rowdie#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/rowdie#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/rowdie#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Rowdie Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/rowdie#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Rowdie',
            'item': 'https://sokapulse.com/predictions/rowdie'
          }
        ]
      }
    ]
  },
  // safe-draw schema
  'predictions/safe-draw': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/safe-draw',
        'url': 'https://sokapulse.com/predictions/safe-draw',
        'name': 'Safe-draw Football Predictions and Tips - sokapulse',
        'description': 'Get the latest safe-draw football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/safe-draw#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/safe-draw#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/safe-draw#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/safe-draw#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Safe-draw Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/safe-draw#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Safe-draw',
            'item': 'https://sokapulse.com/predictions/safe-draw'
          }
        ]
      }
    ]
  },
  // sempredict schema
  'predictions/sempredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sempredict',
        'url': 'https://sokapulse.com/predictions/sempredict',
        'name': 'Sempredict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sempredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sempredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sempredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sempredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sempredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sempredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sempredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sempredict',
            'item': 'https://sokapulse.com/predictions/sempredict'
          }
        ]
      }
    ]
  },
  // smartbet schema
  'predictions/smartbet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/smartbet',
        'url': 'https://sokapulse.com/predictions/smartbet',
        'name': 'Smartbet Football Predictions and Tips - sokapulse',
        'description': 'Get the latest smartbet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/smartbet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/smartbet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/smartbet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/smartbet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Smartbet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/smartbet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Smartbet',
            'item': 'https://sokapulse.com/predictions/smartbet'
          }
        ]
      }
    ]
  },
  // soccereco schema
  'predictions/soccereco': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/soccereco',
        'url': 'https://sokapulse.com/predictions/soccereco',
        'name': 'Soccereco Football Predictions and Tips - sokapulse',
        'description': 'Get the latest soccereco football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/soccereco#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/soccereco#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/soccereco#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/soccereco#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Soccereco Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/soccereco#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Soccereco',
            'item': 'https://sokapulse.com/predictions/soccereco'
          }
        ]
      }
    ]
  },
  // sokapro schema
  'predictions/sokapro': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sokapro',
        'url': 'https://sokapulse.com/predictions/sokapro',
        'name': 'Sokapro Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sokapro football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sokapro#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sokapro#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sokapro#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sokapro#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sokapro Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sokapro#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sokapro',
            'item': 'https://sokapulse.com/predictions/sokapro'
          }
        ]
      }
    ]
  },
  // sokasmart schema
  'predictions/sokasmart': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sokasmart',
        'url': 'https://sokapulse.com/predictions/sokasmart',
        'name': 'Sokasmart Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sokasmart football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sokasmart#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sokasmart#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sokasmart#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sokasmart#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sokasmart Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sokasmart#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sokasmart',
            'item': 'https://sokapulse.com/predictions/sokasmart'
          }
        ]
      }
    ]
  },
  // sokatips schema
  'predictions/sokatips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sokatips',
        'url': 'https://sokapulse.com/predictions/sokatips',
        'name': 'Sokatips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sokatips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sokatips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sokatips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sokatips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sokatips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sokatips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sokatips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sokatips',
            'item': 'https://sokapulse.com/predictions/sokatips'
          }
        ]
      }
    ]
  },
  // sportsmole schema
  'predictions/sportsmole': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sportsmole',
        'url': 'https://sokapulse.com/predictions/sportsmole',
        'name': 'Sportsmole Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sportsmole football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sportsmole#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sportsmole#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sportsmole#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sportsmole#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sportsmole Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sportsmole#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sportsmole',
            'item': 'https://sokapulse.com/predictions/sportsmole'
          }
        ]
      }
    ]
  },
  // sporttips schema
  'predictions/sporttips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sporttips',
        'url': 'https://sokapulse.com/predictions/sporttips',
        'name': 'Sporttips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sporttips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sporttips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sporttips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sporttips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sporttips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sporttips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sporttips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sporttips',
            'item': 'https://sokapulse.com/predictions/sporttips'
          }
        ]
      }
    ]
  },
  // sporttrader schema
  'predictions/sporttrader': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sporttrader',
        'url': 'https://sokapulse.com/predictions/sporttrader',
        'name': 'Sporttrader Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sporttrader football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sporttrader#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sporttrader#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sporttrader#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sporttrader#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sporttrader Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sporttrader#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sporttrader',
            'item': 'https://sokapulse.com/predictions/sporttrader'
          }
        ]
      }
    ]
  },
  // sportus schema
  'predictions/sportus': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sportus',
        'url': 'https://sokapulse.com/predictions/sportus',
        'name': 'Sportus Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sportus football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sportus#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sportus#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sportus#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sportus#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sportus Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sportus#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sportus',
            'item': 'https://sokapulse.com/predictions/sportus'
          }
        ]
      }
    ]
  },
  // sportverified schema
  'predictions/sportverified': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sportverified',
        'url': 'https://sokapulse.com/predictions/sportverified',
        'name': 'Sportverified Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sportverified football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sportverified#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sportverified#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sportverified#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sportverified#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sportverified Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sportverified#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sportverified',
            'item': 'https://sokapulse.com/predictions/sportverified'
          }
        ]
      }
    ]
  },
  // stakegains schema
  'predictions/stakegains': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/stakegains',
        'url': 'https://sokapulse.com/predictions/stakegains',
        'name': 'Stakegains Football Predictions and Tips - sokapulse',
        'description': 'Get the latest stakegains football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/stakegains#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/stakegains#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/stakegains#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/stakegains#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Stakegains Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/stakegains#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Stakegains',
            'item': 'https://sokapulse.com/predictions/stakegains'
          }
        ]
      }
    ]
  },
  // stats24 schema
  'predictions/stats24': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/stats24',
        'url': 'https://sokapulse.com/predictions/stats24',
        'name': 'Stats24 Football Predictions and Tips - sokapulse',
        'description': 'Get the latest stats24 football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/stats24#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/stats24#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/stats24#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/stats24#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Stats24 Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/stats24#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Stats24',
            'item': 'https://sokapulse.com/predictions/stats24'
          }
        ]
      }
    ]
  },
  // sure-bet schema
  'predictions/sure-bet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/sure-bet',
        'url': 'https://sokapulse.com/predictions/sure-bet',
        'name': 'Sure-Bet Football Predictions and Tips - sokapulse',
        'description': 'Get the latest sure-bet football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/sure-bet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/sure-bet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/sure-bet#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/sure-bet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Sure-Bet Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/sure-bet#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Sure-Bet',
            'item': 'https://sokapulse.com/predictions/sure-bet'
          }
        ]
      }
    ]
  },
  // taifa-tips schema
  'predictions/taifa-tips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/taifa-tips',
        'url': 'https://sokapulse.com/predictions/taifa-tips',
        'name': 'Taifa-Tips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest taifa-tips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/taifa-tips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/taifa-tips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/taifa-tips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/taifa-tips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Taifa-Tips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/taifa-tips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Taifa-Tips',
            'item': 'https://sokapulse.com/predictions/taifa-tips'
          }
        ]
      }
    ]
  },
  // tips-gg schema
  'predictions/tips-gg': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/tips-gg',
        'url': 'https://sokapulse.com/predictions/tips-gg',
        'name': 'Tips-Gg Football Predictions and Tips - sokapulse',
        'description': 'Get the latest tips-gg football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/tips-gg#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/tips-gg#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/tips-gg#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/tips-gg#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Tips-Gg Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/tips-gg#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Tips-Gg',
            'item': 'https://sokapulse.com/predictions/tips-gg'
          }
        ]
      }
    ]
  },
  // topbetpredict schema
  'predictions/topbetpredict': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/topbetpredict',
        'url': 'https://sokapulse.com/predictions/topbetpredict',
        'name': 'Topbetpredict Football Predictions and Tips - sokapulse',
        'description': 'Get the latest topbetpredict football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/topbetpredict#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/topbetpredict#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/topbetpredict#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/topbetpredict#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Topbetpredict Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/topbetpredict#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Topbetpredict',
            'item': 'https://sokapulse.com/predictions/topbetpredict'
          }
        ]
      }
    ]
  },
  // typersi schema
  'predictions/typersi': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/typersi',
        'url': 'https://sokapulse.com/predictions/typersi',
        'name': 'Typersi Football Predictions and Tips - sokapulse',
        'description': 'Get the latest typersi football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/typersi#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/typersi#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/typersi#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/typersi#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Typersi Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/typersi#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Typersi',
            'item': 'https://sokapulse.com/predictions/typersi'
          }
        ]
      }
    ]
  },
  // virtualbet24 schema
  'predictions/virtualbet24': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/virtualbet24',
        'url': 'https://sokapulse.com/predictions/virtualbet24',
        'name': 'Virtualbet24 Football Predictions and Tips - sokapulse',
        'description': 'Get the latest virtualbet24 football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/virtualbet24#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/virtualbet24#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/virtualbet24#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/virtualbet24#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Virtualbet24 Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/virtualbet24#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Virtualbet24',
            'item': 'https://sokapulse.com/predictions/virtualbet24'
          }
        ]
      }
    ]
  },
  // winabettips schema
  'predictions/winabettips': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/winabettips',
        'url': 'https://sokapulse.com/predictions/winabettips',
        'name': 'Winabettips Football Predictions and Tips - sokapulse',
        'description': 'Get the latest winabettips football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/winabettips#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/winabettips#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/winabettips#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/winabettips#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Winabettips Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/winabettips#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Winabettips',
            'item': 'https://sokapulse.com/predictions/winabettips'
          }
        ]
      }
    ]
  },
  // windrawwin schema
  'predictions/windrawwin': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/windrawwin',
        'url': 'https://sokapulse.com/predictions/windrawwin',
        'name': 'Windrawwin Football Predictions and Tips - sokapulse',
        'description': 'Get the latest windrawwin football predictions and tips for today\'s matches. Accurate football predictions, statistics, and analysis.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/windrawwin#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/windrawwin#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@id': 'https://sokapulse.com/predictions/windrawwin#breadcrumb'
        }
      },
      {
        '@type': 'ImageObject',
        'inLanguage': 'en-US',
        '@id': 'https://sokapulse.com/predictions/windrawwin#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'contentUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Windrawwin Football Predictions'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sokapulse.com/predictions/windrawwin#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sokapulse.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Predictions',
            'item': 'https://sokapulse.com/predictions'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Windrawwin',
            'item': 'https://sokapulse.com/predictions/windrawwin'
          }
        ]
      }
    ]
  },


  // Zakabet schema
  'predictions/zakabet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/zakabet',
        'url': 'https://sokapulse.com/predictions/zakabet',
        'name': 'Zakabet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Zakabet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/zakabet#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/zakabet#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sokapulse.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Predictions',
              'item': 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Zakabet'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/zakabet#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Zakabet Football Predictions'
      }
    ]
  },
  // OneXBet schema
  'predictions/onexbet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/1xbet-jackpot-predictions',
        'url': 'https://sokapulse.com/predictions/1xbet-jackpot-predictions',
        'name': '1XBet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest 1XBet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/1xbet-jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/1xbet-jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sokapulse.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Predictions',
              'item': 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': '1XBet'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/1xbet-jackpot-predictions#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': '1XBet Football Predictions'
      }
    ]
  },
  // Dafabet schema
  'predictions/dafabet': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/dafabet-jackpot-predictions',
        'url': 'https://sokapulse.com/predictions/dafabet-jackpot-predictions',
        'name': 'Dafabet Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Dafabet tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/dafabet-jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/dafabet-jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sokapulse.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Predictions',
              'item': 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Dafabet'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/dafabet-jackpot-predictions#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Dafabet Football Predictions'
      }
    ]
  },
  // Mozzart Super Jackpot schema
  'predictions/mozzart-super-jackpot-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/mozzart-super-jackpot-predictions',
        'url': 'https://sokapulse.com/predictions/mozzart-super-jackpot-predictions',
        'name': 'Mozzart Super Jackpot Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Mozzart Super Jackpot tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/mozzart-super-jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/mozzart-super-jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sokapulse.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Predictions',
              'item': 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Mozzart Super Jackpot'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/mozzart-super-jackpot-predictions#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Mozzart Super Jackpot Football Predictions'
      }
    ]
  },
  // Mozzart Grand Jackpot schema
  'predictions/mozzart-grand-jackpot-predictions': {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://sokapulse.com/predictions/mozzart-grand-jackpot-predictions',
        'url': 'https://sokapulse.com/predictions/mozzart-grand-jackpot-predictions',
        'name': 'Mozzart Grand Jackpot Tips Today Prediction and Jackpot Predictions - SokaPulse',
        'description': 'Get the latest Mozzart Grand Jackpot tips, predictions and jackpot predictions for today\'s football matches.',
        'isPartOf': {
          '@id': 'https://sokapulse.com/#website'
        },
        'primaryImageOfPage': {
          '@id': 'https://sokapulse.com/predictions/mozzart-grand-jackpot-predictions#primaryimage'
        },
        'image': {
          '@id': 'https://sokapulse.com/predictions/mozzart-grand-jackpot-predictions#primaryimage'
        },
        'thumbnailUrl': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'datePublished': '2025-03-20T18:54:21+00:00',
        
        'inLanguage': 'en-US',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sokapulse.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Predictions',
              'item': 'https://sokapulse.com/predictions'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Mozzart Grand Jackpot'
            }
          ]
        }
      },
      {
        '@type': 'ImageObject',
        '@id': 'https://sokapulse.com/predictions/mozzart-grand-jackpot-predictions#primaryimage',
        'url': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
        'width': 1024,
        'height': 768,
        'caption': 'Mozzart Grand Jackpot Football Predictions'
      }
    ]
  },
};

// Export metadata for the main layout
export const metadata = {
  title: 'SokaPulse - Football Predictions, Tips & Live Scores',
  description: 'Get free football predictions, live scores, and in-depth analysis for matches across major leagues. Powered by AI with high accuracy.',
  icons: {
    icon: [
      { url: '/assets/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/images/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/images/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/assets/images/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/assets/images/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/assets/images/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/assets/images/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/assets/images/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/assets/images/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/assets/images/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/assets/images/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/assets/images/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'msapplication-TileImage', url: '/assets/images/ms-icon-144x144.png' },
    ],
  },
  manifest: '/assets/images/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SokaPulse - Football Predictions',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SokaPulse',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'application-name': 'SokaPulse',
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
  },
  meta: {
    'og:image': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
    'og:image:width': '1024',
    'og:image:height': '768',
    'twitter:card': 'summary_large_image',
    'twitter:image': 'https://www.sportpesa-tips.com/wp-content/uploads/2025/03/sokapulse.jpeg',
  },
};

// Define route segment config for root layout
export const revalidate = 3600; // Revalidate every hour

export default async function RootLayout({ children }) {
  // Get the current pathname
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Determine which schema to use based on pathname
  let schemaKey = pathname === '/' ? 'organization' : pathname.replace(/^\//, '');
  
  // Check if the path starts with any of our main prediction paths
  const mainPredictionPaths = [
    'today-football-predictions',
    'tomorrow-football-predictions',
    'weekend-football-predictions',
    'jackpot-predictions',
    'jackpot-match-details',
    'live-football-predictions',
    'yesterday-football-predictions',
    'top-trends',
    'about-us',
    'contact-us',
    'terms-of-use',
    'privacy-policy',
    'top-football-predictions',
    'football-predictions-grouped-by-leagues',
    'favourite-predictions',
    'search-results',
    'upcoming-football-predictions',
    'football-predictions',
    'football-predictions/country',
    'football-predictions/league',
    'football-prediction-for-date'
  ];

  // If the path starts with any of our main prediction paths, use that schema
  for (const mainPath of mainPredictionPaths) {
    if (schemaKey.startsWith(mainPath)) {
      schemaKey = mainPath;
      break;
    }
  }
  
  // Default to organization schema if no specific schema is found
  const currentSchema = schemas[schemaKey] || schemas['organization'];

  return (
    <html lang="en">
      <head>
      <meta name="google-adsense-account" content="ca-pub-6415640710219864"/>
        <link rel="dns-prefetch" href="https://jackpot-predictions.com" />
        <link rel="preconnect" href="https://jackpot-predictions.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="SokaPulse" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/assets/images/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/images/android-icon-192x192.png" />
        
        {/* Preload PWA resources */}
        <link rel="preload" href="/pwa-init.js" as="script" />
        <link rel="preload" href="/pwa-styles.css" as="style" />
        
        {/* Favicon links - Handled by Next.js metadata */}
        <link rel="stylesheet" href="/pwa-styles.css" />
        
        {/* PWA Initialization Script - Load earlier for better performance */}
        <Script id="pwa-init" strategy="afterInteractive" src="/pwa-init.js" />
        <Script id="promo-banner" strategy="afterInteractive" src="/promo-banner-app.js" />
        
        <Script
          id="adsbygoogle-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6415640710219864"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* LCP Optimization - Make sure main heading renders immediately */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Ensure text is visible immediately */
          #main-heading {
            font-display: swap;
            display: block;
            visibility: visible !important;
            content-visibility: auto;
          }
          
          /* Pre-layout for LCP element to avoid layout shift */
          .table-cell h1 {
            min-height: 22px;
          }
        `}} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(currentSchema)
          }}
        />
      </head>
      <body suppressHydrationWarning data-theme="light">
        <GoogleAutoAds />
        <ThemeProvider>
          <SidebarProvider>
            <Navbar />
            <div className="container container-mob" >
              <div id="wrapper" className="d-flex">
                <Sidebar />
                <div id="page-content-wrapper">
                  {children}
                </div>
              </div>
            </div>
            {/* <div className="mobile-bottom-ad">
                <a id="mobileAdLink" href="https://moy.auraodin.com/redirect.aspx?pid=139161&bid=1715" target="_blank" rel="noopener noreferrer" className="mobile-ad-link">
                    <img id="mobileAdImage" alt="22bet" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" className="mobile-ad-image" src="/assets/images/22bet_wide.webp" srcSet="/assets/images/22bet_wide.webp"/>
                    <div className="mobile-ad-text-content">
                        <p id="mobileAdTitle" className="mobile-ad-primary-text animate-bounce">Win up to KES 35000</p>
                        <p id="mobileAdDescription" className="mobile-ad-secondary-text">Register and get a bonus of up to 19000 KES for sports betting or up to 35000 KES for casino games right now!</p>
                    </div>
                    <div id="mobileAdButton" className="mobile-ad-register-button">Register</div>
                </a>
            </div>

            
            <div className="desktop-fixed-bottom-banner">
                <a id="desktopAdLink" href="https://moy.auraodin.com/redirect.aspx?pid=139161&bid=1715" target="_blank" rel="noopener noreferrer" className="desktop-ad-link">
                    <img id="desktopAdImage" alt="22bet" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" className="desktop-ad-image" src="/assets/images/22bet_wide.webp" srcSet="/assets/images/22bet_wide.webp"/>
                    <div className="desktop-ad-text-content">
                        <p id="desktopAdTitle" className="desktop-ad-primary-text animate-bounce">Play Aviator on 22Bet - Win up to 1,300,000 KES!</p>
                        <p id="desktopAdDescription" className="desktop-ad-secondary-text">Register now and grab a 47,000 KES welcome bonus to start flying high with big wins! T&amp;C Apply.</p>
                    </div>
                    <div id="desktopAdButton" className="desktop-ad-register-button">Register</div>
                </a>
            </div> */}

          <div className="mobile-bottom-ad">
                <button id="mobileAdCloseBtn" type="button" className="mobile-ad-close-btn" aria-label="Close Ad">&times;</button>
                <a id="mobileAdLink" href="https://play.google.com/store/apps/details?id=ke.app.sportpesa&referrer=utm_source%3Dsokapulse%26utm_medium%3Dwebsite%26utm_campaign%3Dapp_download%26utm_content%3Dmain_banner" target="_blank" rel="noopener noreferrer" className="mobile-ad-link">
                    <img id="mobileAdImage" alt="app promo" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" className="mobile-ad-image" src="/assets/images/app_promos.webp" srcSet="/assets/images/app_promos.webp"/>
                    <div className="mobile-ad-text-content">
                        <p id="mobileAdTitle" className="mobile-ad-primary-text animate-bounce">Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!</p>
                        <p id="mobileAdDescription" className="mobile-ad-secondary-text">Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!</p>
                    </div>
                    <div id="mobileAdButton" className="mobile-ad-register-button">Download App</div>
                </a>
            </div>

            
            <div className="desktop-fixed-bottom-banner">
            <button id="desktopAdCloseBtn" type="button" className="desktop-ad-close-btn" aria-label="Close Ad">&times;</button>
            <a id="desktopAdLink" href="https://play.google.com/store/apps/details?id=ke.app.sportpesa&referrer=utm_source%3Dsokapulse%26utm_medium%3Dwebsite%26utm_campaign%3Dapp_download%26utm_content%3Dmain_banner" target="_blank" rel="noopener noreferrer" className="desktop-ad-link">
                    <img id="desktopAdImage" alt="app promo" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" className="desktop-ad-image" src="/assets/images/app_promos.webp" srcSet="/assets/images/app_promos.webp"/>
                    <div className="desktop-ad-text-content">
                        <p id="desktopAdTitle" className="desktop-ad-primary-text animate-bounce">Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!</p>
                        <p id="desktopAdDescription" className="desktop-ad-secondary-text">Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!</p>
                    </div>
                    <div id="desktopAdButton" className="desktop-ad-register-button">Download App</div>
                </a>
            </div>

            <Footer />
            {/* <Popup /> Added 1xBet Popup component here */}
          </SidebarProvider>
        </ThemeProvider>

        {/* OneSignal Push Notifications - Load with lowest priority */}
        <Script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          strategy="lazyOnload"
          id="onesignal-sdk"
        />
        <Script id="onesignal-init" strategy="lazyOnload">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "04fda3d6-fbb9-4adf-a7c4-ae6bf37d44a3",
              });
            });
          `}
        </Script>

        {/* Back to Top functionality */}
        <Script id="back-to-top" strategy="afterInteractive">
          {`
            (function() {
              function initBackToTop() {
                // Back to top functionality
                const backToTopButton = document.getElementById('back-to-top');
                if (backToTopButton) {
                  window.addEventListener('scroll', function() {
                    if (window.scrollY > 300) {
                      backToTopButton.classList.add('show');
                    } else {
                      backToTopButton.classList.remove('show');
                    }
                  });
                  
                  backToTopButton.addEventListener('click', function() {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                  });
                }
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initBackToTop);
              } else {
                initBackToTop();
              }
            })();
          `}
        </Script>

        {/* PWA Debug Tool - Only loads when ?pwa-debug=true is in the URL */}
        <Script 
          id="pwa-debug" 
          strategy="lazyOnload" 
          src="/pwa-debug.js"
          data-condition="url-contains=pwa-debug"
        />

        {/* Daily PWA Prompt - Shows install prompt at most once per day */}
        <Script 
          id="daily-pwa-prompt" 
          strategy="lazyOnload" 
          src="/daily-pwa-prompt.js"
        />

        {/* Google Analytics - Defer but load before other non-critical scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WHLRE808B9"
          strategy="afterInteractive"
          id="gtag-script"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WHLRE808B9');
          `}
        </Script>

        <AdManager />

        {/* Cookie Consent Banner */}
        {/* <Script
          src="/cookie-consent.js"
          strategy="lazyOnload"
          id="cookie-consent-script"
        /> */}
      </body>
    </html>
  );
}