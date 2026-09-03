/**
 * Kept as a re-export after the descriptor CRUD was generalised into
 * lib/cms/descriptors/crud.ts. Existing Laptop Bank call sites import from
 * here; new code should import from the shared kit directly.
 */
export * from "@/lib/cms/descriptors/crud";
