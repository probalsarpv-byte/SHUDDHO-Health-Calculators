# SHUDDHO V5.2 — Firebase Optional Sync Setup

V5.2 keeps every V5/V5.1 local feature. Firebase is optional.

## 1. Create/use a Firebase project
Use the Spark/free plan initially.

## 2. Add a Web App
Firebase Console → Project settings → Your apps → Web app.
Copy the web config values into:
`firebase/firebase-config.js`

Do not add service-account/private admin keys to GitHub.

## 3. Authentication
Firebase Console → Authentication → Sign-in method:
- Enable Google
- Enable Email/Password if you want email accounts

Authentication → Settings → Authorized domains:
add your GitHub Pages hostname:
`probalsarpv-byte.github.io`

## 4. Firestore
Create Cloud Firestore, then publish the rules from:
`firebase/firestore.rules`

The rule allows a signed-in user to access only:
`users/{their_uid}/...`

## 5. Deploy
Upload the complete V5.2 package to the same GitHub repository root.

## Sync behavior
- Guest: localStorage only
- Signed in: localStorage + private Firestore sync
- Local save happens first
- Auto-sync every ~30 seconds while online/active
- Sync also runs after login, returning online, and returning to the tab
- Per-key latest timestamp wins
- Sign-out does not delete local data
- Privacy Center can export/import local backup and delete local/cloud data

## Cost-control design
V5.2 does not continuously stream every tracker record. It syncs SHUDDHO local data keys only when changed, reducing Firestore reads/writes.
