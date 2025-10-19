# Firebase Setup Guide for BuildReign Gaming Support System

This guide will help you connect your support ticket system to Firebase Firestore for real database storage.

## Why Firebase?

Currently, your tickets are stored in **browser localStorage** which means:
- ❌ Tickets only exist on one computer/browser
- ❌ Tickets are lost if browser cache is cleared
- ❌ Admin and customers can't see the same tickets

With Firebase:
- ✅ Tickets stored in the cloud
- ✅ Accessible from any device
- ✅ Real-time updates
- ✅ FREE for small projects (up to 50k reads/day)

## Step 1: Create a Firebase Project

1. Go to **https://console.firebase.google.com/**
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `buildreign-gaming` (or whatever you prefer)
4. Click **"Continue"**
5. **Disable Google Analytics** (optional, not needed for this project)
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

## Step 2: Register Your Web App

1. In your Firebase project console, click the **web icon** `</>` (Add app)
2. Enter app nickname: `BuildReign Support`
3. **DO NOT** check "Firebase Hosting" (we're using GitHub Pages)
4. Click **"Register app"**
5. You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "buildreign-gaming.firebaseapp.com",
    projectId: "buildreign-gaming",
    storageBucket: "buildreign-gaming.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

6. **COPY this configuration** - you'll need it in Step 4
7. Click **"Continue to console"**

## Step 3: Enable Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (allows read/write for development)
   - ⚠️ **Important:** Test mode allows anyone to read/write. This is OK for development, but you'll want to add security rules later for production.
4. Choose a Cloud Firestore location (select one closest to your users):
   - `us-central1` (United States)
   - `europe-west` (Europe)
   - `asia-southeast1` (Asia)
5. Click **"Enable"**
6. Wait for the database to be created

## Step 4: Update Your Config File

1. Open the file: `firebase-config.js`
2. Replace the placeholder values with YOUR config from Step 2:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Example:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyABCDEF123456789-XXXXXXXXXX",
    authDomain: "buildreign-gaming.firebaseapp.com",
    projectId: "buildreign-gaming",
    storageBucket: "buildreign-gaming.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
};
```

3. Save the file

## Step 5: Push to GitHub

```bash
git add firebase-config.js firebase-db.js support.html portal.html admin.html support.js admin.js
git commit -m "Connect support system to Firebase Firestore"
git push origin main
```

## Step 6: Test Your Setup

1. Wait 1-2 minutes for GitHub Pages to update
2. Go to your website: **https://j3team.github.io/buildreign-gaming/support.html**
3. Open browser console (F12)
4. You should see: `✅ Firebase initialized successfully!`
5. Submit a test ticket
6. Go to Firebase Console → Firestore Database
7. You should see a new collection called **`tickets`** with your ticket data!

## Step 7: Verify Realtime Sync

1. Open your website in **Chrome**
2. Open your website in **Firefox** (or another browser/device)
3. Submit a ticket in Chrome
4. Refresh the portal in Firefox
5. The ticket should appear in both browsers! 🎉

## Security Rules (Important for Production)

Currently, your database is in "test mode" which allows anyone to read/write. For production:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with these more secure ones:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{ticketId} {
      // Anyone can create tickets
      allow create: if true;

      // Users can read their own tickets
      allow read: if request.auth != null &&
                     resource.data.email == request.auth.token.email;

      // Only admins can update/delete (you'd need to implement auth)
      allow update, delete: if false;
    }
  }
}
```

3. Click **"Publish"**

**Note:** For full admin access, you'll need to implement Firebase Authentication. The current system will continue working with test mode.

## Troubleshooting

### ⚠️ "Firebase not configured" in console
- Check that you updated `firebase-config.js` with your actual Firebase credentials
- Make sure the file is committed and pushed to GitHub

### ⚠️ Tickets still using localStorage
- Clear your browser cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for Firebase errors

### ⚠️ "Permission denied" errors
- Your Firestore rules may be too restrictive
- Go back to "test mode" temporarily to debug

## What's Next?

Your support system now uses Firebase! Features:

✅ All tickets stored in Firebase Firestore cloud database
✅ Accessible from any device
✅ Real-time syncing across browsers
✅ Automatic fallback to localStorage if Firebase is unavailable
✅ Admin can view all tickets from all customers
✅ Customers can view their own tickets

## Need Help?

- **Firebase Documentation:** https://firebase.google.com/docs/firestore
- **Firebase Console:** https://console.firebase.google.com/

---

Generated for BuildReign Gaming Support System
https://j3team.github.io/buildreign-gaming/
