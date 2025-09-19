"use client";

import Link from 'next/link';
import Year from './Year';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="row g-4">
          {/* About section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>ABOUT SOKAPULSE</h5>
            <p>
              Welcome to SokaPulse — your premier destination for cutting-edge football analytics and predictions. We combine sophisticated algorithms with expert analysis to deliver unparalleled insights for matches across every continent. Experience football intelligence reimagined.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/sokapulse.fb" target="_blank" rel="noopener noreferrer" 
                 aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://twitter.com/_sokapulse" target="_blank" rel="noopener noreferrer" 
                 aria-label="Twitter">
                <i className="bi bi-twitter-x fs-5"></i>
              </a>
              <a href="https://www.instagram.com/_sokapulse" target="_blank" rel="noopener noreferrer" 
                 aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 col-6 mb-4">
            <h5>QUICK LINKS</h5>
            <ul className="nav flex-column footer-links">
              <li className="nav-item">
                <Link href="/terms-of-use" className="nav-link text-light">Terms of Use</Link>
              </li>
              <li className="nav-item">
                <Link href="/privacy-policy" className="nav-link text-light">Privacy Policy</Link>
              </li>
              <li className="nav-item">
                <Link href="/contact-us" className="nav-link text-light">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link href="/about-us" className="nav-link text-light">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Predictions */}
          <div className="col-lg-3 col-md-6 col-6 mb-4">
            <h5>PREDICTIONS</h5>
            <ul className="nav flex-column footer-links">
              <li className="nav-item">
                <Link href="/today-football-predictions" className="nav-link text-light">Today's Predictions</Link>
              </li>
              <li className="nav-item">
                <Link href="/tomorrow-football-predictions" className="nav-link text-light">Tomorrow's Predictions</Link>
              </li>
              <li className="nav-item">
                <Link href="/weekend-football-predictions" className="nav-link text-light">Weekend Predictions</Link>
              </li>
              <li className="nav-item">
                <Link href="/live-football-predictions" className="nav-link text-light">Live Predictions</Link>
              </li>
            </ul>
          </div>

          {/* Popular League Predictions */}
          <div className="col-lg-3 col-md-6 col-6 mb-4 d-none d-md-block">
            <h5>POPULAR LEAGUES</h5>
            <ul className="nav flex-column footer-links">
              <li className="nav-item">
                <Link href="/football-predictions/league/england/premier-league-39" className="nav-link text-light">English Premier League</Link>
              </li>
              <li className="nav-item">
                <Link href="/football-predictions/league/spain/la-liga-140" className="nav-link text-light">Spain La Liga</Link>
              </li>
              <li className="nav-item">
                <Link href="/football-predictions/league/italy/serie-a-135" className="nav-link text-light">Italy Serie A</Link>
              </li>
              <li className="nav-item">
                <Link href="/football-predictions/league/germany/bundesliga-78" className="nav-link text-light">Germany Bundesliga</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr />
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; <Year /> SokaPulse.com. All rights reserved.
          </div>
          <button 
            type="button" 
            className="btn" 
            id="btn-back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <i className="bi bi-arrow-up"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}
