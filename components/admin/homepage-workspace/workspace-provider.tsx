"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
      if (value === undefined) {
        return;
      }

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

        // Fold the saved value into the baseline and clear the draft, so the
        // preview never flickers back to the pre-save copy.
        setPublished((current) => ({ ...current, [key]: value }));
        setDrafts((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
        setSaveState({
          status: "saved",
          message: payload.message || "Homepage section updated.",
        });
        router.refresh();
      } catch (error) {
        // Keep the draft. The editor footer surfaces this message.
        setSaveState({
          status: "error",
          message: error instanceof Error ? error.message : "Save failed.",
        });
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
      const href = anchor.getAttribute("href") ?? "";
      // Only guard in-app navigation that leaves the workspace.
      if (!href.startsWith("/") || href.startsWith("/admin/content/homepage")) {
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
