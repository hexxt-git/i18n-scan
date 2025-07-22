import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <h1>My Awesome App</h1>
        <nav className="nav">
          <ul>
            <li>
              <a href="#home" title="Go to homepage">
                Home
              </a>
            </li>
            <li>
              <a href="#about" title="Learn about us">
                About Us
              </a>
            </li>
            <li>
              <a href="#products" title="Browse our products">
                Products
              </a>
            </li>
            <li>
              <a href="#contact" title="Contact our team">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <button title="Sign in to your account">Sign In</button>
      </div>
    </header>
  );
};
