import React from "react";

const CheckoutForm = ({ values, onFieldChange, onSubmit, disabled, status }) => (
  <form className="checkout-card" onSubmit={onSubmit}>
    <h3>Checkout</h3>
    <label>
      Full name
      <input
        type="text"
        required
        value={values.customer_name}
        onChange={onFieldChange("customer_name")}
      />
    </label>
    <label>
      Email address
      <input type="email" required value={values.email} onChange={onFieldChange("email")} />
    </label>
    <label>
      Shipping address
      <input
        type="text"
        required
        value={values.address}
        onChange={onFieldChange("address")}
      />
    </label>
    <button className="primary-btn" type="submit" disabled={disabled}>
      {disabled ? "Add items first" : "Place order"}
    </button>
    <p className="checkout-note">Orders are simulated and reset when the cart is cleared.</p>
    {status && <p className="status status-info">{status}</p>}
  </form>
);

export default CheckoutForm;
