/**
 * KCE Connect — Firebase Admin Setup (Middleware)
 * Initializes the Admin SDK for server-side token verification.
 *
 * Set FIREBASE_SERVICE_ACCOUNT in middleware/.env to the full service-account
 * JSON (as a single-line string) from Firebase Console →
 * Project Settings → Service Accounts → Generate new private key.
 *
 * Until the real value is pasted the server starts normally but all
 * Firebase-protected endpoints will return 503 FIREBASE_NOT_CONFIGURED.
 */
import admin from 'firebase-admin';

const PLACEHOLDER = 'PASTE_YOUR_SERVICE_ACCOUNT_JSON_HERE';
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!admin.apps.length) {
  if (serviceAccountJson && serviceAccountJson !== PLACEHOLDER) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('🔥 Firebase Admin SDK initialised.');
    } catch (e: any) {
      console.error('❌ Firebase Admin: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON —', e.message);
      console.warn('⚠️  Firebase-protected endpoints will not work until a valid config is provided.');
    }
  } else {
    console.warn('⚠️  Firebase Admin: FIREBASE_SERVICE_ACCOUNT is not set.');
    console.warn('   → Go to Firebase Console → Project Settings → Service Accounts → Generate new private key.');
    console.warn('   → Paste the JSON value into middleware/.env as FIREBASE_SERVICE_ACCOUNT=\'{"type":"service_account",...}\'');
    console.warn('   → The server is running but Firebase-protected routes will return 503 until configured.\n');
  }
}

export default admin;
