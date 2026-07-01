import type { DecodedIdToken } from "firebase-admin/auth";

import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";
import type { AdminRole } from "@/types/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export type AdminSessionUser = {
  uid: string;
  email: string;
  name?: string;
  role: AdminRole;
  source: "custom-claim" | "env" | "firestore";
};

export function getAdminSessionCookieName() {
  return "itfy-admin-session";
}

export function getAdminSessionMaxAgeMs() {
  const days = Number(process.env.FIREBASE_SESSION_COOKIE_DAYS ?? 5);
  return days * 24 * 60 * 60 * 1000;
}

function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminRole(value: unknown): value is AdminRole {
  return value === "super-admin" || value === "editor" || value === "viewer";
}

function getRoleFromClaims(decodedToken: DecodedIdToken): AdminRole | null {
  if (decodedToken.admin === true) {
    return "super-admin";
  }

  if (isAdminRole(decodedToken.role)) {
    return decodedToken.role;
  }

  return null;
}

async function getRoleFromFirestore(decodedToken: DecodedIdToken): Promise<AdminRole | null> {
  const db = await getAdminFirestore();

  if (!db) {
    return null;
  }

  const usersCollection = db.collection(FIREBASE_COLLECTIONS.users);
  const uidDoc = await usersCollection.doc(decodedToken.uid).get();

  if (uidDoc.exists) {
    const data = uidDoc.data() ?? {};
    const isActive = data.status === undefined || data.status === "active";
    const role = data.role ?? data.adminRole;

    if (isActive && isAdminRole(role)) {
      return role;
    }
  }

  if (!decodedToken.email) {
    return null;
  }

  const emailMatch = await usersCollection
    .where("email", "==", decodedToken.email.toLowerCase())
    .limit(1)
    .get();

  if (emailMatch.empty) {
    return null;
  }

  const data = emailMatch.docs[0].data();
  const isActive = data.status === undefined || data.status === "active";
  const role = data.role ?? data.adminRole;

  return isActive && isAdminRole(role) ? role : null;
}

export async function resolveAdminUser(
  decodedToken: DecodedIdToken,
): Promise<AdminSessionUser | null> {
  if (!decodedToken.email) {
    return null;
  }

  const email = decodedToken.email.toLowerCase();
  const claimRole = getRoleFromClaims(decodedToken);

  if (claimRole) {
    return {
      uid: decodedToken.uid,
      email,
      name: decodedToken.name,
      role: claimRole,
      source: "custom-claim",
    };
  }

  if (getAllowedAdminEmails().includes(email)) {
    return {
      uid: decodedToken.uid,
      email,
      name: decodedToken.name,
      role: "super-admin",
      source: "env",
    };
  }

  const firestoreRole = await getRoleFromFirestore(decodedToken);

  if (!firestoreRole) {
    return null;
  }

  return {
    uid: decodedToken.uid,
    email,
    name: decodedToken.name,
    role: firestoreRole,
    source: "firestore",
  };
}

export async function createAdminSessionCookie(idToken: string) {
  const auth = await getAdminAuth();

  if (!auth) {
    return {
      configured: false,
      user: null,
      sessionCookie: null,
    };
  }

  const decodedToken = await auth.verifyIdToken(idToken);
  const user = await resolveAdminUser(decodedToken);

  if (!user) {
    return {
      configured: true,
      user: null,
      sessionCookie: null,
    };
  }

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: getAdminSessionMaxAgeMs(),
  });

  return {
    configured: true,
    user,
    sessionCookie,
  };
}

export async function verifyAdminSessionCookie(sessionCookie?: string) {
  const auth = await getAdminAuth();

  if (!auth || !sessionCookie) {
    return null;
  }

  const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  return resolveAdminUser(decodedClaims);
}
