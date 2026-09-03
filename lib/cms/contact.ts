import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { contactPageContent as seedContact } from "@/lib/content/contact-config";
import type { ContactPageContent } from "@/types/content";
import { toPlainData } from "@/lib/utils/plain";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Reads the contact page content from the siteContent collection (id
 * "contact"), falling back to the seed.
 *
 * Overrides go through the shared merger, so this reader gains three things it
 * did not have: Firestore Timestamps stripped before the data can reach a
 * Client Component, an empty stored value meaning "not overridden" rather than
 * blanking a live heading, and support for the flat-path keys the generated
 * editor writes alongside the whole-value keys the old form wrote.
 */
export async function getCmsContactPage(): Promise<ContactPageContent> {
  const db = await getAdminFirestore();
  if (!db) return seedContact;

  try {
    const collection = db.collection(FIREBASE_COLLECTIONS.siteContent);

    // Try direct doc id
    const direct = await collection.doc("contact").get();
    if (direct.exists) {
      return applyOverrides(
        seedContact as unknown as Record<string, unknown>,
        toPlainData((direct.data() ?? {}) as Record<string, unknown>),
      ) as unknown as ContactPageContent;
    }

    // Try slug query
    const bySlug = await collection.where("slug", "==", "contact").limit(1).get();
    if (!bySlug.empty) {
      return applyOverrides(
        seedContact as unknown as Record<string, unknown>,
        toPlainData((bySlug.docs[0].data() ?? {}) as Record<string, unknown>),
      ) as unknown as ContactPageContent;
    }

    return seedContact;
  } catch (e) {
    console.error("Contact page read failed. Falling back to seed content.", e);
    return seedContact;
  }
}
