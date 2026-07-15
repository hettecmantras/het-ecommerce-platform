import React from "react";

const ProductCard = ({ product, onAdd }) => (
  <article className="product-card">
    <img src={product.image_url} alt={product.name} loading="lazy" />
    <div>
      <p className="product-category">{product.category}</p>
      <h3>{product.name}</h3>
      <p className="product-description">{product.description}</p>
    </div>
    <div className="product-footer">
      <div>
        <span className="price">${product.price.toFixed(2)}</span>
        <p className="inventory">Inventory {product.inventory}</p>
      </div>
      <button
        className="primary-btn"
        onClick={() => onAdd(product.id)}
        disabled={product.inventory === 0}
      >
        {product.inventory === 0 ? "Sold out" : "Add to cart"}
      </button>
    </div>
  </article>
);

export default ProductCard;
