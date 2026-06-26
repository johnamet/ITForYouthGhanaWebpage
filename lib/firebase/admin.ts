import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

type AdminSdkStatus = {
  configured: boolean;
  projectId?: string;
  clientEmail?: string;
  hasPrivateKey: boolean;
};

function getPrivateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

export function getAdminSdkStatus(): AdminSdkStatus {
  return {
    configured: Boolean(
      process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        getPrivateKey(),
    ),
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: Boolean(getPrivateKey()),
  };
}

export function getFirebaseAdminApp(): App | null {
  const status = getAdminSdkStatus();

  if (!status.configured || !status.projectId || !status.clientEmail) {
    return null;
  }

  const existingApp = getApps()[0];
  if (existingApp) {
    return existingApp;
  }

  return initializeApp({
    credential: cert({
      projectId: status.projectId,
      clientEmail: status.clientEmail,
      privateKey: getPrivateKey(),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function getAdminFirestore(): Firestore | null {
  const app = getFirebaseAdminApp();

  if (!app) {
    return null;
  }

  return getFirestore(app);
}
