# Prediction Pages

This directory contains prediction pages for different sources/brands. Each prediction page uses the same data and functionality as the homepage but with different titles and SEO metadata.

## How to Add a New Prediction Page

1. Create a new directory under `src/app/predictions/` with the name of your prediction source (e.g., `mybettips`).

2. Create a `layout.js` file in the new directory with the following content:

```javascript
export const metadata = {
  title: 'Your Page Title - SokaPulse',
  description: 'Your page description here.',
};

export default function YourNameLayout({ children }) {
  return children;
}
```

3. Create a `page.js` file in the new directory with the following content:

```javascript
import PredictionLoader from '@/components/PredictionLoader';

export default function YourNamePredictions() {
  return (
    <PredictionLoader 
      pageTitle="Your Page Title" 
    />
  );
}
```

4. Replace "Your Page Title" and "Your page description" with appropriate content for your prediction page.

That's it! Your new prediction page will be available at `/predictions/yourpagename`. 