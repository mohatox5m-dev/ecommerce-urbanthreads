// Shop page — products loaded from Firestore collection "products"

import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { initFirebase, getFirebaseAuth, getFirebaseDb } from "./firebase.js";
import {
    setupNavbar,
    getUserCart,
    saveUserCart
} from "./navbar-auth.js";

setupNavbar();

const productGrid = document.getElementById("product-grid");
const categoryFilter = document.getElementById("category-filter");
const productMessage = document.getElementById("product-message");

let allProducts = [];
let currentUser = null;

if (!initFirebase()) {
    productMessage.textContent =
        "Fix firebase-config.js, then refresh (use Live Server).";
    productMessage.className = "error";
} else {
    const auth = getFirebaseAuth();

    onAuthStateChanged(auth, user => {
        currentUser = user;
    });

    loadProductsFromFirestore();
}

async function loadProductsFromFirestore() {
    productMessage.textContent = "Loading products from Firestore…";

    try {
        const db = getFirebaseDb();
        const snapshot = await getDocs(collection(db, "products"));

        allProducts = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        }));

        if (allProducts.length === 0) {
            productMessage.innerHTML =
                "No products yet. Add them on <a href=\"admin.html\">admin.html</a>.";
            productMessage.className = "error";
            return;
        }

        productMessage.textContent =
            `${allProducts.length} products loaded from Firestore.`;
        productMessage.className = "";

        const params = new URLSearchParams(window.location.search);
        const categoryFromUrl = params.get("category");

        if (
            categoryFromUrl &&
            [...categoryFilter.options].some(
                opt => opt.value === categoryFromUrl
            )
        ) {
            categoryFilter.value = categoryFromUrl;
        }

        filterProducts();
    } catch (error) {
        console.error(error);

        productMessage.innerHTML =
            "Could not load products. Publish <code>firestore.rules</code> in " +
            "Firebase Console, or add items on <a href=\"admin.html\">admin.html</a>.";

        productMessage.className = "error";
    }
}

function displayProducts(list) {
    productGrid.replaceChildren();

    list.forEach(function(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.imageURL;
        image.alt = product.name;
        image.loading = "lazy";

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h2");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = `R ${Number(product.price).toFixed(2)}`;

        const button = document.createElement("button");
        button.className = "add-to-cart";
        button.textContent = "Add to Cart";
        button.dataset.productId = product.id;

        info.append(category, name, description, price, button);
        card.append(image, info);
        productGrid.append(card);
    });
}

function filterProducts() {
    const category = categoryFilter.value;
    const filtered = category === "All"
        ? allProducts
        : allProducts.filter(p => p.category === category);

    displayProducts(filtered);
}

categoryFilter.addEventListener("change", filterProducts);

productGrid.addEventListener("click", async function(event) {
    const button = event.target.closest(".add-to-cart");

    if (!button) {
        return;
    }

    if (!currentUser) {
        productMessage.textContent =
            "Please log in to add items to your cart.";
        productMessage.className = "error";
        window.setTimeout(function() {
            window.location.href = "login.html?returnTo=shop.html";
        }, 1200);
        return;
    }

    const productId = button.dataset.productId;
    const cart = await getUserCart(currentUser.uid);

    cart[productId] = (cart[productId] || 0) + 1;
    await saveUserCart(currentUser.uid, cart);

    productMessage.textContent = "Added to your cart!";
    productMessage.className = "success";

    const badge = document.getElementById("cart-count");

    if (badge) {
        const total = Object.values(cart).reduce(
            (sum, qty) => sum + Number(qty),
            0
        );
        badge.textContent = total;
    }
});
