# Step-by-step: Firebase setup for Urban Threads login

Follow these steps in order. Your login file is:

`react/src/UrbanThreadsStore/login.html`

Your config file is:

`react/src/UrbanThreadsStore/firebase-config.js`

---

## Step 1 — Create a Firebase project (if you do not have one)

1. Open: https://console.firebase.google.com/
2. Sign in with your Google account.
3. Click **Create a project** (or **Add project**).
4. Enter a name, e.g. `UrbanThreadsStore`.
5. Click through the steps (Google Analytics on or off — either is fine).
6. When finished, you land on the **Project overview** page.

---

## Step 2 — Register a Web app and get your keys

1. On the project overview, click the **Web** icon (`</>`).  
   - If you already added a web app, click the **gear** → **Project settings** → scroll to **Your apps**.
2. App nickname: `Urban Threads Web` → **Register app**.
3. You will see a code block like this (yours will have real values):

```javascript
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

4. In Cursor/VS Code, open:

   `react/src/UrbanThreadsStore/firebase-config.js`

5. Copy **each value** from the Console into the matching line:

| Console field | Paste into `firebase-config.js` |
|---------------|----------------------------------|
| `apiKey` | `apiKey: "..."` |
| `authDomain` | `authDomain: "..."` |
| `projectId` | `projectId: "..."` |
| `storageBucket` | `storageBucket: "..."` |
| `messagingSenderId` | `messagingSenderId: "..."` |
| `appId` | `appId: "..."` |

6. **Save** the file (`Ctrl+S`).  
   - Nothing should still say `YOUR_API_KEY` or `YOUR_PROJECT_ID`.

**Where to find keys later:** Gear icon → **Project settings** → **General** → **Your apps** → your web app → **Firebase SDK snippet** → **Config**.

---

## Step 3 — Enable Email/Password sign-in

1. In the left menu: **Build** → **Authentication**.
2. Click **Get started** (first time only).
3. Open the **Sign-in method** tab.
4. Click **Email/Password** in the list.
5. Turn **Enable** ON (first toggle).
6. Click **Save**.

You do **not** need “Email link” for this assignment unless your lecturer asks for it.

---

## Step 4 — Create Firestore Database

1. Left menu: **Build** → **Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** (good for learning; locks down later).
4. Pick a **location** (e.g. closest to you) → **Enable**.
5. Wait until you see an empty database screen (no collections yet).

After you sign up in the app, you should see a collection named **`users`**.

---

## Step 5 — Open `login.html` with Live Server

Firebase will **not** work if you double-click the HTML file (`file://`).

### Option A — VS Code / Cursor “Live Server” extension

1. Install extension: **Live Server** (by Ritwick Dey).
2. In the file tree, go to:  
   `react/src/UrbanThreadsStore/`
3. Right-click **`login.html`** → **Open with Live Server**.
4. Your browser opens something like:  
   `http://127.0.0.1:5500/react/src/UrbanThreadsStore/login.html`  
   (port may differ — that is OK as long as it starts with `http://`).

### Option B — Cursor simple server (if you use npm in `react` folder)

From terminal in `react` folder:

```bash
npx --yes serve src/UrbanThreadsStore -p 3000
```

Then open: http://localhost:3000/login.html

---

## Step 6 — Create a test account

1. On the login page, leave **Create your account** mode (default).
2. Fill in:
   - Full name  
   - Email (use a real format, e.g. `test@example.com`)  
   - Password (at least **6** characters)
3. Click **Create Account**.
4. You should see a **green** success message, then redirect to the shop.

If you see a **red** message, read it — it usually means keys, Live Server, or Email/Password is not enabled.

---

## Step 7 — Verify in Firebase Console

### Authentication (required)

1. **Build** → **Authentication** → **Users** tab.
2. You should see your email in the table.

### Firestore (if Step 4 is done)

1. **Build** → **Firestore Database** → **Data** tab.
2. Open collection **`users`**.
3. Open the document whose ID is a long random string (that is the user’s `uid`).
4. Fields should include `displayName`, `email`, `createdAt`.

---

## Step 8 — Firestore rules and products

1. Copy **`firestore.rules`** from this folder into Firebase Console → Firestore → **Rules** → **Publish**.  
   (Products are open for the class project; each user can read/write only their own `users/{uid}` doc when logged in.)
2. Open **`admin.html`** (navbar → **Admin**) and save products, or **`seed-products.html`** once for samples.
3. Open **`shop.html`** to see them.

Fields saved to **`products`**: `name`, `price`, `category`, `description`, `imageURL`.

---

## Quick troubleshooting

| Problem | What to do |
|---------|------------|
| “Paste your Firebase keys…” | Finish Step 2; save `firebase-config.js` |
| “Open with Live Server…” | Step 5 — URL must be `http://` not `file://` |
| “Email/Password sign-in is disabled” | Step 3 |
| User in Auth but not in Firestore | Step 4; check browser Console (F12) for Firestore errors |
| “Invalid API key” | Copy keys again from Project settings; same project |

---

## What each file does (short)

- **firebase-config.js** — your project keys (from Step 2)
- **firebase.js** — starts Firebase when keys are valid
- **login.js** — creates Auth user + saves Firestore `users` document
