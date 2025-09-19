/**
 * Template for SEO Content Pages
 * 
 * Copy this file and customize it for new page types.
 * Replace all instances of "PAGETYPE" with your page type (e.g., "weekend", "live", etc.)
 */
import { DEFAULT_PREDICTION_LINKS, DEFAULT_LEAGUE_LINKS } from '../schema';

const pagetypeContent = {
  title: 'PAGETYPE Football Predictions',
  description: 'Description for PAGETYPE football predictions. Customize this text to be unique for this page type.',
  features: [
    'PAGETYPE feature 1',
    'PAGETYPE feature 2',
    'PAGETYPE feature 3',
    'PAGETYPE feature 4',
    'PAGETYPE feature 5',
    'PAGETYPE feature 6'
  ],
  accuracy: 'PAGETYPE predictions have an accuracy rate of over X%',
  specialFeature: 'Special feature for PAGETYPE',
  sections: [
    {
      id: 'section-1-id',
      title: 'Section 1 Title',
      content: `Content for section 1. This should be unique for PAGETYPE.`
    },
    {
      id: 'section-2-id',
      title: 'Section 2 Title',
      content: `Content for section 2. This should be unique for PAGETYPE.`
    },
    {
      id: 'section-3-id',
      title: 'Section 3 Title',
      content: `Content for section 3. This should be unique for PAGETYPE.`
    }
  ],
  faqs: [
    {
      question: 'FAQ Question 1 for PAGETYPE?',
      answer: 'Answer to FAQ question 1 for PAGETYPE.'
    },
    {
      question: 'FAQ Question 2 for PAGETYPE?',
      answer: 'Answer to FAQ question 2 for PAGETYPE.'
    },
    {
      question: 'FAQ Question 3 for PAGETYPE?',
      answer: 'Answer to FAQ question 3 for PAGETYPE.'
    }
  ],
  predictionLinks: [
    // Customize these links to exclude the current page type
    { href: '/today-football-predictions', text: 'Today Predictions' },
    { href: '/tomorrow-football-predictions', text: 'Tomorrow Predictions' },
    { href: '/weekend-football-predictions', text: 'Weekend Predictions' },
    { href: '/top-football-predictions', text: 'Top Predictions' },
    { href: '/live-football-predictions', text: 'Live Predictions' },
    { href: '/yesterday-football-predictions', text: 'Yesterday Predictions' }
  ],
  leagueLinks: DEFAULT_LEAGUE_LINKS,
  keywords: [
    'PAGETYPE football predictions',
    'football predictions PAGETYPE',
    'free football predictions PAGETYPE',
    'soccer predictions PAGETYPE',
    'football tips PAGETYPE',
    'football betting tips PAGETYPE',
    'PAGETYPE football matches',
    'accurate football predictions PAGETYPE'
  ],
  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'PAGETYPE Football Predictions - SokaPulse',
    description: 'Description for PAGETYPE football predictions. Customize this text to be unique for this page type.',
    url: 'https://sokapulse.com/PAGETYPE-football-predictions',
    publisher: {
      '@type': 'Organization',
      name: 'SokaPulse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sokapulse.com/logo.png'
      }
    },
    mainEntity: {
      '@type': 'SportsEvent',
      name: 'PAGETYPE Football Matches',
      description: 'Football matches and predictions for PAGETYPE',
      sport: 'Football'
    }
  }
};

export default pagetypeContent; 