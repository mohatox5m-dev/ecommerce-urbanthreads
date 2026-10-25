# Urban Threads Store

Beginner e-commerce assignment: HTML, CSS, JavaScript, Firebase Auth, and Firestore.

## App location

Open with **Live Server** (or any static server):

`react/src/UrbanThreadsStore/index.html`

## Setup

1. Copy `react/src/UrbanThreadsStore/firebase-config.example.js` to `firebase-config.js` and paste your Firebase web config.
2. Enable **Authentication (Email/Password)** and **Firestore** in the [Firebase Console](https://console.firebase.google.com/).
3. Publish `react/src/UrbanThreadsStore/firestore.rules` under Firestore → Rules.
4. See `react/src/UrbanThreadsStore/FIREBASE-AUTH-SETUP.md` for step-by-step instructions.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing |
| `shop.html` | Products from Firestore |
| `login.html` | Sign up / log in |
| `cart.html` | Cart (login required) |
| `admin.html` | Add products |
