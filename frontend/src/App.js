import { useEffect, useState } from "react";
import {
  addCartItem,
  fetchCart,
  fetchProducts,
  removeCartItem,
  submitOrder,
} from "./api/api";
import CheckoutForm from "./components/CheckoutForm";
import CartSummary from "./components/CartSummary";
import ProductList from "./components/ProductList";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState({ products: false, cart: false });
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderForm, setOrderForm] = useState({
    customer_name: "Comfort Shopper",
    email: "shopper@example.com",
    address: "21 Commerce Ave, Suite 200",
  });

  const loadProducts = async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const loadCart = async () => {
    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      setError(err.message || "Unable to load cart.");
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const handleAddToCart = async (productId) => {
    setError("");
    try {
      await addCartItem(productId, 1);
      await loadCart();
      setOrderStatus("Item added to cart.");
    } catch (err) {
      setError(err.message || "Could not add item to cart.");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setError("");
    try {
      await removeCartItem(productId);
      await loadCart();
      setOrderStatus("Item removed.");
    } catch (err) {
      setError(err.message || "Unable to remove item.");
    }
  };

  const handleOrderInputChange = (field) => (event) => {
    setOrderForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCheckout = async () => {
    if (!cart || cart.total_quantity === 0) {
      setOrderStatus("Add items to the cart before checking out.");
      return;
    }

    setOrderStatus("Submitting your order...");
    try {
      const order = await submitOrder(orderForm);
      setOrderStatus(`Order ${order.order_id} confirmed!`);
      await loadCart();
    } catch (err) {
      setOrderStatus(err.message || "Unable to process the order.");
    }
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();
    await handleCheckout();
  };

  const isCheckoutDisabled = loading.cart || (cart && cart.total_quantity === 0);

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Het Commerce Studio</p>
        <h1 className="app-title">Design-forward commerce for modern shoppers.</h1>
        <p className="app-subtitle">
          Browse curated essentials, keep your cart in sync, and place a prototype order backed
          by a FastAPI service.
        </p>
        {error && <p className="status status-error">{error}</p>}
      </header>

      <section className="content-grid">
        <div className="products-column">
          <ProductList products={products} onAdd={handleAddToCart} loading={loading.products} />
        </div>
        <aside className="cart-column">
          <CartSummary cart={cart} onRemove={handleRemoveFromCart} loading={loading.cart} />
          <CheckoutForm
            values={orderForm}
            onFieldChange={handleOrderInputChange}
            onSubmit={handleCheckoutSubmit}
            disabled={Boolean(isCheckoutDisabled)}
            status={orderStatus}
          />
        </aside>
      </section>
    </div>
  );
}

export default App;
