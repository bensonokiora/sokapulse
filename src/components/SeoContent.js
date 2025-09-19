'use client';

import Link from 'next/link';
import { useEffect, useState, lazy, Suspense } from 'react';
import { getSeoContent } from '../data/seo';
import { 
  DEFAULT_PREDICTION_LINKS, 
  DEFAULT_LEAGUE_LINKS, 
  getDefaultSections, 
  getDefaultFaqs,
  generateStructuredData
} from '../data/seo/schema';

// Create a separate component for the title that will be instantly rendered
const SeoTitle = ({ title, pageType }) => (
  <h2 
    id={`${pageType}-football-predictions`} 
    className="soka-seo-content-title"
    // Add high priority attributes for better LCP
    importance="high"
    fetchPriority="high"
    elementtiming="seo-title-lcp"
    data-lcp="true"
    loading="eager"
    style={{
      display: 'block',
      fontSize: 'clamp(16px, 4vw, 24px)',
      margin: '0.5em 0',
      fontWeight: 'bold',
      contain: 'layout',
      contentVisibility: 'visible',
    }}
  >
    {title}
  </h2>
);

const SeoLink = ({ href, children }) => (
  <Link 
    href={href}
    className="soka-seo-link"
    prefetch={false}
  >
    {children}
  </Link>
);

// Initial content to display immediately
const InitialContent = ({content}) => (
  <p 
    className="soka-seo-content-description"
    importance="high"
    fetchPriority="high"
    data-lcp="true"
    elementtiming="desc-lcp"
    loading="eager"
    style={{
      display: 'block',
      visibility: 'visible',
      fontSize: '15px',
      lineHeight: '1.4',
      margin: '0.5em 0 1em',
      color: 'var(--text-color)',
      textRendering: 'optimizeLegibility',
      maxWidth: '100%',
      contain: 'layout',
    }}
  >
    {content.description}
  </p>
);

// Pre-load and prepare the initial content instead of using lazy loading for critical content
const ContentBody = ({content, pageType}) => (
  <>
    <p className="soka-seo-content-description" style={{ maxWidth: '100%', color: 'var(--text-color)' }}>
      For all predictions for today's fixtures across hundreds of leagues, the football prediction website explores various betting markets. Football enthusiasts can find football tips today, including the following:
    </p>
    <ul className="soka-seo-content-features">
      {content.features && content.features.slice(0, 3).map((feature, index) => (
        <li key={index} className="soka-seo-feature-item" dangerouslySetInnerHTML={{ __html: feature }} />
      ))}
    </ul>
  </>
);

// Lazy-loaded components for non-critical content
const LazyContentBodyMore = lazy(() => 
  import('../components/LazyContentMore').then(module => ({
    default: ({content}) => (
      <ul className="soka-seo-content-features">
        {content.features && content.features.slice(3).map((feature, index) => (
          <li key={index + 3} className="soka-seo-feature-item" dangerouslySetInnerHTML={{ __html: feature }} />
        ))}
      </ul>
    )
  }))
);

// Lazy-loaded component for sections
const LazySections = lazy(() => 
  import('../components/LazySections').then(module => ({
    default: ({content, renderSections}) => (
      <div className="soka-seo-sections-container">
        {renderSections()}
      </div>
    )
  }))
);

// Lazy-loaded component for links and FAQs
const LazyLinksAndFaqs = lazy(() => 
  import('../components/LazyLinksAndFaqs').then(module => ({
    default: ({content, renderPredictionLinks, renderRelatedSites, renderFaqs}) => (
      <>
        <div className="soka-seo-links-container">
          {content.hidePredictionLinks !== true && renderPredictionLinks()}
          {renderRelatedSites()}
        </div>
        <div className="soka-seo-faqs-container">
          {renderFaqs()}
        </div>
      </>
    )
  }))
);

export default function SeoContent({ pageType = 'default', siteName = 'SokaPulse', customContent = null }) {
  // Get content based on pageType or use customContent if provided
  const content = customContent || getSeoContent(pageType);
  
  // State to hold selected sites for client-side rendering
  const [selectedSites, setSelectedSites] = useState([]);
  // Add state to control deferred loading
  const [contentLoaded, setContentLoaded] = useState(false);
  // State to track if this component is mounted
  const [isMounted, setIsMounted] = useState(false);
  
  // Effect to mark component as mounted - this helps avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Effect to handle client-side site selection and deferred loading
  useEffect(() => {
    if (!isMounted) return;
    
    // This will only run on the client, after hydration
    const selectSites = () => {
      // Shortened to improve performance - only include most important prediction sites
      const allPredictionSites = [
        { name: 'Sokafans', path: '/predictions/sokafans' },
        { name: 'Adibet', path: '/predictions/adibet' },
        { name: 'Betinum', path: '/predictions/betinum' },
        { name: '1960Tips', path: '/predictions/1960tips' },
        { name: 'AI Football Prediction', path: '/predictions/ai-football-prediction' },
        { name: 'Forebet', path: '/predictions/forebet' },
        { name: 'Predictz', path: '/predictions/predictz' },
        { name: 'Vitibet', path: '/predictions/vitibet' },
        { name: 'Zulubet', path: '/predictions/zulubet' },
        { name: 'Betensured', path: '/predictions/betensured' },
        { name: 'Betnumbers', path: '/predictions/betnumbers' },
        { name: 'Tips180', path: '/predictions/tips180' },
        { name: 'Liobet', path: '/predictions/liobet' },
        { name: 'Venasbet', path: '/predictions/venasbet' },
        { name: 'Cheerplex', path: '/predictions/cheerplex' },
        { name: 'Sunpel', path: '/predictions/sunpel' },
        { name: 'Pepeа Tips', path: '/predictions/pepeatips' },
        { name: 'Goaloo Mega Jackpot', path: '/predictions/goaloo-mega-jackpot-prediction' },
        { name: 'OneМillion', path: '/predictions/onemillion-predictions' },
        { name: 'SportyВet Jackpot', path: '/predictions/sporty-bet-jackpot-predictions' },
        { name: '4Bet', path: '/predictions/4bet-predictions' },
        { name: '7Sport Mega Jackpot', path: '/predictions/7sport-mega-jackpot-prediction' },
        { name: 'Octopus Jackpot', path: '/predictions/octopus-jackpot-prediction' },
        { name: 'JamboFutaa', path: '/predictions/jambofutaa' },
        { name: 'Betarazi Mega Jackpot', path: '/predictions/betarazi-mega-jackpot-prediction' },
        { name: 'Flashscore Mega Jackpot', path: '/predictions/flashscore-mega-jackpot-prediction' },
        { name: 'King Mega Jackpot', path: '/predictions/king-mega-jackpot-prediction' },
        { name: 'Sokapedia', path: '/predictions/sokapedia' },
        { name: 'Statarea Mega Jackpot', path: '/predictions/statarea-mega-jackpot-prediction' },
        { name: 'BBC Mega Jackpot', path: '/predictions/bbc-mega-and-midweek-jackpot-prediction' },
        { name: 'Zakabet', path: '/predictions/zakabet' },
        { name: 'Victorspredict', path: '/predictions/victorspredict' },
        { name: 'Topbets', path: '/predictions/topbets' },
        { name: 'Tipsbet', path: '/predictions/tipsbet' },
        { name: 'Supatips', path: '/predictions/supatips' },
        { name: 'Solopredict', path: '/predictions/solopredict' },
        { name: 'Soccervista', path: '/predictions/soccervista' },
        { name: 'Primatips', path: '/predictions/primatips' },
        { name: 'Oddspedia', path: '/predictions/oddspedia' },
        { name: 'Mwanasoka', path: '/predictions/mwanasoka' },
        { name: 'Mighty Tips', path: '/predictions/mighty-tips' },
        { name: 'Futbol24', path: '/predictions/futbol24' },
        { name: 'Freetips', path: '/predictions/freetips' },
        { name: 'Freesupertips', path: '/predictions/freesupertips' },
        { name: 'Confirmbets', path: '/predictions/confirmbets' },
        { name: 'Betwizad', path: '/predictions/betwizad' },
        { name: 'BetWinner360', path: '/predictions/betwinner360' },
        { name: 'BettingExpert', path: '/predictions/bettingexpert' },
        { name: 'Betshoot', path: '/predictions/betshoot' },
        { name: 'Betpro360', path: '/predictions/betpro360' },
        { name: 'Betpera', path: '/predictions/betpera' },
        { name: 'Betgenuine', path: '/predictions/betgenuine' },
        { name: 'BetExplorer', path: '/predictions/betexplorer' },
        { name: 'Betclan', path: '/predictions/betclan' },
        // New prediction sites
        { name: '254suretips', path: '/predictions/254suretips' },
        { name: 'Betagamers', path: '/predictions/betagamers' },
        { name: 'Betsloaded', path: '/predictions/betsloaded' },
        { name: 'Betstudy', path: '/predictions/betstudy' },
        { name: 'Clevertips', path: '/predictions/clevertips' },
        { name: 'Eagle Predict', path: '/predictions/eagle-predict' },
        { name: 'Fcpredict', path: '/predictions/fcpredict' },
        { name: 'Feedinco', path: '/predictions/feedinco' },
        { name: 'Fizzley Tips', path: '/predictions/fizzley-tips' },
        { name: 'Football Expert', path: '/predictions/football-expert' },
        { name: 'Football Super Tips', path: '/predictions/football-super-tips' },
        { name: 'Football Whispers', path: '/predictions/football-whispers' },
        { name: 'Foobol', path: '/predictions/foobol' },
        { name: 'Frybet', path: '/predictions/frybet' },
        { name: 'Fulltime Predict', path: '/predictions/fulltime-predict' },
        { name: 'Goal Goal Tips', path: '/predictions/goal-goal-tips' },
        { name: 'Hello Predict', path: '/predictions/hello-predict' },
        { name: 'Hostpredict', path: '/predictions/hostpredict' },
        { name: 'Kingspredict', path: '/predictions/kingspredict' },
        { name: 'Leaguelane', path: '/predictions/leaguelane' },
        { name: 'Meritpredict', path: '/predictions/meritpredict' },
        { name: 'Mybets Today', path: '/predictions/mybets-today' },
        { name: 'Nora Bet', path: '/predictions/nora-bet' },
        { name: 'Odds Lot', path: '/predictions/odds-lot' },
        { name: 'Over25tips', path: '/predictions/over25tips' },
        { name: 'Pepea Tips', path: '/predictions/pepea-tips' },
        { name: 'Pesaodds', path: '/predictions/pesaodds' },
        { name: 'Pokeabet', path: '/predictions/pokeabet' },
        { name: 'R2bet', path: '/predictions/r2bet' },
        { name: 'Rowdie', path: '/predictions/rowdie' },
        { name: 'Safe Draw', path: '/predictions/safe-draw' },
        { name: 'Sempredict', path: '/predictions/sempredict' },
        { name: 'Smartbet', path: '/predictions/smartbet' },
        { name: 'Soccereco', path: '/predictions/soccereco' },
        { name: 'Sokapro', path: '/predictions/sokapro' },
        { name: 'Sokasmart', path: '/predictions/sokasmart' },
        { name: 'Sokatips', path: '/predictions/sokatips' },
        { name: 'Sportsmole', path: '/predictions/sportsmole' },
        { name: 'Sporttips', path: '/predictions/sporttips' },
        { name: 'Sporttrader', path: '/predictions/sporttrader' },
        { name: 'Sportus', path: '/predictions/sportus' },
        { name: 'Sportverified', path: '/predictions/sportverified' },
        { name: 'Stakegains', path: '/predictions/stakegains' },
        { name: 'Stats24', path: '/predictions/stats24' },
        { name: 'Sure Bet', path: '/predictions/sure-bet' },
        { name: 'Taifa Tips', path: '/predictions/taifa-tips' },
        { name: 'Tips GG', path: '/predictions/tips-gg' },
        { name: 'Topbetpredict', path: '/predictions/topbetpredict' },
        { name: 'Typersi', path: '/predictions/typersi' },
        { name: 'Virtualbet24', path: '/predictions/virtualbet24' },
        { name: 'Winabettips', path: '/predictions/winabettips' },
        { name: 'Windrawwin', path: '/predictions/windrawwin' }
      ];
      
      // Filter out the current page
      const filteredSites = allPredictionSites.filter(site => 
        site.name.toLowerCase() !== pageType.toLowerCase() && 
        site.name.toLowerCase().replace(/\s+/g, '-') !== pageType.toLowerCase()
      );
      
      // Randomly select up to 5 sites (reduced from 10 to improve performance)
      const shuffled = [...filteredSites].sort(() => 0.5 - Math.random());
      setSelectedSites(shuffled.slice(0, Math.min(5, filteredSites.length)));
    };
    
    selectSites();

    // Add intersection observer to load content when scrolled into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setContentLoaded(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1, rootMargin: '200px' }); // Load content earlier
    
    const container = document.querySelector('.soka-seo-content-container');
    if (container) {
      observer.observe(container);
    }

    // Force load content after a timeout even if not scrolled into view
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 3000);

    return () => {
      if (container) {
        observer.unobserve(container);
      }
      clearTimeout(timer);
    };
  }, [pageType, isMounted]); // Only re-run when pageType changes or component mounts
  
  // Only render custom sections if provided
  const renderSections = () => {
    if (content.sections && content.sections.length > 0) {
      return content.sections.map((section, index) => (
        <div key={index} className="soka-seo-section">
          {section.title && <h2 className="soka-seo-section-title">{section.title}</h2>}
          <div className="soka-seo-section-content" dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      ));
    }
    return null;
  };

  // Render FAQs if available
  const renderFaqs = () => {
    if (content.faqs && content.faqs.length > 0) {
      return (
        <div className="soka-seo-faqs-section">
          <h2 className="soka-seo-section-title">Frequently Asked Questions</h2>
          <div className="soka-seo-accordion">
            {content.faqs.map((faq, index) => (
              <div key={index} className="soka-seo-accordion-item">
                <h3 className="soka-seo-accordion-header">
                  <button
                    className="soka-seo-accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq-${index}`}
                    aria-expanded="false"
                    aria-controls={`faq-${index}`}
                  >
                    {faq.question}
                  </button>
                </h3>
                <div
                  id={`faq-${index}`}
                  className="soka-seo-accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="soka-seo-accordion-body" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render prediction links if provided - simplified version for performance
  const renderPredictionLinks = () => {
    const links = content.predictionLinks && content.predictionLinks.length > 0 
      ? content.predictionLinks.slice(0, 5) 
      : DEFAULT_PREDICTION_LINKS.slice(0, 5);
    
    return (
      <div className="soka-seo-prediction-links-section">
        <h3 className="soka-seo-links-title">Football Prediction Links</h3>
        <ul className="soka-seo-prediction-links">
          {links.map((link, index) => (
            <li key={index} className="soka-seo-prediction-link-item">
              <SeoLink href={link.href}>{link.text}</SeoLink>
            </li>
          ))}
          <li className="soka-seo-prediction-link-item">
            <SeoLink href="https://jackpot-predictions.com/">Jackpot Predictions</SeoLink>
          </li>
          <li className="soka-seo-prediction-link-item">
            <SeoLink href="https://www.sportpesa-tips.com/">Sportpesa Tips</SeoLink>
          </li>
          <li className="soka-seo-prediction-link-item">
            <SeoLink href="https://www.sportpesa-tips.co.ke/">Sportpesa Jackpot Predictions</SeoLink>
          </li>
          
        </ul>
      </div>
    );
  };

  // Render related prediction sites links - simplified for performance
  const renderRelatedSites = () => {
    // Skip if this feature is explicitly disabled
    if (content.hideRelatedSites === true) {
      return null;
    }

    // Use clientside selected sites if available, otherwise use a deterministic selection
    const sitesToRender = isMounted && selectedSites.length > 0 
      ? selectedSites 
      : [
          { name: 'Forebet', path: '/predictions/forebet' },
          { name: 'Predictz', path: '/predictions/predictz' },
          { name: 'Zulubet', path: '/predictions/zulubet' },
          { name: 'Betensured', path: '/predictions/betensured' },
          { name: 'Tips180', path: '/predictions/tips180' },
        ];
    
    return (
      <div className="soka-seo-related-sites-section">
        <h3 className="soka-seo-links-title">More Football Predictions</h3>
        <p className="soka-seo-related-subtitle">You can also explore these prediction sources:</p>
        <ul className="soka-seo-related-sites-links">
          {sitesToRender.map((site, index) => (
            <li key={index} className="soka-seo-related-site-item">
              <SeoLink href={site.path}>{site.name} Predictions</SeoLink>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="soka-seo-content-container">
      <div className="soka-seo-content-wrapper">
        <div className="soka-seo-content-header">
          {/* The title is rendered immediately for LCP optimization */}
          <SeoTitle title={content.title} pageType={pageType} />
          
          {/* Mobile LCP optimization - immediately render the description */}
          <InitialContent content={content} />
          
          {/* Critical first portion of content is rendered immediately */}
          <ContentBody content={content} pageType={pageType} />
          
          {/* Non-critical additional content is lazy loaded */}
          {contentLoaded && (
            <Suspense fallback={null}>
              <LazyContentBodyMore content={content} />
            </Suspense>
          )}
        </div>

        {/* Lazy load all other sections */}
        {contentLoaded && (
          <Suspense fallback={null}>
            <LazySections content={content} renderSections={renderSections} />
          </Suspense>
        )}

        {/* Lazy load links and FAQs */}
        {contentLoaded && (
          <Suspense fallback={null}>
            <LazyLinksAndFaqs 
              content={content} 
              renderPredictionLinks={renderPredictionLinks} 
              renderRelatedSites={renderRelatedSites} 
              renderFaqs={renderFaqs} 
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}