// Connects to Firebase only after your keys are set in firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { firebaseConfig, isConfigReady } from "./firebase-config.js";

let app = null;
let auth = null;
let db = null;

/**
 * Call this before sign-up or log-in.
 * Returns false if firebase-config.js still has placeholder values.
 */
export function initFirebase() {
    if (!isConfigReady()) {
        return false;
    }

    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    }

    return true;
}

export function getFirebaseAuth() {
    return auth;
}

export function getFirebaseDb() {
    return db;
}
