from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Dict, List, Optional
from uuid import uuid4

app = FastAPI(
    title="Het E-Commerce API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Product(BaseModel):
    id: int
    name: str
    price: float
    description: str
    category: str
    image_url: str
    inventory: int


class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class CartItemOut(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    total_price: float


class CartSummary(BaseModel):
    items: List[CartItemOut]
    total_quantity: int
    total_price: float


class OrderIn(BaseModel):
    customer_name: str = Field(..., min_length=2)
    email: EmailStr
    address: str = Field(..., min_length=5)


class OrderOut(BaseModel):
    order_id: str
    cart: CartSummary
    message: str


PRODUCT_CATALOG: List[Product] = [
    Product(
        id=1,
        name="Aurora Leather Backpack",
        price=129.0,
        description="Saddle leather backpack with quilted stitching and an organized interior.",
        category="Accessories",
        image_url="https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=600&q=80",
        inventory=12,
    ),
    Product(
        id=2,
        name="Nova Runner Sneakers",
        price=98.0,
        description="Lightweight knit sneakers with responsive foam cushioning.",
        category="Footwear",
        image_url="https://images.unsplash.com/photo-1528701800489-20f9d599c7fd?auto=format&fit=crop&w=600&q=80",
        inventory=20,
    ),
    Product(
        id=3,
        name="Lumen Smartwatch",
        price=249.0,
        description="Always-on OLED display with activity insights and wireless charging.",
        category="Wearables",
        image_url="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80",
        inventory=7,
    ),
    Product(
        id=4,
        name="Halcyon Minimalist Wallet",
        price=54.0,
        description="Slim silicone wallet that keeps cards organized without bulking the pocket.",
        category="Essentials",
        image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        inventory=25,
    ),
    Product(
        id=5,
        name="Vela Ceramic Diffuser Kit",
        price=72.0,
        description="Hand-glazed diffuser that pairs essential oils with soft LED lighting.",
        category="Home",
        image_url="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
        inventory=11,
    ),
    Product(
        id=6,
        name="Orion Desk Lamp",
        price=136.0,
        description="Modular desk lamp with touch dimming and built-in wireless charge pad.",
        category="Home",
        image_url="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80",
        inventory=8,
    ),
]

_cart: Dict[int, int] = {}
_orders: List[OrderOut] = []


def _find_product(product_id: int) -> Optional[Product]:
    return next((product for product in PRODUCT_CATALOG if product.id == product_id), None)


def _build_cart_summary() -> CartSummary:
    items: List[CartItemOut] = []
    total_quantity = 0
    total_price = 0.0

    for product_id, quantity in _cart.items():
        product = _find_product(product_id)
        if not product:
            continue

        item_total = round(product.price * quantity, 2)
        items.append(
            CartItemOut(
                product_id=product.id,
                name=product.name,
                price=product.price,
                quantity=quantity,
                total_price=item_total,
            )
        )
        total_quantity += quantity
        total_price += item_total

    return CartSummary(items=items, total_quantity=total_quantity, total_price=round(total_price, 2))


@app.get("/products", response_model=List[Product])
def list_products() -> List[Product]:
    return PRODUCT_CATALOG


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int) -> Product:
    product = _find_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.get("/cart", response_model=CartSummary)
def read_cart() -> CartSummary:
    return _build_cart_summary()


@app.post("/cart/items", response_model=CartSummary)
def add_cart_item(payload: CartItemIn) -> CartSummary:
    product = _find_product(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    current_quantity = _cart.get(payload.product_id, 0)
    if current_quantity + payload.quantity > product.inventory:
        raise HTTPException(
            status_code=400,
            detail="Quantity exceeds available inventory",
        )

    _cart[payload.product_id] = current_quantity + payload.quantity
    return _build_cart_summary()


@app.delete("/cart/items/{product_id}", response_model=CartSummary)
def remove_cart_item(product_id: int) -> CartSummary:
    if product_id not in _cart:
        raise HTTPException(status_code=404, detail="Item not in cart")

    del _cart[product_id]
    return _build_cart_summary()


@app.post("/orders", response_model=OrderOut)
def create_order(order: OrderIn) -> OrderOut:
    summary = _build_cart_summary()
    if summary.total_quantity == 0:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order_id = f"ORD-{uuid4().hex[:8].upper()}"
    response = OrderOut(
        order_id=order_id,
        cart=summary,
        message="Your order has been received. We will share tracking details shortly.",
    )

    _orders.append(response)
    _cart.clear()
    return response


@app.get("/orders", response_model=List[OrderOut])
def list_orders() -> List[OrderOut]:
    return _orders
