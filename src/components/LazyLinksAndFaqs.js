'use client';

export default function LazyLinksAndFaqs({content, renderPredictionLinks, renderRelatedSites, renderFaqs}) {
  return (
    <>
      <div className="soka-seo-links-container">
        {content.hidePredictionLinks !== true && renderPredictionLinks()}
        {renderRelatedSites()}
      </div>
      <div className="soka-seo-faqs-container">
        {renderFaqs()}
      </div>
    </>
  );
} 