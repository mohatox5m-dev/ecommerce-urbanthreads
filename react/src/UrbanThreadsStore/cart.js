// Cart page — login required; cart on users/{uid}.cart in Firestore

import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
    setupNavbar,
    requireLogin,
    getUserCart,
    saveUserCart
} from "./navbar-auth.js";
import { initFirebase, getFirebaseDb } from "./firebase.js";

setupNavbar();

const cartItemsContainer = document.getElementById("cart-items");
const cartMessage = document.getElementById("cart-message");
const summaryQuantity = document.getElementById("summary-quantity");
const subtotalElement = document.getElementById("cart-subtotal");
const totalElement = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

let products = [];
let cart = {};
let user = null;

function formatPrice(amountInCents) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR"
    }).format(amountInCents / 100);
}

async function loadProducts() {
    const db = getFirebaseDb();
    const snapshot = await getDocs(collection(db, "products"));

    products = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
    }));
}

function renderCart() {
    cartItemsContainer.replaceChildren();
    cartMessage.textContent = "";

    const entries = Object.entries(cart);

    if (entries.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-cart";
        empty.innerHTML =
            "<h2>Your cart is empty</h2><p><a href=\"shop.html\">Continue shopping</a></p>";
        cartItemsContainer.append(empty);
    }

    let totalQty = 0;
    let subtotalCents = 0;

    entries.forEach(function([productId, quantity]) {
        const product = products.find(p => p.id === productId);

        if (!product) {
            return;
        }

        const qty = Number(quantity);
        const priceCents = Math.round(Number(product.price) * 100);
        const lineCents = priceCents * qty;

        totalQty += qty;
        subtotalCents += lineCents;

        const item = document.createElement("article");
        item.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.imageURL;
        image.alt = product.name;

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("h2");
        name.textContent = product.name;

        const linePrice = document.createElement("p");
        linePrice.textContent =
            `${formatPrice(priceCents)} × ${qty} = ${formatPrice(lineCents)}`;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-item";
        removeBtn.textContent = "Remove";
        removeBtn.dataset.productId = productId;

        const decreaseBtn = document.createElement("button");
        decreaseBtn.type = "button";
        decreaseBtn.textContent = "−";
        decreaseBtn.dataset.action = "decrease";
        decreaseBtn.dataset.productId = productId;

        const increaseBtn = document.createElement("button");
        increaseBtn.type = "button";
        increaseBtn.textContent = "+";
        increaseBtn.dataset.action = "increase";
        increaseBtn.dataset.productId = productId;

        const controls = document.createElement("div");
        controls.className = "quantity-controls";
        controls.append(decreaseBtn, increaseBtn);

        details.append(name, linePrice, controls, removeBtn);
        item.append(image, details);
        cartItemsContainer.append(item);
    });

    summaryQuantity.textContent = totalQty;
    subtotalElement.textContent = formatPrice(subtotalCents);
    totalElement.textContent = formatPrice(subtotalCents);
}

cartItemsContainer.addEventListener("click", async function(event) {
    const button = event.target.closest("button");

    if (!button || !user) {
        return;
    }

    const productId = button.dataset.productId;
    const action = button.dataset.action;

    if (!Object.hasOwn(cart, productId)) {
        return;
    }

    if (action === "increase") {
        cart[productId] = Math.min(99, cart[productId] + 1);
    } else if (action === "decrease") {
        if (cart[productId] > 1) {
            cart[productId] -= 1;
        } else {
            delete cart[productId];
        }
    } else if (button.classList.contains("remove-item")) {
        delete cart[productId];
    } else {
        return;
    }

    await saveUserCart(user.uid, cart);
    renderCart();

    const badge = document.getElementById("cart-count");

    if (badge) {
        const total = Object.values(cart).reduce(
            (sum, qty) => sum + Number(qty),
            0
        );
        badge.textContent = total;
    }
});

checkoutButton.addEventListener("click", function() {
    if (Object.keys(cart).length === 0) {
        cartMessage.textContent = "Your cart is empty.";
        return;
    }

    cartMessage.textContent =
        "Checkout complete (demo). Your lecturer may add payment later.";
    cartMessage.className = "success";
});

async function start() {
    if (!initFirebase()) {
        cartMessage.textContent = "Firebase is not configured.";
        return;
    }

    user = await requireLogin("cart.html");

    if (!user) {
        return;
    }

    await loadProducts();
    cart = await getUserCart(user.uid);
    renderCart();
}

start();
