Varoille Shop 🛒

A responsive e-commerce front end: product listing, search, category filter, price sorting, product details, and a shopping cart that persists after a page refresh (localStorage).

🎨 Color Scheme

The theme is built around the gradient burst image (red → orange → yellow on black, with blue edges):

Role

Hex

Background (near-black)

#08080D

Surface / cards

#12121C

Surface elevated

#1A1A28

Border

#262640

Text primary

#F4F4FA

Text muted

#9A9AB0

Primary gradient (buttons, hero, logo)

#FF2E4C → #FF7A18 → #FFC837 (red → orange → yellow)

Accent / highlights (badges, links)

#3D7BFF (blue)

Price text

#FFC837 (yellow)

Danger / remove

#FF2E4C (red)

Rules: dark background everywhere, the red→orange→yellow gradient is used only for primary actions (hero, Add to Cart, logo), blue only for accents and highlights, yellow for prices and ratings. Never mix the gradient with blue on the same element.

⚙️ Tech Stack

React 18 + React Router (routing)

Tailwind CSS (utility styling)

products.json as the data source (easily swapped for a REST API)

🚀 Setup Instructions

# 1. Create the project
npm create vite@latest varoille-shop -- --template react
cd varoille-shop
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 2. Configure Tailwind (tailwind.config.js)
#    content: ["./index.html", "./src/**/*.{js,jsx}"]

# 3. Add the theme colors to tailwind.config.js
#    theme: { extend: { colors: {
#      night: "#08080D", surface: "#12121C", surface2: "#1A1A28",
#      border: "#262640", ink: "#F4F4FA", muted: "#9A9AB0",
#      brand: { red: "#FF2E4C", orange: "#FF7A18", yellow: "#FFC837", blue: "#3D7BFF" }
#    }}}

# 4. Create src/data/products.json with the product array
#    (same shape as in the app: id, name, category, price, rating, image, description)

# 5. Build the components:
#    src/components/Header.jsx, ProductCard.jsx, ProductList.jsx,
#    ProductDetails.jsx, CartDrawer.jsx
#    src/App.jsx wires routing + cart state (see app canvas)

# 6. Run it
npm run dev        # → http://localhost:5173

# 7. Production build
npm run build && npm run preview

🌐 Live Deployment (free)

# Vercel
npm i -g vercel && vercel          # or: drag the repo into app.vercel.com

# Netlify
npm i -g netlify-cli && netlify deploy --prod

Both give you an instant live link. Configure SPA redirects (/* → /index.html 200) so React Router deep links work.

📁 Project Structure

varoille-shop/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetails.jsx
│   │   └── CartDrawer.jsx
│   ├── data/
│   │   └── products.json
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── README.md

✨ Features

Product listing — responsive grid (1–4 columns)

Search — live name search from the header

Category filter — Audio, Wearables, Accessories, Displays

Sorting — Featured / Price low→high / high→low

Product details — dedicated route per product (/product/:id)

Cart — add, change quantity, remove, live total

Persistence — cart saved to localStorage, survives refresh
