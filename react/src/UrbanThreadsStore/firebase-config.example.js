// 1. Copy this file and rename it to: firebase-config.js
// 2. In Firebase Console → Project settings → Your apps → Web app
// 3. Copy the firebaseConfig object and paste the values below.

export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

/**
 * Returns true when every Firebase setting is filled in (not a placeholder).
 */
export function isConfigReady() {
    const placeholders = [
        "YOUR_API_KEY",
        "YOUR_PROJECT_ID",
        "YOUR_SENDER_ID",
        "YOUR_APP_ID"
    ];

    function isFilled(value) {
        if (!value || typeof value !== "string") {
            return false;
        }

        const trimmed = value.trim();
        return trimmed.length > 0 && !placeholders.includes(trimmed);
    }

    return (
        isFilled(firebaseConfig.apiKey) &&
        isFilled(firebaseConfig.authDomain) &&
        isFilled(firebaseConfig.projectId) &&
        isFilled(firebaseConfig.storageBucket) &&
        isFilled(firebaseConfig.messagingSenderId) &&
        isFilled(firebaseConfig.appId)
    );
}