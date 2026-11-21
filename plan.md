# Urban Threads Store — assignment plan

Beginner e-commerce: **HTML, CSS, JavaScript** + **Firebase Auth** + **Firestore**.

## Pages (`react/src/UrbanThreadsStore/`)

| Page | Files | Purpose |
|------|--------|---------|
| Home | `index.html`, `index.js` | Landing + categories |
| Shop | `shop.html`, `shop.js` | Products from Firestore |
| Login | `login.html`, `login.js` | Sign up / log in (role on sign-up) |
| Cart | `cart.html`, `cart.js` | Cart summary (login required) |
| Admin | `admin.html`, `admin.js` | Add / delete products |
| Seed | `seed-products.html`, `seed-products.js` | Optional sample catalog upload |

Shared: `navbar-auth.js`, `firebase-config.js`, `firebase.js`, `firestore.rules`.

## Run locally

1. Copy `firebase-config.example.js` → `firebase-config.js` and paste Firebase web keys.
2. Firebase Console: **Authentication (Email/Password)** + **Firestore**.
3. Publish **`firestore.rules`** (Firestore → Rules → Publish).
4. **Live Server** on this folder — open `index.html` (must be `http://`, not `file://`).
5. **`admin.html`** or **`seed-products.html`** → add products → **`shop.html`**.
6. **`login.html`** → sign up → shop → add to cart → **`cart.html`**.

## Data

- **Authentication → Users** — login accounts  
- **`products`** — catalog fields: name, price, category, description, imageURL  
- **`users/{uid}`** — profile, `role`, `cart` map  

Details: **FIREBASE-AUTH-SETUP.md**