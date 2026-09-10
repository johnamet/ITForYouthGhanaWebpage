import { coerceStringList, type FormValues } from "@/lib/cms/descriptors/form-values";
import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";

/**
 * Turns what the form holds into the document shape the public renderers take.
 *
 * WHY THIS EXISTS AT ALL
 * `FormValues` is a FLAT map of `__`-separated paths whose text entries hold
 * only what is STORED, and whose `stringList` entries hold newline-joined
 * text. The public renderers receive something else entirely: the NESTED
 * object `applyOverrides(seed, stored)` produces, where those keys are arrays
 * and unset copy falls back to the seed. Handing `FormValues` straight to a
 * renderer produced a page with no title on twelve of the sixteen previews and
 * a thrown `.filter` on the other four — an editor could reasonably have read
 * that as the public page being broken and "fixed" it by typing the shipped
 * copy into every field, turning soft seed fallbacks into hard overrides
 * across sixteen pages.
 *
 * So the preview runs the SAME merge the public read runs, against the same
 * merged baseline, with the same optional-key allowlist. Pure and client-safe:
 * `page-overrides.ts` imports nothing but a type, and the coercion below was
 * moved out of `crud.ts` for the same reason.
 */
export type PreviewMergeInputs = {
  /**
   * `mergedRecordFor(descriptor, id, stored)` — seed plus what is stored,
   * exactly what the public getter would hand its renderer before any draft
   * edit. Computed on the server and JSON round-tripped.
   */
  base: Record<string, unknown>;
  /** `optionalKeysOf(descriptor)`: keys a renderer reads but the seed omits. */
  allowKeys: readonly string[];
  /**
   * The descriptor's `stringList` field keys.
   *
   * Needed because a form holds a string list as raw text and the merge
   * refuses a string where the seed holds an array — correctly, that guard is
   * what stops a stray value crashing a `map()`. Coercing here, with the same
   * function the save uses, is what makes list edits show up live.
   */
  stringListKeys: readonly string[];
};

export function previewDocument(
  values: FormValues,
  inputs: PreviewMergeInputs,
): Record<string, unknown> {
  const stored: Record<string, unknown> = { ...values };

  for (const key of inputs.stringListKeys) {
    const raw = stored[key];
    if (typeof raw === "string") stored[key] = coerceStringList(raw);
  }

  return applyOverrides(inputs.base, stored, { allowKeys: inputs.allowKeys });
}
