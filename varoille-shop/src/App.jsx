import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
// ---------- Color theme (from the gradient burst) ----------
// Background: near-black  |  Primary: red→orange→yellow gradient  |  Accent: blue
const COLORS = {
  bg: "#08080D",
  surface: "#12121C",
  surface2: "#1A1A28",
  border: "#262640",
  text: "#F4F4FA",
  muted: "#9A9AB0",
  red: "#FF2E4C",
  orange: "#FF7A18",
  yellow: "#FFC837",
  blue: "#3D7BFF",
};

const GRADIENT = `linear-gradient(135deg, ${COLORS.red}, ${COLORS.orange} 45%, ${COLORS.yellow})`;

// ---------- Product data (in a real project this lives in products.json / an API) ----------
const PRODUCTS = [
  { id: 1, name: "Aurora Wireless Headphones", category: "Audio", price: 129.99, rating: 4.6, image: "🎧", description: "Over-ear headphones with active noise cancelling, 40-hour battery life, and deep bass tuned for immersive listening." },
  { id: 2, name: "Pulse Bluetooth Speaker", category: "Audio", price: 59.99, rating: 4.3, image: "🔊", description: "Compact portable speaker with 360° sound, IPX7 water resistance, and 12 hours of playtime." },
  { id: 3, name: "Nimbus Smart Watch", category: "Wearables", price: 199.99, rating: 4.5, image: "⌚", description: "Fitness tracking, heart-rate monitoring, sleep analysis, and a vivid AMOLED display with 7-day battery." },
  { id: 4, name: "Nova Fitness Band", category: "Wearables", price: 49.99, rating: 4.1, image: "💪", description: "Lightweight activity band that tracks steps, workouts, and calories with a 10-day battery." },
  { id: 5, name: "Vertex Mechanical Keyboard", category: "Accessories", price: 89.99, rating: 4.7, image: "⌨️", description: "Hot-swappable switches, aluminum frame, and per-key RGB lighting for precision typing." },
  { id: 6, name: "Glide Ergonomic Mouse", category: "Accessories", price: 45.99, rating: 4.4, image: "🖱️", description: "Sculpted for comfort with an 8000 DPI sensor, six programmable buttons, and silent clicks." },
  { id: 7, name: "Lumen 4K Monitor 27\"", category: "Displays", price: 349.99, rating: 4.8, image: "🖥️", description: "27-inch 4K IPS panel with 99% sRGB coverage, HDR400, and a frameless design." },
  { id: 8, name: "Lumen Portable Display 15\"", category: "Displays", price: 179.99, rating: 4.2, image: "📺", description: "Slim 15.6-inch 1080p USB-C display for a second screen anywhere you work." },
  { id: 9, name: "ChargeHub 65W GaN Charger", category: "Accessories", price: 39.99, rating: 4.5, image: "🔌", description: "Three-port GaN charger that powers a laptop and two devices at once." },
  { id: 10, name: "Echo Studio Microphone", category: "Audio", price: 119.99, rating: 4.4, image: "🎙️", description: "USB condenser microphone with cardioid pickup and zero-latency monitoring." },
  { id: 11, name: "Flux Wireless Charger Pad", category: "Accessories", price: 29.99, rating: 4.0, image: "🔋", description: "15W fast wireless charging pad with a slim, anti-slip fabric finish." },
  { id: 12, name: "Nimbus Sport Watch SE", category: "Wearables", price: 129.99, rating: 4.2, image: "🛰️", description: "Rugged GPS sports watch with 30 workout modes and 14-day battery life." },
];

const CATEGORIES = ["All", "Audio", "Wearables", "Accessories", "Displays"];

// ---------- Cart persistence ----------
const STORAGE_KEY = "varoille-cart-v1";

function loadCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function cartCount(cart) {
  return Object.values(cart).reduce((s, q) => s + q, 0);
}
function cartTotal(cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

// ---------- Header ----------
function Header({ query, setQuery, onOpenCart, count }) {
  return (
    <header
      className="sticky top-0 z-30 px-4 py-3 md:px-8"
      style={{ background: "rgba(8,8,13,0.85)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.border}` }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 md:gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-black text-black"
            style={{ background: GRADIENT }}
          >
            V
          </span>
          <span className="hidden text-lg font-bold tracking-wide sm:inline" style={{ color: COLORS.text }}>
            VAROILLE
          </span>
        </Link>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.text }}
        />
        <button
          onClick={onOpenCart}
          className="relative shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-black"
          style={{ background: GRADIENT }}
        >
          🛒 <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: COLORS.blue, color: "#fff" }}
            >
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

// ---------- Product card ----------
function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="text-xs" style={{ color: COLORS.yellow }}>
      {"★".repeat(full)}{"☆".repeat(5 - full)}
      <span className="ml-1" style={{ color: COLORS.muted }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <div
      className="flex flex-col rounded-2xl p-4 transition-transform hover:-translate-y-1"
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div
          className="mb-3 flex h-36 items-center justify-center rounded-xl text-6xl"
          style={{ background: COLORS.surface2 }}
        >
          {product.image}
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: "rgba(61,123,255,0.15)", color: COLORS.blue }}
        >
          {product.category}
        </span>
        <h3 className="mt-2 font-semibold leading-snug" style={{ color: COLORS.text }}>
          {product.name}
        </h3>
      </Link>
      <Stars rating={product.rating} />
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="text-lg font-bold" style={{ color: COLORS.yellow }}>
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={() => onAdd(product.id)}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-85"
          style={{ background: GRADIENT }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ---------- Product listing ----------
function ProductList({ query, setQuery, addToCart }) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(query.toLowerCase().trim())
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, category, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      {/* Hero */}
      <div
        className="mb-6 rounded-3xl p-6 md:p-10"
        style={{ background: GRADIENT, color: "#111" }}
      >
        <h1 className="text-2xl font-black md:text-4xl">Tech essentials, vividly priced.</h1>
        <p className="mt-1 text-sm font-medium opacity-80 md:text-base">
          Free shipping over $150 · 30-day returns
        </p>
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="rounded-full px-3 py-1.5 text-sm font-medium"
            style={
              c === category
                ? { background: GRADIENT, color: "#000", border: "1px solid transparent" }
                : { background: COLORS.surface, color: COLORS.muted, border: `1px solid ${COLORS.border}` }
            }
          >
            {c}
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto rounded-lg px-3 py-1.5 text-sm outline-none"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.text }}
        >
          <option value="default">Sort: Featured</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center" style={{ color: COLORS.muted }}>
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}
      <button onClick={() => setQuery("")} className="hidden" />
    </div>
  );
}

// ---------- Product details ----------
function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product)
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center" style={{ color: COLORS.muted }}>
        Product not found.{" "}
        <Link to="/" style={{ color: COLORS.blue }}>Back to shop</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm font-medium" style={{ color: COLORS.blue }}>
        ← Back
      </button>
      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="flex h-72 items-center justify-center rounded-3xl text-9xl"
          style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}` }}
        >
          {product.image}
        </div>
        <div className="flex flex-col">
          <span
            className="self-start rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: "rgba(61,123,255,0.15)", color: COLORS.blue }}
          >
            {product.category}
          </span>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl" style={{ color: COLORS.text }}>
            {product.name}
          </h1>
          <div className="mt-1"><Stars rating={product.rating} /></div>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: COLORS.muted }}>
            {product.description}
          </p>
          <p className="mt-4 text-3xl font-black" style={{ color: COLORS.yellow }}>
            ${product.price.toFixed(2)}
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => addToCart(product.id)}
              className="rounded-xl px-5 py-2.5 font-bold text-black"
              style={{ background: GRADIENT }}
            >
              Add to Cart
            </button>
            <button
              onClick={() => { addToCart(product.id); navigate("/"); }}
              className="rounded-xl px-5 py-2.5 font-semibold"
              style={{ background: "transparent", border: `1px solid ${COLORS.blue}`, color: COLORS.blue }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Cart drawer ----------
function CartDrawer({ open, onClose, cart, setQty, removeItem }) {
  if (!open) return null;
  const entries = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty }))
    .filter((e) => e.product);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col p-5"
        style={{ background: COLORS.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Your Cart</h2>
          <button onClick={onClose} className="text-2xl" style={{ color: COLORS.muted }}>×</button>
        </div>

        {entries.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-sm" style={{ color: COLORS.muted }}>
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {entries.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: COLORS.surface2 }}>
                  <span className="text-3xl">{product.image}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: COLORS.text }}>{product.name}</p>
                    <p className="text-sm" style={{ color: COLORS.yellow }}>${(product.price * qty).toFixed(2)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="h-6 w-6 rounded"
                        style={{ background: COLORS.bg, color: COLORS.text }}
                      >−</button>
                      <span className="text-sm" style={{ color: COLORS.text }}>{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="h-6 w-6 rounded"
                        style={{ background: COLORS.bg, color: COLORS.text }}
                      >+</button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-xs font-medium"
                        style={{ color: COLORS.red }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center justify-between text-lg font-bold" style={{ color: COLORS.text }}>
                <span>Total</span>
                <span style={{ color: COLORS.yellow }}>${cartTotal(cart).toFixed(2)}</span>
              </div>
              <button
                className="mt-3 w-full rounded-xl py-3 font-bold text-black"
                style={{ background: GRADIENT }}
              >
                Checkout
              </button>
              <p className="mt-2 text-center text-[11px]" style={{ color: COLORS.muted }}>
                Cart is saved in your browser — it survives a refresh.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const setQty = (id, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  const removeItem = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: COLORS.bg, color: COLORS.text }}>
        <Header query={query} setQuery={setQuery} onOpenCart={() => setCartOpen(true)} count={cartCount(cart)} />
        <Routes>
          <Route path="/" element={<ProductList query={query} setQuery={setQuery} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
        </Routes>
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setQty={setQty} removeItem={removeItem} />
      </div>
    </BrowserRouter>
  );
}