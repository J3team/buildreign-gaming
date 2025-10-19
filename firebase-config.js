// Firebase Configuration
// Replace these values with your actual Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyDIa7yq_tX47T0-a9NJjnD0B4oug8j6_-g",
    authDomain: "buildreign-gamin-f92b0.firebaseapp.com",
    projectId: "buildreign-gamin-f92b0",
    storageBucket: "buildreign-gamin-f92b0.firebasestorage.app",
    messagingSenderId: "300001609889",
    appId: "1:300001609889:web:1861a27a917b1b281708e0"
};

// Initialize Firebase
let db = null;
let isFirebaseConfigured = false;

function initializeFirebase() {
    try {
        // Check if config has been updated
        if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
            console.warn('⚠️ Firebase not configured. Using localStorage fallback.');
            console.log('To use Firebase:');
            console.log('1. Go to https://console.firebase.google.com');
            console.log('2. Create a new project or select existing');
            console.log('3. Add a web app to get your config');
            console.log('4. Update firebase-config.js with your credentials');
            isFirebaseConfigured = false;
            return false;
        }

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        isFirebaseConfigured = true;

        console.log('✅ Firebase initialized successfully!');
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        console.log('Falling back to localStorage');
        isFirebaseConfigured = false;
        return false;
    }
}

// Check if Firebase is available
if (typeof firebase !== 'undefined') {
    initializeFirebase();
} else {
    console.warn('⚠️ Firebase SDK not loaded. Using localStorage fallback.');
}
