# Shopzi

A full-stack e-commerce app built with the MERN stack - product browsing, cart, Razorpay checkout, and an AI shopping assistant that can search the live catalog and navigate the UI for you.

## Features

- AI shopping assistant - a chat widget powered by Groq (`openai/gpt-oss-20b`) with function calling, so it can run real `search_products` / `go_to_listing` queries against the catalog instead of guessing
- Product catalog with category, price, and keyword filters, infinite-scroll listing
- Weighted "Top Rated" sort, a Bayesian-style score blending rating and review count, so a handful of 5-star reviews can't outrank thousands of 4.5-star ones
- Home page deal carousels: a per-category grid and randomized "Under ₹X" price-deal cards, both pulled from real product data
- Product detail page with an image gallery and a custom CSS hover-to-zoom
- Cart (persisted in `localStorage`) and a full checkout flow
- Razorpay payment integration (test mode), with signature verification before any order is written to the database
- JWT-based authentication (register/login)
- Dependency-free image loading states and broken-image fallback (inline SVG, no external placeholder services)

## Tech Stack

**Frontend:** React, React Router, Tailwind CSS, Axios, Vite
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
**Payments:** Razorpay
**AI:** Groq API (`openai/gpt-oss-20b`)

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Razorpay](https://razorpay.com) account (test mode keys)
- A [Groq](https://groq.com) API key

### 1. Clone and install

```bash
git clone https://github.com/arssambasha/Shopzi.git
cd Shopzi

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Create `backend/.env`:

### 4. Run locally

```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```

The frontend dev server proxies `/api` requests to the backend — check `vite.config.js` if your backend runs on a port other than the default.

## API Overview

| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | List products — supports `keyword`, `category`, `maxPrice`, `sort`, `page`, `limit` |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/category-deals` | Randomized per-category deal images |
| GET | `/api/products/price-deals` | Randomized "Under ₹X" deal cards |
| GET | `/api/categories` | All categories |
| POST | `/api/auth/register`, `/api/auth/login` | Auth |
| GET | `/api/auth/profile` | Current user (protected) |
| POST | `/api/orders` | Create an order directly (legacy, unused by the current checkout flow) |
| GET | `/api/orders/myorders`, `/api/orders/:id` | Order lookups (protected) |
| POST | `/api/payment/create-order` | Create a Razorpay order (protected) |
| POST | `/api/payment/verify` | Verify payment signature, create the order (protected) |
| POST | `/api/chat` | AI shopping assistant (rate-limited, 15 req/min/IP) |


Built for learning purpose.