
function initPromoBanner() {
        //console.log('Promo banner script DOMContentLoaded event fired.'); // Debug log

    // Check if banner elements exist on the page before doing anything
    const mobileAdLink = document.getElementById('mobileAdLink');
    const desktopAdLink = document.getElementById('desktopAdLink');

    // Debug logs for element presence
    // console.log('mobileAdLink found:', !!mobileAdLink);
    // console.log('desktopAdLink found:', !!desktopAdLink);

    // If neither banner's main link element is found, don't run the script
    if (!mobileAdLink && !desktopAdLink) {
        //console.log("Promo banner elements (mobileAdLink and desktopAdLink) not found. Skipping script execution and localStorage operations."); // Debug log
        return;
    }

    const promotionsData = {
        "app_promo": {
            mobileLink: "https://play.google.com/store/apps/details?id=ke.app.sportpesa&referrer=utm_source%3Dsokapulse%26utm_medium%3Dwebsite%26utm_campaign%3Dapp_download%26utm_content%3Dmain_banner",
            desktopLink: "https://play.google.com/store/apps/details?id=ke.app.sportpesa&referrer=utm_source%3Dsokapulse%26utm_medium%3Dwebsite%26utm_campaign%3Dapp_download%26utm_content%3Dmain_banner",
            image: "/assets/images/app_promos.webp",
            altText: "app_promo",
            messages: [
                { title: "Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!", description: "Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!" },
                { title: "Download our App -  Free Premium Bet Slips! Join over 400,000+ users!", description: "Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!" },
                { title: "Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!", description: "Download our App - Get 2 Free Premium Bet Slips! Join over 400,000+ users!" }
            ],
            buttonText: "Download Now"
        }
    };

    const affiliateNames = Object.keys(promotionsData);

    // DOM Elements (check for existence before using)
    const mobileAdImage = document.getElementById('mobileAdImage');
    const mobileAdTitle = document.getElementById('mobileAdTitle');
    const mobileAdDescription = document.getElementById('mobileAdDescription');
    const mobileAdButton = document.getElementById('mobileAdButton');

    const desktopAdImage = document.getElementById('desktopAdImage');
    const desktopAdTitle = document.getElementById('desktopAdTitle');
    const desktopAdDescription = document.getElementById('desktopAdDescription');
    const desktopAdButton = document.getElementById('desktopAdButton');

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getRandomDifferentInt(max, excludeIndex) {
        if (max <= 1) return 0;
        let newIndex;
        let attempts = 0;
        do {
            newIndex = getRandomInt(max);
            attempts++;
        } while (newIndex === excludeIndex && attempts < max * 2);
        return newIndex;
    }

    let currentAffiliateName = localStorage.getItem('promo_currentAffiliateName') || affiliateNames[0];
    let displayCountForCurrentAffiliate = parseInt(localStorage.getItem('promo_displayCountForCurrentAffiliate')) || 0;
    
    // Debug log for initial localStorage values
    //console.log('Initial currentAffiliateName from localStorage:', localStorage.getItem('promo_currentAffiliateName'), '-> Parsed:', currentAffiliateName);
    //console.log('Initial displayCountForCurrentAffiliate from localStorage:', localStorage.getItem('promo_displayCountForCurrentAffiliate'), '-> Parsed:', displayCountForCurrentAffiliate);

    let lastShownIndices = {};
    affiliateNames.forEach(name => {
        lastShownIndices[name] = parseInt(localStorage.getItem(`promo_lastShownIndex_${name}`)) || -1;
    });

    if (displayCountForCurrentAffiliate >= 2) {
        displayCountForCurrentAffiliate = 0;
        const currentAffiliateIndex = affiliateNames.indexOf(currentAffiliateName);
        currentAffiliateName = affiliateNames[(currentAffiliateIndex + 1) % affiliateNames.length];
    }

    const currentAffiliateData = promotionsData[currentAffiliateName];
    const messages = currentAffiliateData.messages;
    let messageIndex;

    if (displayCountForCurrentAffiliate === 0 || messages.length <= 1) {
        messageIndex = getRandomInt(messages.length);
    } else {
        messageIndex = getRandomDifferentInt(messages.length, lastShownIndices[currentAffiliateName]);
    }
    
    const selectedMessage = messages[messageIndex];

    // Update Mobile Banner (if elements exist)
    if (mobileAdLink) mobileAdLink.href = currentAffiliateData.mobileLink || currentAffiliateData.link;
    if (mobileAdImage) {
        mobileAdImage.src = currentAffiliateData.image;
        mobileAdImage.srcset = currentAffiliateData.image;
        mobileAdImage.alt = currentAffiliateData.altText;
    }
    if (mobileAdTitle) mobileAdTitle.textContent = selectedMessage.title;
    if (mobileAdDescription) mobileAdDescription.textContent = '';
    if (mobileAdButton) mobileAdButton.textContent = currentAffiliateData.buttonText;

    // Update Desktop Banner (if elements exist)
    if (desktopAdLink) desktopAdLink.href = currentAffiliateData.desktopLink || currentAffiliateData.link;
    if (desktopAdImage) {
        desktopAdImage.src = currentAffiliateData.image;
        desktopAdImage.srcset = currentAffiliateData.image;
        desktopAdImage.alt = currentAffiliateData.altText;
    }
    if (desktopAdTitle) desktopAdTitle.textContent = selectedMessage.title;
    if (desktopAdDescription) desktopAdDescription.textContent = selectedMessage.description;
    if (desktopAdButton) desktopAdButton.textContent = currentAffiliateData.buttonText;

    // Update state for next load (only if banners were found and updated)
    if (mobileAdLink || desktopAdLink) {
        //console.log('Attempting to save to localStorage.'); // Debug log
        lastShownIndices[currentAffiliateName] = messageIndex;
        displayCountForCurrentAffiliate++;

        // Debug logs before setting items
        //console.log('Saving promo_currentAffiliateName:', currentAffiliateName);
        //console.log('Saving promo_displayCountForCurrentAffiliate:', displayCountForCurrentAffiliate.toString());
        
        localStorage.setItem('promo_currentAffiliateName', currentAffiliateName);
        localStorage.setItem('promo_displayCountForCurrentAffiliate', displayCountForCurrentAffiliate.toString());
        affiliateNames.forEach(name => {
            const valueToStore = (lastShownIndices[name] !== undefined ? lastShownIndices[name].toString() : '-1');
            //console.log(`Saving promo_lastShownIndex_${name}:`, valueToStore); // Debug log
            localStorage.setItem(`promo_lastShownIndex_${name}`, valueToStore);
        });
        //console.log('Finished attempting to save to localStorage.'); // Debug log
    } else {
        //console.log('Skipped saving to localStorage because mobileAdLink and desktopAdLink were not found earlier.'); // Debug log
    }
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    //console.log('DOM already interactive or complete. Calling initPromoBanner directly.');
    initPromoBanner();
} else {
    //console.log('DOM not yet ready. Adding DOMContentLoaded listener for initPromoBanner.');
    document.addEventListener('DOMContentLoaded', initPromoBanner);
}
