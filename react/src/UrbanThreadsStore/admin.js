// Admin page — add/remove products in Firestore (no role checks)

import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { setupNavbar } from "./navbar-auth.js";
import { initFirebase, getFirebaseDb } from "./firebase.js";

setupNavbar();

const form = document.getElementById("admin-form");
const message = document.getElementById("admin-message");
const list = document.getElementById("admin-product-list");
const saveButton = document.getElementById("admin-save-button");

function showMessage(text, type) {
    message.textContent = text;
    message.className = type || "";
}

function slugFromName(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40);
}

async function loadProductList() {
    list.replaceChildren();

    try {
        const db = getFirebaseDb();
        const snapshot = await getDocs(collection(db, "products"));

        if (snapshot.empty) {
            const empty = document.createElement("li");
            empty.textContent = "No products yet. Add one with the form above.";
            list.append(empty);
            return;
        }

        snapshot.docs.forEach(docSnap => {
            const data = docSnap.data();
            const item = document.createElement("li");
            item.className = "admin-product-row";

            const label = document.createElement("span");
            label.textContent =
                `${data.name} — R ${Number(data.price).toFixed(2)} (${data.category})`;

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "admin-remove";
            removeBtn.textContent = "Delete";
            removeBtn.dataset.productId = docSnap.id;

            item.append(label, removeBtn);
            list.append(item);
        });
    } catch (error) {
        console.error(error);
        showMessage("Could not load products.", "error");
    }
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    let id = String(formData.get("id") || "").trim();
    const price = Number(formData.get("price"));
    const category = String(formData.get("category") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const imageURL = String(formData.get("imageURL") || "").trim();

    if (!name || !category || !description || !imageURL) {
        showMessage("Please fill in all required fields.", "error");
        return;
    }

    if (Number.isNaN(price) || price < 0) {
        showMessage("Enter a valid price.", "error");
        return;
    }

    if (!id) {
        id = `${slugFromName(name)}-${Date.now()}`;
    }

    saveButton.disabled = true;
    showMessage("Saving…", "");

    try {
        const db = getFirebaseDb();

        await setDoc(doc(db, "products", id), {
            name,
            price,
            category,
            description,
            imageURL
        });

        showMessage(`Saved “${name}”. Open shop.html to see it.`, "success");
        form.reset();
        await loadProductList();
    } catch (error) {
        console.error(error);
        showMessage(error.message || "Could not save product.", "error");
    } finally {
        saveButton.disabled = false;
    }
});

list.addEventListener("click", async function(event) {
    const button = event.target.closest(".admin-remove");

    if (!button) {
        return;
    }

    const productId = button.dataset.productId;

    if (!window.confirm(`Delete product ${productId}?`)) {
        return;
    }

    try {
        const db = getFirebaseDb();
        await deleteDoc(doc(db, "products", productId));
        showMessage("Product deleted.", "success");
        await loadProductList();
    } catch (error) {
        console.error(error);
        showMessage("Could not delete product.", "error");
    }
});

function start() {
    if (!initFirebase()) {
        showMessage("Fix firebase-config.js first.", "error");
        form.hidden = true;
        return;
    }

    showMessage("Add products below. They appear on the shop page.", "");
    loadProductList();
}

start();
