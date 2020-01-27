import admin from 'firebase-admin';

const app = admin.initializeApp();
export const db = admin.firestore();
export const auth = admin.auth();

export default app;
