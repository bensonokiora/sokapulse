/**
 * SEO Content Schema
 * 
 * This file defines the schema for SEO content across the site.
 * All SEO content should follow this structure for consistency.
 */

/**
 * @typedef {Object} SeoLink
 * @property {string} href - The URL to link to
 * @property {string} text - The display text for the link
 */

/**
 * @typedef {Object} SeoSection
 * @property {string} id - The HTML ID for the section (for anchor links)
 * @property {string} title - The section title
 * @property {string} content - The HTML content for the section
 * @property {string} [headingLevel='h2'] - The heading level (h2, h3, etc.)
 */

/**
 * @typedef {Object} SeoFaq
 * @property {string} question - The FAQ question
 * @property {string} answer - The HTML content for the answer
 */

/**
 * @typedef {Object} SeoContent
 * @property {string} title - The main title for the SEO content
 * @property {string} description - The main description paragraph
 * @property {string[]} features - List of features or prediction types
 * @property {string} accuracy - Statement about prediction accuracy
 * @property {string} specialFeature - Special feature highlight
 * @property {SeoSection[]} [sections] - Custom sections for the page
 * @property {SeoFaq[]} [faqs] - FAQs for the page
 * @property {SeoLink[]} [predictionLinks] - Links to prediction pages
 * @property {SeoLink[]} [leagueLinks] - Links to league pages
 * @property {Object} [schema] - Structured data for search engines (JSON-LD)
 * @property {string[]} [keywords] - SEO keywords for the page
 * @property {Object} [meta] - Additional meta tags for the page
 */

/**
 * Default prediction links used when page-specific links aren't provided
 * @type {SeoLink[]}
 */
export const DEFAULT_PREDICTION_LINKS = [
  { href: '/tomorrow-football-predictions', text: 'Tomorrows Predictions' },
  { href: '/weekend-football-predictions', text: 'Weekend Predictions' },
  { href: '/top-football-predictions', text: 'Top Predictions' },
  { href: '/live-football-predictions', text: 'Live Predictions' },
  { href: '/yesterday-football-predictions', text: 'Yesterday Predictions' }
];

/**
 * Default league links used when page-specific links aren't provided
 * @type {SeoLink[]}
 */
export const DEFAULT_LEAGUE_LINKS = [
  { href: '/football-predictions/league/england/premier-league-39', text: 'English Premier League' },
  { href: '/football-predictions/league/spain/la-liga-140', text: 'Spain La Liga' },
  { href: '/football-predictions/league/italy/serie-a-135', text: 'Italy Serie A' },
  { href: '/football-predictions/league/brazil/serie-a-71', text: 'Brazil Serie A' },
  { href: '/football-predictions/league/germany/bundesliga-78', text: 'Germany Bundesliga' }
];

/**
 * Default sections used when page-specific sections aren't provided
 * @param {string} siteName - The site name to use in the content
 * @returns {SeoSection[]}
 */
export const getDefaultSections = (siteName) => [
  {
    id: 'free-football-prediction-today',
    title: 'Free Football Prediction Today',
    content: `${siteName} provides free football predictions for all of today's matches. The site's algorithm uses previous statistics related to different teams to mathematically analyze the probability of a win, draw, or loss. For every fixture, the system analyzes crucial data such as the following:
    <ul>
      <li><strong>Head-to-head performances:</strong> We examine the last 6 matches that the two teams in the fixture played against each other.</li>
      <li><strong>Previous performances:</strong> An analysis of the last 6 matches each team has played</li>
      <li><strong>Table Standing:</strong> Where each team currently stands in the league table</li>
      <li><strong>Team/ Players Form:</strong> An analysis of each team's players' forms to define how they compare to each other</li>
      <li><strong>Top Trends:</strong> Recent activities that may influence a team's outcome</li>
    </ul>
    <p>All today football predictions are available now for free based on country and league.</p>`
  },
  {
    id: 'todays-100-sure-win-predictions',
    title: 'Today\'s 100 Sure Win Predictions',
    content: `${siteName} provides Today's 100 sure-win predictions for the day's fixtures. They are categorized from the most popular fixtures to the least popular. Click on each game to see other statistics that increase your chances of winning. More details include the team's logo and stadium. Also, every match includes the league, country, and the game's start time.
    <p>Other sure-win predictions on ${siteName} include the following:</p>`
  },
  {
    id: 'best-football-predictions-today-based-on-leagues',
    title: 'Best Football Predictions Today Based on Leagues',
    content: `The best football predictions today are ordered by leagues. ${siteName} provides football predictions for matches across 800+ leagues and tournaments. The football prediction website has an updated system that uses team and player data to mathematically analyze the predictions. Some of the top leagues we offer predictions for include the following:`
  }
];

/**
 * Default FAQs used when page-specific FAQs aren't provided
 * @param {string} siteName - The site name to use in the content
 * @param {string} pageType - The page type (today, tomorrow, etc.)
 * @returns {SeoFaq[]}
 */
export const getDefaultFaqs = (siteName, pageType) => [
  {
    question: `How accurate are ${pageType} football predictions provided by ${siteName}?`,
    answer: `At ${siteName}, our ${pageType} football predictions has an accuracy of over 85%`
  },
  {
    question: `Are the ${pageType} football predictions free at ${siteName}?`,
    answer: `Yes, all our ${pageType} football predictions are provided for free without any registrations or logins.`
  },
  {
    question: `What special features does ${siteName} provide?`,
    answer: `Our platform utilizes advanced algorithms and comprehensive statistical analysis to provide highly accurate predictions for all matches.`
  }
];

/**
 * Generate JSON-LD structured data for SEO
 * @param {Object} options - Options for generating structured data
 * @param {string} options.pageType - The page type (today, tomorrow, etc.)
 * @param {string} options.siteName - The site name
 * @param {string} options.url - The canonical URL for the page
 * @param {string} options.title - The page title
 * @param {string} options.description - The page description
 * @returns {Object} - JSON-LD structured data object
 */
export const generateStructuredData = ({ pageType, siteName, url, title, description }) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${url}/logo.png`
      }
    },
    mainEntity: {
      '@type': 'SportsEvent',
      name: `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Football Matches`,
      description: `Football matches and predictions for ${pageType}`,
      sport: 'Football'
    }
  };
};

export default {
  DEFAULT_PREDICTION_LINKS,
  DEFAULT_LEAGUE_LINKS,
  getDefaultSections,
  getDefaultFaqs,
  generateStructuredData
}; 