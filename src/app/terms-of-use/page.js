'use client';

import React from 'react';
import '../../styles/terms-of-use.css'; // Import the CSS directly in this page

export default function TermsOfUse() {
  return (
    <div className="terms-page-container">
      <div className="page-row">
        <div className="page-col page-col-md-10">
          <div className="terms-content">
            <h1>Terms and Conditions</h1>
            <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            
            <section className="terms-section">
              <h2 className="h4">1. Welcome to SokaPulse</h2>
              <p>
                These terms and conditions outline the rules and regulations for using SokaPulse's website, located at https://sokapulse.com.
              </p>
              <p>
                By accessing our website, we assume you accept these terms and conditions in full. Do not continue to use SokaPulse if you do not agree to all the terms and conditions stated on this page.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">2. Terminology</h2>
              <p>
                Throughout these Terms and Conditions, Privacy Policy and Disclaimer Notice, the following terminology applies:
              </p>
              <ul>
                <li>"Client", "You" and "Your" refers to you, the person accessing this website and accepting these terms and conditions.</li>
                <li>"The Company", "Ourselves", "We", "Our" and "Us" refers to SokaPulse.</li>
                <li>"Party", "Parties", or "Us" refers to both you and SokaPulse.</li>
              </ul>
              <p>
                All terms refer to the offer, acceptance, and consideration of payment necessary to provide our service to you, in accordance with and subject to prevailing laws.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">3. Cookies</h2>
              <p>
                We employ cookies to enhance your experience on our platform. By accessing SokaPulse, you agree to the use of cookies in accordance with SokaPulse's Privacy Policy.
              </p>
              <p>
                Cookies enable certain functionality and help us personalize your experience. Some of our analytics and advertising partners may also use cookies in accordance with their own policies.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">4. Intellectual Property</h2>
              <p>
                Unless otherwise stated, SokaPulse and/or its licensors own the intellectual property rights for all material on the SokaPulse platform. All intellectual property rights are reserved.
              </p>
              <p>
                When using our content, you must not:
              </p>
              <ul>
                <li>Republish material from SokaPulse without proper attribution</li>
                <li>Sell, rent, or sub-license material from SokaPulse</li>
                <li>Reproduce, duplicate, or copy material from SokaPulse for commercial purposes</li>
                <li>Redistribute content from SokaPulse without permission</li>
              </ul>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">5. Hyperlinking to Our Content</h2>
              <p>
                The following organizations may link to our website without prior written approval:
              </p>
              <ul>
                <li>Search engines</li>
                <li>News organizations</li>
                <li>Online directory distributors</li>
              </ul>
              <p>
                These organizations may link to our home page or other website information as long as the link:
              </p>
              <ul>
                <li>Is not misleading or deceptive</li>
                <li>Does not falsely imply sponsorship, endorsement, or approval</li>
                <li>Fits within the context of the linking party's site</li>
              </ul>
              <p>
                Other organizations seeking to link to our site should contact us at info@sokapulse.com with details about their organization and linking intentions.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">6. Content Use and Restrictions</h2>
              <p>
                Approved organizations may hyperlink to our website in the following ways:
              </p>
              <ul>
                <li>By using our corporate name</li>
                <li>By using the URL being linked to</li>
                <li>By using a description of our website that makes sense within the context of the linking party's content</li>
              </ul>
              <p>
                The use of SokaPulse's logo or other branding elements requires a separate trademark license agreement.
              </p>
            </section>

            <section className="terms-section">
              <h2 className="h4">7. iFrames and Website Presentation</h2>
              <p>
                Without prior written permission, you may not create frames around our webpages that alter the visual presentation or appearance of our website in any way.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">8. Content Liability</h2>
              <p>
                We shall not be held responsible for any content that appears on other websites that link to or from SokaPulse. You agree to protect and defend us against any claims arising from content on your website that links to ours.
              </p>
              <p>
                No links should appear on any website that may be interpreted as libelous, obscene, or criminal, or which infringes upon or violates any third-party rights.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">9. Privacy Protection</h2>
              <p>
                We value your privacy and encourage you to read our detailed Privacy Policy to understand how we collect, use, and protect your information.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">10. Reservation of Rights</h2>
              <p>
                We reserve the right to request removal of any links to our website. You agree to promptly comply with such requests.
              </p>
              <p>
                We also reserve the right to amend these terms and conditions at any time. By continuing to link to or use our website, you agree to be bound by the current version of these terms and conditions.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">11. Link Removal</h2>
              <p>
                If you find any link on our website offensive or inappropriate, please contact us. We will consider requests for link removal but are not obligated to do so or to respond directly to every request.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">12. Information Accuracy</h2>
              <p>
                While we strive to provide accurate and up-to-date information, we do not warrant the completeness or accuracy of the content on our website. We make no promises regarding the availability of our website or the currency of its content.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">13. Disclaimer of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and your use of it. Nothing in this disclaimer will:
              </p>
              <ul>
                <li>Limit or exclude our or your liability for death or personal injury</li>
                <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation</li>
                <li>Limit any of our or your liabilities in any way that is not permitted under applicable law</li>
                <li>Exclude any of our or your liabilities that may not be excluded under applicable law</li>
              </ul>
              <p>
                The limitations of liability in this section govern all liabilities arising under this disclaimer, including liabilities in contract, tort, and for breach of statutory duty.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">14. Free Services Disclaimer</h2>
              <p>
                For services and information provided free of charge on our website, we will not be liable for any loss or damage of any nature except where such exclusion is prohibited by law.
              </p>
            </section>
            
            <section className="terms-section">
              <h2 className="h4">15. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="contact-info">
                <p>
                  Email: <a href="mailto:info@sokapulse.com">info@sokapulse.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 