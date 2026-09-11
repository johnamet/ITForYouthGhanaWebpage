"use client";

import Link from "next/link";
import { forwardRef, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  ExternalLink,
  FileText,
  Globe2,
  GraduationCap,
  Handshake,
  Home,
  Lightbulb,
  ListChecks,
  MapPinned,
  Megaphone,
  Network,
  Newspaper,
  Search,
  Settings2,
  ShieldCheck,
  Target,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { revalidationMap } from "@/lib/utils/revalidate";

type DocumentationSection = {
  id: string;
  title: string;
  summary: string;
  adminRoute: string;
  publicRoutes: string[];
  purpose: string;
  useWhen: string[];
  howToUpdate: string[];
  publishingNotes: string[];
};

type StatusGuidance = {
  label: string;
  body: string;
};

type ResearchNote = {
  title: string;
  body: string;
  source: string;
};

type DocumentationHelpCentreProps = {
  sections: DocumentationSection[];
  workflowRules: string[];
  statusGuidance: StatusGuidance[];
  researchNotes: ResearchNote[];
  contentHubCount: number;
};

type ReferenceView = "publishing" | "statuses" | "revalidation" | "research";

const sectionIcons: Record<string, LucideIcon> = {
  dashboard: CircleGauge,
  "homepage-content": Home,
  "banner-hero-floating": Megaphone,
  "who-we-are": Users,
  "apply-training": GraduationCap,
  programmes: Network,
  "organisations-partnerships": Handshake,
  "impact-news": Newspaper,
  applications: FileText,
  "settings-contact": Settings2,
};

const commonTasks = [
  {
    sectionId: "homepage-content",
    label: "Update the homepage",
    description: "Hero, ticker, CTAs and sections",
    icon: Home,
  },
  {
    sectionId: "who-we-are",
    label: "Add or update a person",
    description: "Profile, role and department",
    icon: Users,
  },
  {
    sectionId: "impact-news",
    label: "Publish an article",
    description: "News, blogs and public proof",
    icon: Newspaper,
  },
] as const;

const referenceOptions: Array<{
  id: ReferenceView;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "publishing",
    label: "Publishing routine",
    description: "A safe sequence for public changes",
    icon: ShieldCheck,
  },
  {
    id: "statuses",
    label: "Status meanings",
    description: "Published, draft, archived and featured",
    icon: CheckCircle2,
  },
  {
    id: "revalidation",
    label: "Route updates",
    description: "Which public pages refresh after saving",
    icon: MapPinned,
  },
  {
    id: "research",
    label: "Research notes",
    description: "Why the guide is structured this way",
    icon: BookOpenCheck,
  },
];

function sectionSearchText(section: DocumentationSection) {
  return [
    section.title,
    section.summary,
    section.adminRoute,
    ...section.publicRoutes,
    section.purpose,
    ...section.useWhen,
    ...section.howToUpdate,
    ...section.publishingNotes,
  ]
    .join(" ")
    .toLowerCase();
}

function isLinkablePublicRoute(route: string) {
  return route.startsWith("/") && !route.includes("[") && !route.includes(" ");
}

export function DocumentationHelpCentre({
  sections,
  workflowRules,
  statusGuidance,
  researchNotes,
  contentHubCount,
}: DocumentationHelpCentreProps) {
  const [query, setQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(
    sections.find((section) => section.id === "homepage-content")?.id ?? sections[0]?.id ?? "",
  );
  const [referenceView, setReferenceView] = useState<ReferenceView>("publishing");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const referenceRef = useRef<HTMLElement>(null);

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return sections;
    }

    return sections.filter((section) => sectionSearchText(section).includes(normalizedQuery));
  }, [query, sections]);

  const activeSection =
    filteredSections.find((section) => section.id === activeSectionId) ??
    filteredSections[0] ??
    null;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const selectSection = (sectionId: string) => {
    setQuery("");
    setActiveSectionId(sectionId);
  };

  const openReference = (view: ReferenceView) => {
    setReferenceView(view);
    window.requestAnimationFrame(() => {
      referenceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-2xl border border-brand-navy bg-brand-navy px-6 py-7 text-white shadow-panel sm:px-8 lg:py-8">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-20 h-56 w-56 rounded-full border border-white/10" />

        <div className="relative grid items-end gap-8 xl:grid-cols-[minmax(0,1fr)_460px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/65">
                ITFY CMS help centre
              </p>
              <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
              <p className="text-xs font-semibold text-white/65">
                {sections.length} documented areas · {contentHubCount} content hubs
              </p>
            </div>
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
              Find the right place to make a change.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Search by task, page, or content type. Each guide connects the editor you need
              with the public page it updates and the checks to make before publishing.
            </p>
          </div>

          <label className="block" htmlFor="documentation-search">
            <span className="sr-only">Search CMS documentation</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-primary" />
              <input
                ref={searchInputRef}
                id="documentation-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “change homepage hero”"
                aria-controls="documentation-topic-list"
                className="h-14 w-full rounded-xl border border-white/15 bg-white pl-12 pr-20 text-sm font-semibold text-brand-ink shadow-editorial outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  aria-label="Clear documentation search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[0.65rem] font-bold text-slate-400 sm:block">
                  ⌘ K
                </span>
              )}
            </span>
            <span className="mt-2 block min-h-5 text-xs text-white/65" aria-live="polite">
              {query
                ? `${filteredSections.length} ${filteredSections.length === 1 ? "guide" : "guides"} found`
                : `Search across ${sections.length} CMS areas`}
            </span>
          </label>
        </div>
      </section>

      <section aria-labelledby="common-tasks-title" className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
        <div className="grid md:grid-cols-[180px_repeat(3,minmax(0,1fr))]">
          <div className="flex items-center px-5 py-4">
            <div>
              <p id="common-tasks-title" className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Common tasks
              </p>
              <p className="mt-1 text-xs text-slate-500">Jump straight in</p>
            </div>
          </div>
          {commonTasks.map((task) => {
            const Icon = task.icon;

            return (
              <button
                key={task.sectionId}
                type="button"
                onClick={() => selectSection(task.sectionId)}
                className="group flex items-center gap-3 border-t border-brand-border px-5 py-4 text-left transition hover:bg-brand-mist/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold md:border-l md:border-t-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-mist text-brand-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-brand-ink">{task.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{task.description}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-primary" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="self-start xl:sticky xl:top-8">
          <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Browse guides
                </p>
                <p className="mt-1 text-xs font-semibold text-brand-navy">
                  {filteredSections.length} {filteredSections.length === 1 ? "area" : "areas"}
                </p>
              </div>
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div id="documentation-topic-list" className="max-h-[590px] space-y-1 overflow-y-auto p-2 [scrollbar-width:thin]" role="listbox" aria-label="Documentation areas">
              {filteredSections.map((section) => {
                const Icon = sectionIcons[section.id] ?? BookOpenCheck;
                const isActive = activeSection?.id === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setActiveSectionId(section.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1",
                      isActive
                        ? "border-brand-navy bg-brand-navy text-white shadow-[0_8px_20px_rgba(20,40,80,0.14)]"
                        : "border-transparent text-brand-ink hover:border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        isActive ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold">{section.title}</span>
                      <span className={cn("mt-0.5 block truncate text-[0.68rem]", isActive ? "text-white/70" : "text-slate-500")}>{section.summary}</span>
                    </span>
                    <ChevronRight className={cn("h-4 w-4 shrink-0 transition", isActive ? "translate-x-0 text-white/70 opacity-100" : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} />
                  </button>
                );
              })}

              {filteredSections.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Search className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-3 text-sm font-bold text-brand-ink">No guide found</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Try a page name, task, or route.</p>
                </div>
              ) : null}
            </div>

            <div className="border-t border-brand-border bg-slate-50 p-3">
              <p className="px-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                Quick reference
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {referenceOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => openReference(option.id)}
                    className="rounded-lg px-2 py-2 text-left text-[0.68rem] font-bold text-slate-600 transition hover:bg-white hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {activeSection ? (
          <GuidePanel
            section={activeSection}
            index={sections.findIndex((section) => section.id === activeSection.id) + 1}
            total={sections.length}
            workflowRules={workflowRules}
            onOpenReference={openReference}
          />
        ) : (
          <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-brand-border bg-white p-8 text-center shadow-sm">
            <div>
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <h2 className="mt-4 text-xl font-bold text-brand-ink">No matching documentation</h2>
              <p className="mt-2 text-sm text-slate-500">Clear the search and try another task or page name.</p>
              <button type="button" onClick={() => setQuery("")} className="mt-5 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">Show every guide</button>
            </div>
          </div>
        )}
      </section>

      <TechnicalReference
        ref={referenceRef}
        activeView={referenceView}
        onChange={setReferenceView}
        workflowRules={workflowRules}
        statusGuidance={statusGuidance}
        researchNotes={researchNotes}
      />
    </div>
  );
}

function GuidePanel({
  section,
  index,
  total,
  workflowRules,
  onOpenReference,
}: {
  section: DocumentationSection;
  index: number;
  total: number;
  workflowRules: string[];
  onOpenReference: (view: ReferenceView) => void;
}) {
  return (
    <article aria-live="polite" className="min-w-0 overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
      <header className="border-b border-brand-border px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-brand-warm px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.15em] text-brand-gold">
                CMS guide
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {index} of {total}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-brand-ink sm:text-3xl">
              {section.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{section.summary}</p>
          </div>
          <Link href={section.adminRoute} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
            Open editor
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section aria-label="Change path" className="border-b border-brand-border bg-brand-mist/35 px-5 py-5 sm:px-7">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">Your change path</p>
        <div className="mt-3 grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
          <PathStep icon={Target} eyebrow="You want to change" value={section.useWhen[0] ?? section.title} tone="pink" />
          <ChevronRight className="hidden h-4 w-4 text-slate-300 lg:block" />
          <PathStep icon={FileText} eyebrow="Open this editor" value={section.adminRoute} mono />
          <ChevronRight className="hidden h-4 w-4 text-slate-300 lg:block" />
          <PathStep icon={Globe2} eyebrow="Then review" value={section.publicRoutes.join(" · ")} tone="green" mono />
        </div>
      </section>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="px-5 py-6 sm:px-7">
          <section>
            <SectionTitle icon={Target}>When to use this area</SectionTitle>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              {section.useWhen.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-7 border-t border-brand-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle icon={ListChecks}>How to make the update</SectionTitle>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                {section.howToUpdate.length} steps
              </span>
            </div>
            <ol className="mt-4 grid gap-2">
              {section.howToUpdate.map((item, stepIndex) => (
                <li key={item} className="grid grid-cols-[1.65rem_1fr] gap-3 rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-600">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-navy text-[0.65rem] font-bold text-white">
                    {stepIndex + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <details className="group mt-7 border-t border-brand-border pt-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-sm font-bold text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
              <span className="flex items-center gap-2">
                <BookOpenCheck className="h-4 w-4 text-brand-primary" />
                Purpose and context
              </span>
              <span className="rounded-md border border-slate-200 px-2 py-1 text-[0.65rem] text-slate-500">
                <span className="group-open:hidden">Expand</span>
                <span className="hidden group-open:inline">Collapse</span>
              </span>
            </summary>
            <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-600">{section.purpose}</p>
          </details>
        </div>

        <aside className="border-t border-brand-border bg-slate-50 px-5 py-6 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">Before publishing</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><ShieldCheck className="h-4 w-4" /></span>
          </div>
          <ul className="mt-4 grid gap-3 text-xs leading-5 text-slate-600">
            {section.publishingNotes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="my-5 border-t border-slate-200" />

          <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">Core routine</p>
          <ol className="mt-3 grid gap-2 text-xs font-semibold text-brand-navy">
            {workflowRules.slice(0, 4).map((rule, ruleIndex) => (
              <li key={rule} className="grid grid-cols-[1.35rem_1fr] gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-navy text-[0.58rem] text-white">{ruleIndex + 1}</span>
                <span className="pt-0.5 leading-5">{rule}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-lg border border-brand-border bg-white p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <p className="text-xs leading-5 text-slate-600"><strong className="text-brand-ink">Keep changes focused.</strong> Change one content area, save it, then review the routes named above.</p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border px-5 py-4 sm:px-7">
        <div className="flex flex-wrap gap-2">
          {section.publicRoutes.map((route) =>
            isLinkablePublicRoute(route) ? (
              <Link key={route} href={route} className="inline-flex items-center gap-1.5 rounded-md bg-brand-mist px-2.5 py-1.5 font-mono text-xs font-bold text-brand-navy transition hover:bg-brand-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                {route}
                <ExternalLink className="h-3 w-3" />
              </Link>
            ) : (
              <span key={route} className="rounded-md bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-500">{route}</span>
            ),
          )}
        </div>
        <button type="button" onClick={() => onOpenReference("revalidation")} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-brand-primary transition hover:bg-brand-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
          View route update map
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </footer>
    </article>
  );
}

function PathStep({
  icon: Icon,
  eyebrow,
  value,
  tone = "blue",
  mono = false,
}: {
  icon: LucideIcon;
  eyebrow: string;
  value: string;
  tone?: "blue" | "pink" | "green";
  mono?: boolean;
}) {
  const toneClass = {
    blue: "bg-brand-mist text-brand-primary",
    pink: "bg-brand-warm text-brand-gold",
    green: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", toneClass)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-slate-400">{eyebrow}</p>
          <p className={cn("mt-0.5 line-clamp-2 text-xs font-bold leading-5 text-brand-ink", mono && "font-mono text-[0.68rem] text-brand-navy")}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-navy text-white"><Icon className="h-3.5 w-3.5" /></span>
      <h3 className="text-sm font-bold text-brand-ink">{children}</h3>
    </div>
  );
}

const TechnicalReference = forwardRef<HTMLElement, {
  activeView: ReferenceView;
  onChange: (view: ReferenceView) => void;
  workflowRules: string[];
  statusGuidance: StatusGuidance[];
  researchNotes: ResearchNote[];
}>(function TechnicalReference(
  { activeView, onChange, workflowRules, statusGuidance, researchNotes },
  ref,
) {
  return (
    <section ref={ref} id="technical-reference" className="scroll-mt-8 overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
      <div className="border-b border-brand-border px-5 py-5 sm:px-7">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-gold">Technical reference</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-brand-ink">Publishing states and route updates</h2>
            <p className="mt-1 text-sm text-slate-500">Detailed rules stay available without competing with common tasks.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="border-b border-brand-border bg-slate-50 p-3 lg:border-b-0 lg:border-r">
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label="Technical references">
            {referenceOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activeView === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onChange(option.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
                    isActive ? "border-brand-border bg-white text-brand-navy shadow-sm" : "border-transparent text-slate-600 hover:bg-white/70",
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", isActive ? "bg-brand-mist text-brand-primary" : "bg-slate-200/70 text-slate-500")}><Icon className="h-4 w-4" /></span>
                  <span><span className="block text-xs font-bold">{option.label}</span><span className="mt-0.5 block text-[0.65rem] leading-4 text-slate-500">{option.description}</span></span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-7" role="tabpanel">
          {activeView === "publishing" ? <PublishingReference rules={workflowRules} /> : null}
          {activeView === "statuses" ? <StatusReference items={statusGuidance} /> : null}
          {activeView === "revalidation" ? <RevalidationReference /> : null}
          {activeView === "research" ? <ResearchReference notes={researchNotes} /> : null}
        </div>
      </div>
    </section>
  );
});

function PublishingReference({ rules }: { rules: string[] }) {
  return (
    <div>
      <ReferenceHeading title="A safe way to edit the site" description="Use this sequence for every public-facing update." />
      <ol className="mt-5 grid gap-2 md:grid-cols-2">
        {rules.map((rule, index) => (
          <li key={rule} className="grid grid-cols-[1.75rem_1fr] gap-3 rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-navy text-xs font-bold text-white">{index + 1}</span>
            <span>{rule}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StatusReference({ items }: { items: StatusGuidance[] }) {
  return (
    <div>
      <ReferenceHeading title="What each status means" description="Use the least public state until content is ready and approved." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.label} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", index === 0 ? "bg-emerald-500" : index === 1 ? "bg-slate-400" : index === 2 ? "bg-zinc-600" : "bg-brand-gold")} />
              <p className="text-sm font-bold text-brand-ink">{item.label}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevalidationReference() {
  return (
    <div>
      <ReferenceHeading title="What updates after a save" description="These are the base public paths refreshed by each content type. Dynamic records can add their detail route." />
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {Object.entries(revalidationMap).map(([type, paths]) => (
          <div key={type} className="rounded-lg border border-slate-200 p-3">
            <p className="font-mono text-xs font-bold text-brand-navy">{type}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {paths.map((path) => (
                <span key={path} className="rounded-md bg-brand-mist px-2 py-1 font-mono text-[0.65rem] font-semibold text-brand-navy">{path}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResearchReference({ notes }: { notes: ResearchNote[] }) {
  return (
    <div>
      <ReferenceHeading title="Why the guide works this way" description="The structure prioritises action, scanning, and plain language for busy CMS users." />
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {notes.map((note) => (
          <a key={note.title} href={note.source} target="_blank" rel="noopener noreferrer" className="group rounded-lg border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
            <p className="text-sm font-bold text-brand-ink">{note.title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{note.body}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary">Open source <ExternalLink className="h-3 w-3 transition group-hover:translate-x-0.5" /></span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ReferenceHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-brand-ink">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
