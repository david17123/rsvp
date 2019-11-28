import admin from 'firebase-admin';

const app = admin.initializeApp();
export const db = admin.firestore();

export default app;
