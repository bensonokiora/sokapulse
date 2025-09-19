'use client';

import React from 'react';
import '../../styles/privacy-policy.css'; // Import the CSS directly in this page

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page-container">
      <div className="page-row">
        <div className="page-col page-col-md-10">
          <div className="privacy-content">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            
            <section className="privacy-section">
              <h2 className="h4">1. Introduction</h2>
              <p>
                This Privacy Policy outlines how SokaPulse collects, uses, maintains, and discloses information gathered from users of our football predictions platform. We are committed to protecting your privacy and handling your data with transparency and integrity.
              </p>
              <p>
                If you have any questions or need additional information about our Privacy Policy, please feel free to contact us through the channels provided at the end of this document.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">2. Consent</h2>
              <p>
                By accessing and using the SokaPulse website, you acknowledge that you have read and understood this Privacy Policy and agree to be bound by its terms. If you do not agree with any aspect of this policy, we respectfully ask that you discontinue use of our platform.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">3. Information We Collect</h2>
              <p>
                We collect information in several ways, depending on how you interact with our platform:
              </p>
              
              <h3 className="h5">3.1 Personal Information</h3>
              <p>
                We only collect personal information that is clearly indicated at the point of collection. This may include:
              </p>
              <ul>
                <li>Name, email address, and contact details when you register or contact us</li>
                <li>Account credentials for accessing premium features</li>
                <li>Payment information when subscribing to our services</li>
                <li>Communication content when you reach out to our support team</li>
              </ul>
              
              <h3 className="h5">3.2 Usage Data</h3>
              <p>
                We automatically collect certain information about your interaction with our platform, including:
              </p>
              <ul>
                <li>Internet Protocol (IP) address</li>
                <li>Browser type and version</li>
                <li>Device information and Internet Service Provider (ISP) details</li>
                <li>Date and time stamps of visits</li>
                <li>Pages viewed and navigation patterns</li>
                <li>Referring/exit pages</li>
              </ul>
              <p>
                This information is used to analyze trends, administer the website, track user engagement, and gather demographic insights. None of this data contains personally identifiable information.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">4. Cookies and Tracking Technologies</h2>
              <p>
                SokaPulse uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small files stored on your device that help us:
              </p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Understand how you navigate our website</li>
                <li>Personalize content based on your interests</li>
                <li>Improve overall site functionality</li>
                <li>Analyze site traffic and performance</li>
              </ul>
              <p>
                You can configure your browser to refuse cookies or alert you when cookies are being sent. However, disabling cookies may impact your experience and limit certain features of our platform.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">5. How We Use Your Information</h2>
              <p>
                We utilize the information we collect for the following legitimate purposes:
              </p>
              <ul>
                <li>Operating and maintaining our website efficiently</li>
                <li>Improving and personalizing your experience</li>
                <li>Analyzing usage patterns to enhance features and functionality</li>
                <li>Developing new services based on user preferences</li>
                <li>Communicating with you about account updates, support issues, and relevant offerings</li>
                <li>Sending informational and promotional emails (with opt-out options)</li>
                <li>Detecting and preventing fraudulent activities</li>
                <li>Ensuring platform security and integrity</li>
              </ul>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">6. Third-Party Partnerships</h2>
              <p>
                SokaPulse may partner with third-party advertising and analytics companies that use cookies on our platform. Each partner has their own privacy policy governing how they handle user data.
              </p>
              <p>
                While we carefully select our partners, we do not have control over the cookies or tracking technologies used by these third parties. We encourage you to review their respective privacy policies for more information.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">7. Third-Party Websites</h2>
              <p>
                Our platform may contain links to external websites. This Privacy Policy applies solely to information collected by SokaPulse. We strongly recommend reviewing the privacy policies of any third-party sites you visit through our platform.
              </p>
              <p>
                SokaPulse is not responsible for the content or privacy practices of websites not operated by us.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">8. Data Protection Rights</h2>
              <p>
                Under the General Data Protection Regulation (GDPR) and other applicable data protection laws, you have certain rights regarding your personal data:
              </p>
              <ul>
                <li><strong>Right to Access:</strong> You can request copies of your personal data held by us.</li>
                <li><strong>Right to Rectification:</strong> You can ask us to correct inaccurate or incomplete information.</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your personal data under certain conditions.</li>
                <li><strong>Right to Restrict Processing:</strong> You can ask us to limit how we use your data in certain circumstances.</li>
                <li><strong>Right to Data Portability:</strong> You can request transfer of your data to another service provider.</li>
                <li><strong>Right to Object:</strong> You can object to our processing of your personal data for certain purposes.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided at the end of this policy. We will respond to your request within the timeframe required by applicable law.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">9. Children's Information</h2>
              <p>
                Protecting children's privacy online is paramount to us. SokaPulse does not knowingly collect personal information from individuals under 13 years of age. Our services are designed for individuals who are at least 18 years old.
              </p>
              <p>
                If we discover that we have inadvertently collected information from a child under 13, we will promptly delete such information from our records. If you believe your child has provided personal information to us, please contact us immediately.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">10. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              <p>
                We regularly review our information collection, storage, and processing practices to guard against unauthorized access to our systems.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify users of any material changes by posting the updated policy on this page with a revised "Last Updated" date.
              </p>
              <p>
                We encourage you to review this Privacy Policy regularly to stay informed about how we are protecting your information.
              </p>
            </section>
            
            <section className="privacy-section">
              <h2 className="h4">12. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact us at:
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