import type {
  ActionLink,
  ContentBlock,
  EditableSitePage,
  HighlightStat,
  RouteCard,
  TrainingCohort,
  TrainingProcessStep,
} from "@/types/content";

export const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

export const panelClass = "rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8";

export const emptyStat: HighlightStat = {
  value: "",
  label: "",
  description: "",
  icon: "",
};

export const emptySection: ContentBlock = {
  title: "",
  body: "",
  bullets: [],
};

export const emptyCta: ActionLink = {
  label: "",
  href: "/",
};

export const emptyRelatedCard: RouteCard = {
  href: "/",
  eyebrow: "",
  title: "",
  description: "",
};

export const emptyCohort: TrainingCohort = { id: "", name: "", startDate: "", summary: "", format: "", duration: "", location: "", status: "upcoming" };
export const emptyProcessStep: TrainingProcessStep = { number: "", title: "", description: "", icon: "" };

export function toLines(value?: string[]) {
  return (value ?? []).join("\n");
}

export function fromLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export type SitePageRegionProps = {
  value: EditableSitePage;
  onChange: (next: EditableSitePage) => void;
};
