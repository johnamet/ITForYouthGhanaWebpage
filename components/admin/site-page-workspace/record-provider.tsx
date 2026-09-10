"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SitePageFamily } from "@/lib/cms/site-page-families";
import {
  findSitePageRegion,
  regionForField,
  sitePageRegions,
  type SitePageRegion,
  type SitePageRegionId,
} from "@/lib/cms/site-page-regions";
import { dynamicSitePageSchema } from "@/lib/utils/validators";
import type { EditableSitePage } from "@/types/content";

export type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; message: string }
  | { status: "error"; message: string };

type RegionErrors = Partial<Record<SitePageRegionId, string[]>>;

type SitePageWorkspaceValue = {
  family: SitePageFamily;
  /** The record as the server last returned it. */
  published: EditableSitePage;
  /** The record being edited. */
  draft: EditableSitePage;
  activeRegion: SitePageRegion;
  /** Increments on every edit; keys the preview's boundaries. */
  payloadVersion: number;
  isDirty: boolean;
  dirtyRegions: ReadonlySet<SitePageRegionId>;
  /** Validation messages, attributed to the region owning the field. */
  regionErrors: RegionErrors;
  /** Messages that belong to no single region. */
  formErrors: string[];
  canSave: boolean;
  saveState: SaveState;
  setDraft: (next: EditableSitePage) => void;
  selectRegion: (id: string) => void;
  save: () => Promise<void>;
};

const WorkspaceContext = createContext<SitePageWorkspaceValue | null>(null);

export function useSitePageWorkspace(): SitePageWorkspaceValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useSitePageWorkspace must be used inside SitePageWorkspaceProvider",
    );
  }
  return context;
}

/** Structural comparison; these values are plain JSON by the time they arrive. */
function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

/**
 * The payload actually sent, and the object client validation runs against.
 * `order: 0` is what lib/cms/site-pages.ts writes when a stored document has
 * no order, but the schema demands a positive integer — so a record that has
 * never been ordered would be unsavable until this maps it back to absent.
 */
function toPayload(page: EditableSitePage): EditableSitePage {
  return { ...page, order: page.order || undefined };
}

/**
 * The record as the endpoint would store it. The schema strips blank optional
 * fields, so a draft carrying `description: ""` and the stored record carrying
 * nothing are the same record — comparing them raw reports a permanent, false
 * dirty state after every save.
 *
 * Parses `toPayload(page)`, not `page` itself: canonicalising has to see the
 * same shape the endpoint validates — or a record the payload step would have
 * made valid, such as one with `order: 0`, fails here too, falls back to the
 * raw record on both sides of the comparison, and reintroduces exactly the
 * permanent-dirty bug this function exists to fix.
 *
 * Falls back to the input when the draft does not parse, which is fine: an
 * invalid draft cannot be saved anyway, so its dirtiness only has to be
 * good enough to show "unsaved".
 */
function canonicalRecord(page: EditableSitePage): EditableSitePage {
  const parsed = dynamicSitePageSchema.safeParse(toPayload(page));
  return parsed.success ? (parsed.data as EditableSitePage) : page;
}

/**
 * Splits zod's `fieldErrors` into per-region buckets. A field no region owns
 * cannot be attributed, so its messages go to the page level rather than being
 * silently dropped. Shared by the client validation pass and the server's
 * rejection path, which need identical behaviour.
 */
function groupFieldErrorsByRegion(
  fieldErrors: Record<string, string[] | undefined>,
): { regions: RegionErrors; form: string[] } {
  const regions: RegionErrors = {};
  const form: string[] = [];

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!messages?.length) {
      continue;
    }
    const region = regionForField(field);
    if (!region) {
      form.push(...messages);
      continue;
    }
    regions[region.id] = [...(regions[region.id] ?? []), ...messages];
  }
  return { regions, form };
}

export function SitePageWorkspaceProvider({
  family,
  publishedRecord,
  initialRegionId,
  children,
}: {
  family: SitePageFamily;
  publishedRecord: EditableSitePage;
  initialRegionId: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [published, setPublished] = useState(publishedRecord);
  const [draft, setDraft] = useState(publishedRecord);
  const [activeId, setActiveId] = useState(
    () => findSitePageRegion(initialRegionId).id,
  );
  const [payloadVersion, setPayloadVersion] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  // Errors the server rejected the last save with. Cleared on the next edit,
  // because they describe a payload that no longer exists.
  const [serverErrors, setServerErrors] = useState<{
    regions: RegionErrors;
    form: string[];
  }>({ regions: {}, form: [] });

  const saving = useRef(false);

  // A save calls router.refresh(), which hands this component a new published
  // record. Replace the baseline only — never the draft, or a refresh would
  // discard whatever the editor has typed since.
  useEffect(() => {
    setPublished(publishedRecord);
  }, [publishedRecord]);

  // Tracks the draft as it is RIGHT NOW, so a save that has already sent its
  // payload can tell whether the editor has typed since.
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const applyDraft = useCallback((next: EditableSitePage) => {
    setDraft(next);
    setPayloadVersion((version) => version + 1);
    // Leave saveState and serverErrors alone while a request is outstanding.
    // Resetting them here would snap the UI back to "idle" mid-save, and the
    // in-flight response would then land on top of state it does not describe.
    if (!saving.current) {
      setSaveState({ status: "idle" });
      setServerErrors({ regions: {}, form: [] });
    }
  }, []);

  // Client-side validation with the SAME schema the endpoint uses, which is
  // possible because lib/utils/validators.ts imports only zod. This is for
  // attribution and immediacy; the server still validates and is still
  // authoritative.
  const clientErrors = useMemo(() => {
    const parsed = dynamicSitePageSchema.safeParse(toPayload(draft));
    if (parsed.success) {
      return { regions: {} as RegionErrors, form: [] as string[] };
    }
    const flat = parsed.error.flatten();
    const grouped = groupFieldErrorsByRegion(flat.fieldErrors);
    return {
      regions: grouped.regions,
      form: [...flat.formErrors, ...grouped.form],
    };
  }, [draft]);

  const regionErrors = useMemo<RegionErrors>(() => {
    const merged: RegionErrors = { ...clientErrors.regions };
    for (const [id, messages] of Object.entries(serverErrors.regions)) {
      const key = id as SitePageRegionId;
      merged[key] = [...(merged[key] ?? []), ...(messages ?? [])];
    }
    return merged;
  }, [clientErrors.regions, serverErrors.regions]);

  const formErrors = useMemo(
    () => [...clientErrors.form, ...serverErrors.form],
    [clientErrors.form, serverErrors.form],
  );

  const canonicalDraft = useMemo(() => canonicalRecord(draft), [draft]);
  const canonicalPublished = useMemo(
    () => canonicalRecord(published),
    [published],
  );

  const dirtyRegions = useMemo(() => {
    const dirty = new Set<SitePageRegionId>();
    for (const region of sitePageRegions) {
      const changed = region.fields.some(
        (field) => !sameValue(canonicalDraft[field], canonicalPublished[field]),
      );
      if (changed) {
        dirty.add(region.id);
      }
    }
    return dirty;
  }, [canonicalDraft, canonicalPublished]);

  const isDirty = dirtyRegions.size > 0;
  const canSave =
    isDirty && Object.keys(clientErrors.regions).length === 0 && clientErrors.form.length === 0;

  const activeRegion = findSitePageRegion(activeId);

  const selectRegion = useCallback((id: string) => {
    const region = findSitePageRegion(id);
    setActiveId(region.id);
    // Shallow by design: window.history is native to the App Router since
    // 14.1 and does not re-render the server component, so switching regions
    // never re-reads the record.
    const url = new URL(window.location.href);
    url.searchParams.set("region", region.id);
    window.history.replaceState(null, "", url);
  }, []);

  const save = useCallback(async () => {
    if (!canSave) {
      return;
    }
    if (saving.current) {
      // Say so rather than no-op'ing: canSave is true, so the editor has every
      // reason to expect the click to do something.
      setSaveState({
        status: "error",
        message: "Still saving your previous change — try again in a moment.",
      });
      return;
    }
    // The exact payload this request sends. Compared against draftRef on
    // completion to tell whether the editor has typed since.
    const sent = draft;
    saving.current = true;
    setSaveState({ status: "saving" });

    try {
      // The record's ADDRESS is its published slug, not its draft slug. A
      // rename has to PUT to where the record currently lives; posting to the
      // new slug would 404 because nothing is there yet.
      const response = await fetch(
        `${family.endpointBase}/${encodeURIComponent(published.slug)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toPayload(sent)),
        },
      );
      const payload = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            errors?: { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
          }
        | null;

      if (!response.ok || !payload?.success) {
        // Only attribute these if the draft has not moved on. Errors describing
        // a payload the editor has already edited past are phantoms, and worse
        // than none — they point at fields that may now be valid.
        if (draftRef.current === sent) {
          const grouped = groupFieldErrorsByRegion(
            payload?.errors?.fieldErrors ?? {},
          );
          setServerErrors({
            regions: grouped.regions,
            form: [...(payload?.errors?.formErrors ?? []), ...grouped.form],
          });
        }
        throw new Error(payload?.message || "We couldn't save this page.");
      }

      // The server now holds `sent`, so that is the baseline regardless of what
      // the editor has typed since.
      setPublished(sent);
      setServerErrors({ regions: {}, form: [] });
      setSaveState(
        draftRef.current === sent
          ? { status: "saved", message: payload.message || "Page updated." }
          : {
              status: "saved",
              message:
                "Saved. You have changed the page since — save again to publish those edits.",
            },
      );
      if (sent.slug !== published.slug) {
        // The endpoint moved the record, so the current URL no longer exists.
        router.replace(
          `${family.adminIndex}/${encodeURIComponent(sent.slug)}?region=${activeRegion.id}`,
        );
      } else {
        router.refresh();
      }
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Save failed.",
      });
    } finally {
      saving.current = false;
    }
  }, [
    activeRegion,
    canSave,
    draft,
    family.adminIndex,
    family.endpointBase,
    published.slug,
    router,
  ]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") {
        return;
      }
      // A modified or non-primary click opens a new tab and leaves this tab's
      // draft intact, so there is nothing to warn about.
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/")) {
        return;
      }
      // Navigation within this record's own workspace is not leaving it.
      const here = window.location.pathname;
      if (href === here || href.startsWith(`${here}?`) || href.startsWith(`${here}#`)) {
        return;
      }
      if (
        !window.confirm("You have unsaved changes to this page. Leave and discard them?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  const value = useMemo<SitePageWorkspaceValue>(
    () => ({
      family,
      published,
      draft,
      activeRegion,
      payloadVersion,
      isDirty,
      dirtyRegions,
      regionErrors,
      formErrors,
      canSave,
      saveState,
      setDraft: applyDraft,
      selectRegion,
      save,
    }),
    [
      family,
      published,
      draft,
      activeRegion,
      payloadVersion,
      isDirty,
      dirtyRegions,
      regionErrors,
      formErrors,
      canSave,
      saveState,
      applyDraft,
      selectRegion,
      save,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
