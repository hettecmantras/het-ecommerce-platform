import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, onAdd, loading }) => {
  if (loading) {
    return <p className="status">Loading catalog…</p>;
  }

  if (!products.length) {
    return <p className="status">No products available right now.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
};

export default ProductList;
