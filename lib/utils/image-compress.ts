"use client";

/**
 * Client-side image downscaling for form uploads.
 *
 * Spec 5.8 BEHAVIOUR: "Compress image uploads client-side to a maximum 1600px
 * long edge before upload." Spec §6.2 repeats it for proof of enrolment, and
 * Draft 1 §13.2 gives the reason: "phone photographs are large" — an applicant
 * on mobile data uploading a 6 MB camera JPEG is the failure case, and Draft 1
 * §14.5 names upload failures as "the fault most likely to be silently losing
 * you applicants".
 */

export const MAX_LONG_EDGE = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Returns a downscaled JPEG, or the original file untouched.
 *
 * The original is returned unchanged when:
 * - the file is not an image. A PDF proof of enrolment is explicitly allowed
 *   by spec §6.2 and must pass through byte-for-byte;
 * - the image is already within MAX_LONG_EDGE, so re-encoding would only lose
 *   quality for no size win;
 * - anything in the canvas path fails or is unavailable. Silently shipping the
 *   original is the right degradation: a large upload still succeeds, whereas
 *   throwing would lose the applicant entirely.
 */
export async function compressImage(file: File, maxEdge: number = MAX_LONG_EDGE): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") return file;

  let objectUrl: string | undefined;

  try {
    objectUrl = URL.createObjectURL(file);
    const image = await loadImage(objectUrl);

    const longEdge = Math.max(image.naturalWidth, image.naturalHeight);
    if (longEdge <= maxEdge) return file;

    const scale = maxEdge / longEdge;
    const width = Math.round(image.naturalWidth * scale);
    const height = Math.round(image.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });
    if (!blob) return file;

    // Guard against the pathological case where re-encoding grew the file —
    // possible for a large flat-colour PNG. Never hand back something worse
    // than what the applicant selected.
    if (blob.size >= file.size) return file;

    return new File([blob], replaceExtension(file.name, "jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not decode the selected image."));
    image.src = src;
  });
}

function replaceExtension(name: string, extension: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base || "upload"}.${extension}`;
}

/** Human-readable size, for a "too large" message that names the real number. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
