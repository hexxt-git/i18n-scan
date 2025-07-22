import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={`Product image of ${product.name}`}
        title="Click to view product details"
      />

      <div className="product-card-content">
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-price-row">
          <span className="product-price">${product.price.toFixed(2)}</span>

          {product.inStock ? (
            <span className="stock-status in-stock">In Stock</span>
          ) : (
            <span className="stock-status out-of-stock">Out of Stock</span>
          )}
        </div>

        <div className="product-buttons">
          <button
            className={`btn ${product.inStock ? "btn-primary" : ""}`}
            disabled={!product.inStock}
            title={
              product.inStock
                ? "Add item to shopping cart"
                : "Item currently unavailable"
            }
          >
            {product.inStock ? "Add to Cart" : "Currently Unavailable"}
          </button>

          <button className="btn btn-secondary" title="Save item for later">
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

// Example component showing multiple products
export const ProductGrid: React.FC = () => {
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      description:
        "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
      image: "https://picsum.photos/300/200?random=1",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 299.99,
      description:
        "Feature-rich smartwatch with health monitoring, GPS, and water resistance.",
      image: "https://picsum.photos/300/200?random=2",
      inStock: false,
    },
    {
      id: 3,
      name: "Laptop Backpack",
      price: 49.99,
      description:
        "Durable and stylish backpack designed specifically for laptops up to 15 inches.",
      image: "https://picsum.photos/300/200?random=3",
      inStock: true,
    },
  ];

  return (
    <section className="products-section">
      <div className="container">
        <h2>Featured Products</h2>
        <p>Discover our best-selling items and latest arrivals</p>

        <div className="product-grid">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
