# het-ecommerce-platform

Het E-Commerce Platform pairs a modern React storefront with a lightweight Python FastAPI backend to illustrate a full-stack prototype.

## Getting started

### Backend

```bash
python -m venv .venv
source .venv/bin/activate     # macOS/Linux
# on Windows (PowerShell)
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

API base URL: `http://127.0.0.1:8000`. Available endpoints:

- `GET /products`
- `GET /products/{product_id}`
- `GET /cart`
- `POST /cart/items`
- `DELETE /cart/items/{product_id}`
- `POST /orders`

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app defaults to `http://localhost:8000` for API calls but can be overridden by setting `REACT_APP_API_BASE_URL`.

## Development notes

- Frontend keeps local cart state in sync with FastAPI via dedicated service helpers.
- Backend stores catalog, cart, and order history in memory for fast iteration.
