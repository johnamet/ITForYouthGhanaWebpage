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

import {
  findWorkspaceSection,
  type HomepageDraftValues,
  type HomepageSectionKey,
  type WorkspaceSection,
} from "@/lib/cms/homepage-sections";

export type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; message: string }
  | { status: "error"; message: string };

type WorkspaceContextValue = {
  /** Published values as last read from the server. */
  published: HomepageDraftValues;
  /** Only sections with unsaved edits appear here. */
  drafts: Partial<HomepageDraftValues>;
  /** published merged with drafts — exactly what the preview renders. */
  values: HomepageDraftValues;
  activeSection: WorkspaceSection;
  /** Increments on every draft change. Keys the preview error boundaries. */
  payloadVersion: number;
  isDirty: (key: HomepageSectionKey) => boolean;
  anyDirty: boolean;
  saveState: SaveState;
  setValue: <K extends HomepageSectionKey>(
    key: K,
    value: HomepageDraftValues[K],
  ) => void;
  selectSection: (id: string) => void;
  save: (key: HomepageSectionKey) => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useWorkspace must be used inside HomepageWorkspaceProvider",
    );
  }
  return context;
}

export function HomepageWorkspaceProvider({
  publishedValues,
  initialSectionId,
  children,
}: {
  publishedValues: HomepageDraftValues;
  initialSectionId: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [published, setPublished] = useState(publishedValues);
  const [drafts, setDrafts] = useState<Partial<HomepageDraftValues>>({});
  const [activeId, setActiveId] = useState(
    () => findWorkspaceSection(initialSectionId).id,
  );
  const [payloadVersion, setPayloadVersion] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  // `save` needs to know what the drafts hold *when its request returns*, not
  // what they held when it was called. Reading state through a ref is the only
  // way to see edits made while the request was in flight.
  const draftsRef = useRef(drafts);
  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  // Keys with a save request currently in flight, so one section cannot have
  // two overlapping writes.
  const inFlight = useRef<Set<HomepageSectionKey>>(new Set());

  // A save calls router.refresh(), which hands this component new published
  // props. Replace the baseline ONLY — never touch drafts, or saving one
  // section would silently discard unsaved edits in another.
  useEffect(() => {
    setPublished(publishedValues);
  }, [publishedValues]);

  const values = useMemo(
    () => ({ ...published, ...drafts }) as HomepageDraftValues,
    [published, drafts],
  );

  const anyDirty = Object.keys(drafts).length > 0;

  const isDirty = useCallback(
    (key: HomepageSectionKey) => key in drafts,
    [drafts],
  );

  const setValue = useCallback(
    <K extends HomepageSectionKey>(key: K, value: HomepageDraftValues[K]) => {
      setDrafts((current) => ({ ...current, [key]: value }));
      setPayloadVersion((version) => version + 1);
      setSaveState({ status: "idle" });
    },
    [],
  );

  const selectSection = useCallback((id: string) => {
    const section = findWorkspaceSection(id);
    setActiveId(section.id);
    // A save result belongs to the section it came from; carrying it across
    // would attribute one section's outcome to another.
    setSaveState({ status: "idle" });
    // Shallow by design. window.history is natively supported by the App
    // Router since Next 14.1 and does NOT re-render the server component, so
    // switching sections never re-runs the seven Firestore getters.
    // router.replace() would.
    const url = new URL(window.location.href);
    url.searchParams.set("section", section.id);
    window.history.replaceState(null, "", url);
  }, []);

  const save = useCallback(
    async (key: HomepageSectionKey) => {
      const value = drafts[key];
      if (value === undefined || inFlight.current.has(key)) {
        return;
      }

      inFlight.current.add(key);
      setSaveState({ status: "saving" });
      try {
        const response = await fetch("/api/admin/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        });
        const payload = (await response.json().catch(() => null)) as
          | { success?: boolean; message?: string }
          | null;

        if (!response.ok || !payload?.success) {
          throw new Error(
            payload?.message || "We couldn't save this homepage section.",
          );
        }

        // The server now holds `value`, so fold it into the baseline
        // regardless — that is simply true.
        setPublished((current) => ({ ...current, [key]: value }));

        // But the editor may have changed this section again while the request
        // was in flight. Clearing the draft unconditionally would discard that
        // newer edit and report the section as saved, which is silent data
        // loss. Only clear when the draft still holds exactly what was sent;
        // `setValue` always creates a new object, so identity is a sound test.
        const superseded = draftsRef.current[key] !== value;

        if (superseded) {
          setSaveState({
            status: "saved",
            message:
              "Saved. You have changed this section since — save again to publish those edits.",
          });
        } else {
          setDrafts((current) => {
            const next = { ...current };
            delete next[key];
            return next;
          });
          setSaveState({
            status: "saved",
            message: payload.message || "Homepage section updated.",
          });
        }
        router.refresh();
      } catch (error) {
        // Keep the draft. The editor footer surfaces this message.
        setSaveState({
          status: "error",
          message: error instanceof Error ? error.message : "Save failed.",
        });
      } finally {
        inFlight.current.delete(key);
      }
    },
    [drafts, router],
  );

  // Browser-level guard for tab close and reload.
  useEffect(() => {
    if (!anyDirty) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [anyDirty]);

  // In-app guard for admin navigation. Capture phase so it runs before the
  // router's own click handling.
  useEffect(() => {
    if (!anyDirty) {
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
      // A modified or non-primary click opens the link in a new tab or window
      // and leaves this tab's drafts untouched, so there is nothing to warn
      // about — and cancelling would block the browser's own behaviour.
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
      // Navigation within the workspace is not leaving it. Matched precisely
      // so a future sibling route such as /admin/content/homepage-archive is
      // not silently exempted from the guard.
      const workspacePath = "/admin/content/homepage";
      if (
        href === workspacePath ||
        href.startsWith(`${workspacePath}?`) ||
        href.startsWith(`${workspacePath}#`)
      ) {
        return;
      }
      const confirmed = window.confirm(
        "You have unsaved homepage changes. Leave and discard them?",
      );
      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [anyDirty]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      published,
      drafts,
      values,
      activeSection: findWorkspaceSection(activeId),
      payloadVersion,
      isDirty,
      anyDirty,
      saveState,
      setValue,
      selectSection,
      save,
    }),
    [
      published,
      drafts,
      values,
      activeId,
      payloadVersion,
      isDirty,
      anyDirty,
      saveState,
      setValue,
      selectSection,
      save,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
