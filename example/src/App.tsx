import React from "react";
import { Header } from "./components/Header";
import { ContactForm } from "./components/ContactForm";
import { ProductGrid } from "./components/ProductCard";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to Our Amazing Store</h1>
            <p>Discover quality products at unbeatable prices</p>
            <button className="cta-button" title="Browse our product catalog">
              Shop Now
            </button>
          </div>
        </section>

        <ProductGrid />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}

export default App;
