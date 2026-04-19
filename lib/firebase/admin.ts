export function getAdminSdkStatus() {
  return {
    configured: Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY),
  };
}
