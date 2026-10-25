import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { initFirebase, getFirebaseDb } from "./firebase.js";
import { seedProducts } from "./products.js";

const message = document.getElementById("seed-message");
const button = document.getElementById("seed-button");

button.addEventListener("click", async function() {
    if (!initFirebase()) {
        message.textContent = "Fix firebase-config.js first.";
        message.className = "error";
        return;
    }

    button.disabled = true;
    message.textContent = "Uploading…";

    try {
        const db = getFirebaseDb();

        for (const product of seedProducts) {
            const { id, ...fields } = product;

            await setDoc(doc(db, "products", id), fields);
        }

        message.textContent =
            "Done! Open shop.html — products come from Firestore now.";
        message.className = "success";
    } catch (error) {
        console.error(error);
        message.textContent = "Upload failed. Check the browser Console (F12).";
        message.className = "error";
    } finally {
        button.disabled = false;
    }
});
