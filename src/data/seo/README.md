# SEO Content System

This directory contains a modular system for managing SEO content across the site. The system is designed to be flexible, maintainable, and scalable, allowing you to easily add new pages with unique SEO content.

## Directory Structure

- `schema.js` - Defines the schema for SEO content and provides default values
- `index.js` - Exports functions to get and register SEO content
- `pages/` - Contains page-specific SEO content
  - `home.js` - Home page SEO content
  - `tomorrow.js` - Tomorrow page SEO content
  - `sokafans.js` - Sokafans page SEO content
  - `template.js` - Template for creating new SEO content pages
- `createPage.js` - Script to help generate new SEO content pages quickly

## How to Use

### Adding SEO Content to a Page

To add SEO content to a page, import the `SeoContent` component and use it in your page:

```jsx
import SeoContent from '../components/SeoContent';

export default function HomePage() {
  return (
    <div>
      {/* Your page content */}
      <SeoContent pageType="home" siteName="SokaPulse" />
    </div>
  );
}
```

The `pageType` prop determines which SEO content to use. The `siteName` prop is used to customize the content with your site name.

### Creating a New SEO Content Page

To create a new SEO content page, you can use the `createPage.js` script:

```bash
node src/data/seo/createPage.js pageName "Page Title" "Page Description"
```

For example:

```bash
node src/data/seo/createPage.js weekend "Weekend Football Predictions" "Get accurate weekend football predictions for all matches happening this weekend."
```

This will create a new file at `src/data/seo/pages/weekend.js` with the specified title and description, and update the `index.js` file to include the new page.

Alternatively, you can manually create a new file in the `pages/` directory by copying the `template.js` file and customizing it.

### Customizing SEO Content

Each SEO content file exports an object with the following properties:

- `title` - The main title for the SEO content
- `description` - The main description paragraph
- `features` - List of features or prediction types
- `accuracy` - Statement about prediction accuracy
- `specialFeature` - Special feature highlight
- `sections` - Custom sections for the page
- `faqs` - FAQs for the page
- `predictionLinks` - Links to prediction pages
- `leagueLinks` - Links to league pages
- `keywords` - SEO keywords for the page
- `schema` - Structured data for search engines (JSON-LD)

You can customize any of these properties to create unique SEO content for each page.

### Adding Structured Data

The system automatically adds structured data (JSON-LD) to the page if the `schema` property is provided in the SEO content. This helps search engines understand the content of the page and can improve SEO.

## Best Practices

1. **Keep Content Unique**: Ensure that each page has unique content to avoid duplicate content issues.
2. **Use Keywords**: Include relevant keywords in the content to improve SEO.
3. **Add Structured Data**: Use the `schema` property to add structured data to the page.
4. **Update Content Regularly**: Keep the content up-to-date to ensure it remains relevant.
5. **Test with SEO Tools**: Use tools like Google's Structured Data Testing Tool to verify your structured data.

## Example

Here's an example of a custom SEO content object:

```js
const weekendContent = {
  title: 'Weekend Football Predictions',
  description: 'Get accurate weekend football predictions for all matches happening this weekend.',
  features: [
    'Weekend Match Winner predictions',
    'Weekend Double chance tips',
    'Weekend Goal/No Goal predictions',
    'Weekend Over/Under predictions',
    'Weekend Correct Score tips',
    'Weekend HT/FT predictions'
  ],
  accuracy: 'Weekend predictions maintain an accuracy rate of over 80%',
  specialFeature: 'In-depth Weekend Statistical Analysis',
  sections: [
    {
      id: 'weekend-premium-predictions',
      title: 'Weekend Premium Predictions',
      content: `Content for weekend premium predictions...`
    }
  ],
  faqs: [
    {
      question: 'How accurate are weekend football predictions?',
      answer: 'Weekend football predictions maintain an accuracy rate of over 80%.'
    }
  ],
  predictionLinks: [
    { href: '/today-football-predictions', text: 'Today Predictions' },
    { href: '/tomorrow-football-predictions', text: 'Tomorrow Predictions' }
  ],
  leagueLinks: [
    { href: '/football-predictions/league/england/premier-league-39', text: 'English Premier League' }
  ],
  keywords: [
    'weekend football predictions',
    'football predictions weekend'
  ],
  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Weekend Football Predictions - SokaPulse',
    description: 'Get accurate weekend football predictions for all matches happening this weekend.'
  }
};
``` 