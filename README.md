Varoille Shop 🛒

A responsive e-commerce front end: product listing, search, category filter, price sorting, product details, and a shopping cart that persists after a page refresh (localStorage).

⚙️ Tech Stack

React 18 + React Router (routing)

Tailwind CSS (utility styling)

products.json as the data source (easily swapped for a REST API)

🚀 Setup Instructions
## Getting Started

1. `npm install`
2. `npm run dev`
3. `Open http://localhost:5173`
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
