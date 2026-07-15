import React from "react";

const CartSummary = ({ cart, onRemove, loading }) => {
  const hasItems = cart?.total_quantity > 0;

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      {loading ? (
        <p className="status">Syncing cart…</p>
      ) : hasItems ? (
        <ul className="cart-items">
          {cart.items.map((item) => (
            <li key={item.product_id} className="cart-item">
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="cart-item-meta">
                <span>${item.total_price.toFixed(2)}</span>
                <button className="ghost-btn" onClick={() => onRemove(item.product_id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="status">Your cart is empty.</p>
      )}
      <div className="cart-footer">
        <span>Total</span>
        <strong>${(cart?.total_price ?? 0).toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default CartSummary;
