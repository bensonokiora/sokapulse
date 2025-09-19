//console.log('Promo banner script PARSED.'); // Debug: Script file parsed

function initPromoBanner() {
    console.log('Promo banner script DOMContentLoaded event fired.'); // Debug log

    // Check if banner elements exist on the page before doing anything
    const mobileAdLink = document.getElementById('mobileAdLink');
    const desktopAdLink = document.getElementById('desktopAdLink');

    // Debug logs for element presence
    //console.log('mobileAdLink found:', !!mobileAdLink);
    //console.log('desktopAdLink found:', !!desktopAdLink);

    // If neither banner's main link element is found, don't run the script
    if (!mobileAdLink && !desktopAdLink) {
        //console.log("Promo banner elements (mobileAdLink and desktopAdLink) not found. Skipping script execution and localStorage operations."); // Debug log
        return;
    }

    const promotionsData = {
        "22Bet": {
            mobileLink: "https://moy.auraodin.com/redirect.aspx?pid=139161&bid=1715",
            desktopLink: "https://moy.auraodin.com/redirect.aspx?pid=139161&bid=1715",
            image: "/assets/images/22bet_wide.webp",
            altText: "22Bet",
            messages: [
                { title: "Play Aviator on 22Bet - Win up to 1,300,000 KES!", description: "Register now and grab a 47,000 KES welcome bonus to start flying high with big wins! T&C Apply." },
                { title: "100% Welcome Bonus", description: "Register with 22Bet and get a fantastic 100% bonus of up to 19000 KES! 18+ | T&Cs apply." },
                { title: "Win up to KES 35000", description: "Register and get a bonus of up to 19000 KES for sports betting or up to 35000 KES for casino games right now!" }
            ],
            buttonText: "Register"
        },
        "Mozzartbet": {
            link: "https://refpa3267686.top/L?tag=d_4439441m_1599c_&site=4439441&ad=1599", // General link for Mozzartbet
            image: "/assets/images/mozzart_wide.webp", 
            altText: "Mozzartbet",
            messages: [
                { title: "Spin & Win Up to Ksh 2M!", description: "Step up your spins — win up to Ksh 2,000,000 at Mozzart Casino! Get in on the action — Ksh 10 stake is all you need to start winning at Mozzart Casino!" },
                { title: "50% Free Bet Up To KES 2,500 | Join & Get Up to 50 Free Spins", description: "Register Now and Claim Your Free Bet & Aviator Spins. Sign up now, play your first bet & claim your 50% bonus + Free Spins." },
                { title: "Casino Bonus up to 35000 Kes", description: "Get up to KES 35,000 in Casino Bonus on your First Deposit!" },
                { title: "Register with MozzartBet - Start Betting Today!", description: "Create your account easily and enjoy a variety of sports betting options with competitive odds." }
            ],
            buttonText: "Register"
        },
        "1xbet": {
            link: "https://refpa3267686.top/L?tag=d_4439441m_1599c_&site=4439441&ad=1599", // General link for Mozzartbet
            image: "/assets/images/1xbet.svg", 
            altText: "1xbet",
            messages: [
                { title: "1xbet - 100% Welcome Bonus", description: "1xbet - 100% Welcome Bonus" },
                { title: "1xbet - 100% first Bonus", description: "1xbet - 100% first Bonus" },
                { title: "1xbet - 100% Welcome Bonus", description: "1xbet - 100% Welcome Bonus" }
            ],
            buttonText: "Register"
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
