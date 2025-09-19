/**
 * Soccer-Rating Jackpot Predictions Page SEO Content
 */
import { DEFAULT_PREDICTION_LINKS, DEFAULT_LEAGUE_LINKS } from '../schema';

const soccerRatingJackpotContent = {
  title: 'Soccer-Rating Jackpot Predictions & Expert Insights | SokaPulse',
  description: 'Human-written Soccer-Rating Jackpot Predictions with data context, safer options, and clear reasoning.',
  features: [ 'Primary picks with confidence notes', 'Safer routes for tricky fixtures', 'Updates before kickoff' ],
  accuracy: 'We prioritize repeatable decisions and honest risk framing.',
  specialFeature: 'Straightforward match insights for jackpot slips',
  sections: [
    { id: 'sr-intro', title: 'Soccer-Rating Jackpot Predictions That Respect the Game', content: `We read the match as it is: tactics, form identity, and motivation, then adjust when news lands.` }
  ],
  predictionLinks: [ { href: '/jackpot-predictions', text: 'More Jackpot Predictions' } ],
  leagueLinks: DEFAULT_LEAGUE_LINKS || [],
  keywords: [ 'Soccer-Rating Jackpot Predictions', 'soccer rating jackpot tips', 'football predictions' ],
  schema: {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: 'Soccer-Rating Jackpot Predictions & Expert Insights | SokaPulse',
    description: 'Soccer-Rating Jackpot Predictions with human-written analysis and updates.',
    url: 'https://sokapulse.com/predictions/soccer-rating-jackpot-predictions',
    datePublished: new Date().toISOString(), dateModified: new Date().toISOString(),
    publisher: { '@type': 'Organization', name: 'SokaPulse', logo: { '@type': 'ImageObject', url: 'https://sokapulse.com/logo.png' } },
    breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sokapulse.com' },
      { '@type': 'ListItem', position: 2, name: 'Predictions', item: 'https://sokapulse.com/predictions' },
      { '@type': 'ListItem', position: 3, name: 'Soccer-Rating Jackpot Predictions', item: 'https://sokapulse.com/predictions/soccer-rating-jackpot-predictions' }
    ] }
  }
};

export default soccerRatingJackpotContent; 