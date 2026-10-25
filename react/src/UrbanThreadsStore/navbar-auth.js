// Shared navbar: show user name/email, log out, cart count from Firestore.

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initFirebase, getFirebaseAuth, getFirebaseDb } from "./firebase.js";

export async function getUserCart(uid) {
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
        return {};
    }

    const cart = snap.data().cart;

    if (cart && typeof cart === "object" && !Array.isArray(cart)) {
        return cart;
    }

    return {};
}

export async function saveUserCart(uid, cart) {
    const db = getFirebaseDb();
    await setDoc(doc(db, "users", uid), { cart }, { merge: true });
}

async function updateCartCount(uid) {
    const badge = document.getElementById("cart-count");

    if (!badge) {
        return;
    }

    const cart = await getUserCart(uid);
    const total = Object.values(cart).reduce(
        (sum, qty) => sum + Number(qty),
        0
    );

    badge.textContent = total;
}

export function setupNavbar() {
    if (!initFirebase()) {
        return;
    }

    const auth = getFirebaseAuth();
    const navUser = document.getElementById("nav-user");
    const loginLink = document.getElementById("nav-login-link");
    const logoutBtn = document.getElementById("nav-logout-btn");
    const cartLink = document.getElementById("nav-cart-link");
    const adminLink = document.getElementById("nav-admin-link");

    onAuthStateChanged(auth, async user => {
        if (user) {
            const name = user.displayName || user.email;

            if (navUser) {
                navUser.textContent = `Hi, ${name}`;
            }

            if (loginLink) {
                loginLink.hidden = true;
            }

            if (logoutBtn) {
                logoutBtn.hidden = false;
            }

            if (cartLink) {
                cartLink.hidden = false;
            }

            if (adminLink) {
                adminLink.hidden = false;
            }

            await updateCartCount(user.uid);
        } else {
            if (navUser) {
                navUser.textContent = "";
            }

            if (loginLink) {
                loginLink.hidden = false;
            }

            if (logoutBtn) {
                logoutBtn.hidden = true;
            }

            if (cartLink) {
                cartLink.hidden = true;
            }

            if (adminLink) {
                adminLink.hidden = false;
            }

            const badge = document.getElementById("cart-count");

            if (badge) {
                badge.textContent = "0";
            }
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function() {
            await signOut(auth);
            window.location.href = "index.html";
        });
    }
}

export function requireLogin(returnTo) {
    const page = returnTo || "cart.html";

    if (!initFirebase()) {
        window.location.href = "login.html";
        return Promise.resolve(null);
    }

    const auth = getFirebaseAuth();

    return new Promise(resolve => {
        const stop = onAuthStateChanged(auth, user => {
            stop();

            if (!user) {
                window.location.href =
                    `login.html?returnTo=${encodeURIComponent(page)}`;
                resolve(null);
                return;
            }

            resolve(user);
        });
    });
}
