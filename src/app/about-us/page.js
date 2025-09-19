'use client';

import React from 'react';
import Image from 'next/image';
import '../../styles/about-us.css';

export default function AboutUs() {
  return (
    <div className="about-page-container">
      <div className="page-row">
        <div className="page-col page-col-md-10">
          {/* Hero Section */}
          <div className="about-hero">
            <h1 className="display-4 fw-bold">About SokaPulse</h1>
            <p className="lead">
              Revolutionizing football predictions with data science and mathematical analysis
            </p>
            <div className="divider"></div>
          </div>
          
          {/* Our Story */}
          <div className="about-section">
            <div className="page-row g-5">
              <div className="page-col page-col-lg-6">
                <h2 className="h3">Our Story</h2>
                <p>
                  Founded in 2020, SokaPulse was born out of a passion for football and data science. Our team of sports analysts, statisticians, and football enthusiasts came together with a shared vision: to create a platform that provides accurate, reliable, and data-driven football predictions.
                </p>
                <p>
                  What started as a small project has grown into a trusted platform serving thousands of users daily across the globe. We've continuously refined our prediction models and expanded our coverage to include leagues and tournaments from around the world.
                </p>
                <p>
                  Today, SokaPulse stands as a leading resource for football predictions, match analysis, and statistics, helping both casual fans and serious bettors make informed decisions.
                </p>
              </div>
             
            </div>
          </div>
          
          {/* Our Mission */}
          <div className="mission-card">
            <h2 className="h3">Our Mission</h2>
            <p className="lead">
              To provide the most accurate football predictions through advanced statistical analysis and machine learning, making sports data accessible and useful for everyone.
            </p>
            <div className="page-row g-4">
              <div className="page-col page-col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="bi bi-graph-up fs-3"></i>
                  </div>
                  <h3 className="h5">Data-Driven</h3>
                  <p>
                    We analyze thousands of data points from historical matches, team performance, player statistics, and more to generate our predictions.
                  </p>
                </div>
              </div>
              <div className="page-col page-col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="bi bi-shield-check fs-3"></i>
                  </div>
                  <h3 className="h5">Reliable</h3>
                  <p>
                    Our prediction models are continuously tested and refined to ensure the highest possible accuracy and reliability.
                  </p>
                </div>
              </div>
              <div className="page-col page-col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="bi bi-people fs-3"></i>
                  </div>
                  <h3 className="h5">User-Focused</h3>
                  <p>
                    We're committed to providing an intuitive, accessible platform that serves both casual fans and serious bettors.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Our Approach */}
          <div className="about-section">
            <h2 className="h3">Our Approach to Predictions</h2>
            <div className="page-row g-4">
              <div className="page-col page-col-md-6">
                <div className="approach-item">
                  <div className="approach-icon">
                    <i className="bi bi-database"></i>
                  </div>
                  <div className="approach-content">
                    <h3 className="h5">Comprehensive Data Collection</h3>
                    <p>
                      We gather extensive data from multiple sources, including match results, team statistics, player performance, historical trends, and even external factors like weather conditions and travel distances.
                    </p>
                  </div>
                </div>
              </div>
              <div className="page-col page-col-md-6">
                <div className="approach-item">
                  <div className="approach-icon">
                    <i className="bi bi-cpu"></i>
                  </div>
                  <div className="approach-content">
                    <h3 className="h5">Advanced Algorithms</h3>
                    <p>
                      Our team employs sophisticated statistical models, machine learning algorithms, and AI techniques to analyze data and generate predictions with high accuracy rates.
                    </p>
                  </div>
                </div>
              </div>
              <div className="page-col page-col-md-6">
                <div className="approach-item">
                  <div className="approach-icon">
                    <i className="bi bi-arrow-repeat"></i>
                  </div>
                  <div className="approach-content">
                    <h3 className="h5">Continuous Improvement</h3>
                    <p>
                      We constantly evaluate and refine our prediction models based on actual outcomes, ensuring that our system learns and improves over time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="page-col page-col-md-6">
                <div className="approach-item">
                  <div className="approach-icon">
                    <i className="bi bi-eye"></i>
                  </div>
                  <div className="approach-content">
                    <h3 className="h5">Expert Oversight</h3>
                    <p>
                      While our predictions are primarily data-driven, our team of football analysts reviews the outputs to ensure they align with real-world factors that may not be captured in the data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coverage */}
          <div className="mission-card">
            <h2 className="h3 text-center">Our Coverage</h2>
            <p className="text-center mb-4">
              SokaPulse provides predictions and analysis for a wide range of football competitions worldwide:
            </p>
            <div className="page-row g-4">
              <div className="page-col page-col-md-3">
                <div className="coverage-card">
                  <h4 className="h6">Major European Leagues</h4>
                  <ul className="list-unstyled mt-3 mb-0">
                    <li>Premier League</li>
                    <li>La Liga</li>
                    <li>Bundesliga</li>
                    <li>Serie A</li>
                    <li>Ligue 1</li>
                  </ul>
                </div>
              </div>
              <div className="page-col page-col-md-3">
                <div className="coverage-card">
                  <h4 className="h6">International Competitions</h4>
                  <ul className="list-unstyled mt-3 mb-0">
                    <li>FIFA World Cup</li>
                    <li>UEFA Euro</li>
                    <li>Copa America</li>
                    <li>Africa Cup of Nations</li>
                    <li>International Friendlies</li>
                  </ul>
                </div>
              </div>
              <div className="page-col page-col-md-3">
                <div className="coverage-card">
                  <h4 className="h6">Club Competitions</h4>
                  <ul className="list-unstyled mt-3 mb-0">
                    <li>UEFA Champions League</li>
                    <li>UEFA Europa League</li>
                    <li>Copa Libertadores</li>
                    <li>CAF Champions League</li>
                    <li>Domestic Cups</li>
                  </ul>
                </div>
              </div>
              <div className="page-col page-col-md-3">
                <div className="coverage-card">
                  <h4 className="h6">Other Leagues</h4>
                  <ul className="list-unstyled mt-3 mb-0">
                    <li>MLS</li>
                    <li>Brazilian Serie A</li>
                    <li>Argentine Primera División</li>
                    <li>J1 League</li>
                    <li>A-League</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
      
        </div>
      </div>
    </div>
  );
} 