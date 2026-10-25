# Urban Threads Store — assignment plan

Beginner e-commerce app: **HTML, CSS, JavaScript** + **Firebase Auth** + **Firestore**.

## Pages (`react/src/UrbanThreadsStore/`)

| Page | Files | Assignment feature |
|------|--------|-------------------|
| Home | `index.html`, `index.js` | Landing + categories |
| Shop | `shop.html`, `shop.js` | Products from Firestore `products` |
| Login | `login.html`, `login.js` | Sign up, log in (Email/Password) |
| Cart | `cart.html`, `cart.js` | Cart summary; login required |
| Admin | `admin.html`, `admin.js` | Admins add/delete products in Firestore |
| Seed (once) | `seed-products.html`, `seed-products.js` | Optional bulk upload (admin only) |

Shared: `navbar-auth.js` (user email/name, log out, cart badge), `firebase-config.js`, `firebase.js`, `products.js` (seed data only).

## Run locally

1. Paste Firebase web config in `firebase-config.js`.
2. Enable **Authentication → Email/Password** and create **Firestore**.
3. Open the folder with **Live Server** (not `file://`). Start at `index.html`.
4. Publish **`firestore.rules`** in the Firebase Console.
5. Open **`admin.html`** → add products → view them on **`shop.html`** (no admin login required for products).
6. Sign up / log in → shop → add to cart → `cart.html`.

## Data in Firebase

- **Authentication → Users** — accounts from sign-up.
- **Firestore → `products`** — catalog (name, price, category, description, imageURL).
- **Firestore → `users/{uid}`** — profile + **`cart`** object (`productId → quantity`).

Optional: paste `firestore.rules` into Firebase Console → Firestore → Rules.

Setup details: **FIREBASE-AUTH-SETUP.md** in the same folder.
