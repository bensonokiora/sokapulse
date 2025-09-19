'use client';

import React from 'react';
import Link from 'next/link';
import '../../styles/contact-us.css'; // Import the CSS directly in this page

export default function ContactUs() {
  return (
    <div className="contact-page-container">
      <div className="page-row">
        <div className="page-col page-col-md-10">
          <div className="contact-hero">
            <h1 className="display-4 fw-bold">Contact Us</h1>
            <p className="lead">
              We'd love to hear from you. Here's how you can reach us.
            </p>
          </div>
          
          <div className="page-row g-4">
            <div className="page-col page-col-md-6">
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-envelope-fill fs-3"></i>
                </div>
                <h3 className="h4">Email Us</h3>
                <p>
                  For general inquiries, feedback, or support, please email us at:
                </p>
                <div className="text-center">
                  <Link href="mailto:info@sokapulse.com" className="custom-btn custom-btn-outline-danger">
                    info@sokapulse.com
                  </Link>
                </div>
                <div className="contact-details">
                  <h5 className="h6">We typically respond to emails within:</h5>
                  <ul>
                    <li>
                      <i className="bi bi-check-circle-fill text-success"></i>
                      General inquiries: 1-2 business days
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill text-success"></i>
                      Support requests: 24 hours
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill text-success"></i>
                      Business proposals: 3-5 business days
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="page-col page-col-md-6">
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="bi bi-chat-dots-fill fs-3"></i>
                </div>
                <h3 className="h4">Chat Support</h3>
                <p>
                  Need immediate assistance? Chat with our support team:
                </p>
                <div className="text-center">
                  <Link href="tel:+254732599001" className="custom-btn custom-btn-outline-danger">
                    0732 599 001
                  </Link>
                </div>
                <div className="contact-details">
                  <h5 className="h6">Chat Support Hours:</h5>
                  <ul>
                    <li>
                      <i className="bi bi-clock-fill text-secondary"></i>
                      Monday - Friday: 8:00 AM - 8:00 PM EAT
                    </li>
                    <li>
                      <i className="bi bi-clock-fill text-secondary"></i>
                      Saturday: 9:00 AM - 5:00 PM EAT
                    </li>
                    <li>
                      <i className="bi bi-clock-fill text-secondary"></i>
                      Sunday: 12:00 PM - 4:00 PM EAT
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="faq-section">
            <h2 className="h4">Frequently Asked Questions</h2>
            
            <div className="faq-item">
              <h3 className="h5">How accurate are your football predictions?</h3>
              <p>
                Our predictions are based on mathematical models and statistical analysis of historical data. While we strive for high accuracy, sports outcomes are inherently unpredictable. Our success rates vary by league and prediction type, typically ranging from 60-75%.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="h5">Do you offer premium predictions?</h3>
              <p>
                Yes, we offer premium prediction packages with higher accuracy rates and detailed analysis. These are available through subscription plans on our website.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="h5">How often are predictions updated?</h3>
              <p>
                Our predictions are updated daily. For live matches, we provide real-time updates and in-play statistics to help you make informed decisions.
              </p>
            </div>
            
          
          </div>
          
          <div className="social-section">
            <p>
              Follow us on social media for the latest updates and special offers
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 