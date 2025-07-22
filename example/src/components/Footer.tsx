import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <h3>My Awesome App</h3>
            <p>
              Building amazing experiences with cutting-edge technology. Your
              trusted partner for digital solutions.
            </p>
            <p>Serving customers worldwide since 2020</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#about" title="Learn more about our company">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" title="View our services">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#careers" title="Join our team">
                  Careers
                </a>
              </li>
              <li>
                <a href="#blog" title="Read our latest articles">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3>Customer Support</h3>
            <ul>
              <li>
                <a href="#help" title="Get help and support">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" title="Contact our support team">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#faq" title="Frequently asked questions">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#returns" title="Return policy information">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <p>Stay connected for updates and news</p>
            <div className="footer-social">
              <a
                href="#facebook"
                title="Follow us on Facebook"
                aria-label="Facebook page"
              >
                Facebook
              </a>
              <a
                href="#twitter"
                title="Follow us on Twitter"
                aria-label="Twitter profile"
              >
                Twitter
              </a>
              <a
                href="#linkedin"
                title="Connect with us on LinkedIn"
                aria-label="LinkedIn company page"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© 2024 My Awesome App. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy" title="Read our privacy policy">
                Privacy Policy
              </a>
              <a href="#terms" title="View terms of service">
                Terms of Service
              </a>
              <a href="#cookies" title="Cookie policy information">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
