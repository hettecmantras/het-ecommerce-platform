const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

async function handleResponse(response) {
  let payload = null;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    payload = await response.json();
  }

  if (!response.ok) {
    const detail = payload?.detail ?? payload?.message ?? payload?.error;
    throw new Error(detail || "An unexpected error occurred.");
  }

  return payload;
}

export const fetchProducts = () => fetch(`${API_BASE_URL}/products`).then(handleResponse);
export const fetchCart = () => fetch(`${API_BASE_URL}/cart`).then(handleResponse);

export const addCartItem = (product_id, quantity) =>
  fetch(`${API_BASE_URL}/cart/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, quantity }),
  }).then(handleResponse);

export const removeCartItem = (product_id) =>
  fetch(`${API_BASE_URL}/cart/items/${product_id}`, { method: "DELETE" }).then(handleResponse);

export const submitOrder = (payload) =>
  fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);
