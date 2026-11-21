# Urban Threads Store

Web store assignment: HTML, CSS, JavaScript, [Firebase](https://firebase.google.com/) Authentication, and Firestore.

Repository: [mohatox5m-dev/ecommerce-urbanthreads](https://github.com/mohatox5m-dev/ecommerce-urbanthreads)

## Quick start

1. **Firebase config** (required on each machine):

   ```text
   react/src/UrbanThreadsStore/firebase-config.example.js
   → copy to firebase-config.js → paste your keys from Firebase Console
   ```

2. **Firebase Console**

   - Enable **Authentication → Email/Password**
   - Create **Firestore Database**
   - Copy `react/src/UrbanThreadsStore/firestore.rules` into **Firestore → Rules** → **Publish**

3. **Run the app**

   - VS Code/Cursor: **Live Server** on folder  
     `react/src/UrbanThreadsStore/`  
   - Or: `npx --yes serve react/src/UrbanThreadsStore -p 3000`  
   - Open `http://localhost:3000/index.html` (port may vary)

4. **Typical flow**

   - `admin.html` — add products (or `seed-products.html` once)
   - `shop.html` — browse from Firestore
   - `login.html` — create account / log in
   - `cart.html` — cart (must be logged in)

Full steps: `react/src/UrbanThreadsStore/FIREBASE-AUTH-SETUP.md` and `plan.md`.

## Structure

| Path | Role |
|------|------|
| `react/src/UrbanThreadsStore/*.html` | Pages |
| `react/src/UrbanThreadsStore/*.js` | Logic (ES modules + Firebase CDN) |
| `react/src/UrbanThreadsStore/firestore.rules` | Paste into Firebase Console |

`firebase-config.js` is **not** in git (secrets). Use the example file locally.