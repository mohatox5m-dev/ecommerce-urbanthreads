// Login page — Firebase Authentication (+ optional Firestore user profile)

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
    initFirebase,
    getFirebaseAuth,
    getFirebaseDb
} from "./firebase.js";
import { isConfigReady } from "./firebase-config.js";
import { setupNavbar } from "./navbar-auth.js";

setupNavbar();

const authForm = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");
const nameField = document.getElementById("name-field");
const roleField = document.getElementById("role-field");
const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit-button");
const switchModeButton = document.getElementById("switch-mode");
const switchText = document.getElementById("switch-text");
const authMessage = document.getElementById("auth-message");

let isSignup = true;

/** Maps sign-up role choice to Firestore profile fields. */
function resolveSignupRole(roleValue) {
    const role = roleValue === "admin" ? "admin" : "customer";

    return {
        role,
        isAdmin: role === "admin"
    };
}

function showMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = type;
}

function friendlyError(error) {
    const code = error.code || "";

    if (code === "auth/email-already-in-use") {
        return "That email is already registered. Try logging in.";
    }
    if (code === "auth/invalid-email") {
        return "Please enter a valid email address.";
    }
    if (code === "auth/weak-password") {
        return "Password must be at least 6 characters.";
    }
    if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        return "Wrong email or password.";
    }
    if (code === "auth/user-not-found") {
        return "No account with that email. Create an account first.";
    }
    if (code === "auth/invalid-api-key" || code === "auth/api-key-not-valid") {
        return "Invalid API key — check firebase-config.js matches Firebase Console.";
    }
    if (code === "auth/operation-not-allowed") {
        return "Email/Password sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method.";
    }
    if (code === "auth/network-request-failed") {
        return "Network error. Check your internet connection.";
    }

    return error.message || "Something went wrong. Press F12 and check the Console tab.";
}

// --- Checks when the page loads ---
function runStartupChecks() {
    if (window.location.protocol === "file:") {
        showMessage(
            "Open this page with Live Server (http://localhost), not by double-clicking the HTML file.",
            "error"
        );
        submitButton.disabled = true;
        return;
    }

    if (!isConfigReady()) {
        showMessage(
            "Paste your Firebase keys into firebase-config.js (see FIREBASE-AUTH-SETUP.md).",
            "error"
        );
        submitButton.disabled = true;
        return;
    }

    if (!initFirebase()) {
        showMessage("Firebase could not start. Check firebase-config.js.", "error");
        submitButton.disabled = true;
        return;
    }

    const hint = document.getElementById("setup-hint");
    if (hint) {
        hint.hidden = true;
    }
}

runStartupChecks();

switchModeButton.addEventListener("click", function() {
    isSignup = !isSignup;

    authForm.reset();
    if (isConfigReady() && window.location.protocol !== "file:") {
        showMessage("", "");
    } else {
        runStartupChecks();
    }

    nameField.hidden = !isSignup;
    nameInput.required = isSignup;
    roleField.hidden = !isSignup;
    roleInput.required = isSignup;
    passwordInput.autocomplete = isSignup
        ? "new-password"
        : "current-password";

    if (isSignup) {
        formTitle.textContent = "Create your account";
        formDescription.textContent =
            "Join Urban Threads and find your style.";
        submitButton.textContent = "Create Account";
        switchText.textContent = "Already have an account?";
        switchModeButton.textContent = "Log in";
    } else {
        formTitle.textContent = "Welcome back";
        formDescription.textContent =
            "Log in to continue your streetwear journey.";
        submitButton.textContent = "Log In";
        switchText.textContent = "New to Urban Threads?";
        switchModeButton.textContent = "Create account";
    }
});

authForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!isConfigReady() || window.location.protocol === "file:") {
        runStartupChecks();
        return;
    }

    if (!initFirebase()) {
        showMessage("Firebase is not ready. Fix firebase-config.js.", "error");
        return;
    }

    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    if (!email || !password || (isSignup && !name)) {
        showMessage("Please complete all required fields.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage(
            "Your password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    let signupProfile = null;

    if (isSignup) {
        signupProfile = resolveSignupRole(roleInput.value);
    }

    submitButton.disabled = true;
    showMessage(isSignup ? "Creating account…" : "Signing in…", "");

    try {
        if (isSignup) {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(result.user, { displayName: name });

            // Also save a row in Firestore (Database → users collection).
            // Auth users appear under Authentication → Users, not Firestore by default.
            try {
                await setDoc(doc(db, "users", result.user.uid), {
                    displayName: name,
                    email: email,
                    role: signupProfile.role,
                    cart: {},
                    isAdmin: signupProfile.isAdmin,
                    createdAt: new Date().toISOString()
                });
            } catch (firestoreError) {
                console.warn("Auth OK, but Firestore save failed:", firestoreError);
                showMessage(
                    "Account created in Authentication! (Firestore profile not saved — enable Firestore in Console.)",
                    "success"
                );
                setTimeout(function() {
                    window.location.href = "shop.html";
                }, 2000);
                return;
            }

            const roleLabel =
                signupProfile.role === "admin" ? "Store admin" : "Customer";

            showMessage(
                `Account created as ${roleLabel}!`,
                "success"
            );
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            showMessage("Welcome back!", "success");
        }

        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get("returnTo");
        const safeReturn =
            returnTo && /^[a-z0-9.-]+\.html$/i.test(returnTo)
                ? returnTo
                : "shop.html";

        setTimeout(function() {
            window.location.href = safeReturn;
        }, 1500);
    } catch (error) {
        console.error(error);
        showMessage(friendlyError(error), "error");
    } finally {
        submitButton.disabled = false;
    }
});
