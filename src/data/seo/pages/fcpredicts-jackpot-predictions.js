/**
 * Fcpredicts Jackpot Predictions Page SEO Content
 */
import { DEFAULT_PREDICTION_LINKS, DEFAULT_LEAGUE_LINKS } from '../schema';

const fcpredictsJackpotContent = {
  title: 'Fcpredicts Jackpot Predictions & Expert Insights | SokaPulse',
  description: 'Human-written Fcpredicts Jackpot Predictions with disciplined thinking, safer options, and pre-kickoff updates.',
  features: [ 'Primary picks with confidence notes', 'Safer routes (DC/DNB) when variance spikes', 'Updated before kickoff' ],
  accuracy: 'We aim for clarity and consistency, not shortcuts.',
  specialFeature: 'Practical jackpot insights with value awareness',
  sections: [ { id: 'fcp-intro', title: 'Fcpredicts Jackpot Predictions You Can Trust', content: `We weigh form, tactical fit, motivation, and market context—then update when team news drops.` } ],
  predictionLinks: [ { href: '/jackpot-predictions', text: 'More Jackpot Predictions' } ],
  leagueLinks: DEFAULT_LEAGUE_LINKS || [],
  keywords: [ 'Fcpredicts Jackpot Predictions', 'fcpredict jackpot tips', 'football predictions' ],
  schema: {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: 'Fcpredicts Jackpot Predictions & Expert Insights | SokaPulse',
    description: 'Fcpredicts Jackpot Predictions with human-written analysis and updates.',
    url: 'https://sokapulse.com/predictions/fcpredicts-jackpot-predictions',
    datePublished: new Date().toISOString(), dateModified: new Date().toISOString(),
    publisher: { '@type': 'Organization', name: 'SokaPulse', logo: { '@type': 'ImageObject', url: 'https://sokapulse.com/logo.png' } },
    breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sokapulse.com' },
      { '@type': 'ListItem', position: 2, name: 'Predictions', item: 'https://sokapulse.com/predictions' },
      { '@type': 'ListItem', position: 3, name: 'Fcpredicts Jackpot Predictions', item: 'https://sokapulse.com/predictions/fcpredicts-jackpot-predictions' }
    ] }
  }
};

export default fcpredictsJackpotContent; 