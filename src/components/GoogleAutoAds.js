'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const GoogleAutoAds = () => {
  useEffect(() => {
    // Enable Auto ads
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({
        google_ad_client: "ca-pub-6415640710219864",
        enable_page_level_ads: true
      });
    }
  }, []);

  return (
    <>
      <Script
        id="google-adsense-auto-ads"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6415640710219864"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* Auto ads initialization */}
      <Script
        id="google-auto-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-6415640710219864",
              enable_page_level_ads: true
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAutoAds;