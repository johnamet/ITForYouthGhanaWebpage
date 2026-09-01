"use client";

import { type FormEvent, useState } from "react";
import clsx from "clsx";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, TextArea, TextInput } from "@/components/ui/form-field";

export type OrganisationEnquiryKind = "job-vacancy" | "staff-volunteering";

type FormValue = string | boolean | string[];
type FormValues = Record<string, FormValue>;

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Record<string, string[]>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

const selectClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

const volunteeringAreaOptions = [
  { value: "mentoring", label: "Mentoring" },
  { value: "workshops", label: "Skills workshops" },
  { value: "career-talks", label: "Career talks" },
  { value: "cv-portfolio-reviews", label: "CV or portfolio reviews" },
  { value: "mock-interviews", label: "Mock interviews" },
  { value: "event-judging", label: "Event or challenge judging" },
  { value: "project-coaching", label: "Project coaching" },
  { value: "other", label: "Other practical support" },
] as const;

const formCopy = {
  "job-vacancy": {
    id: "submit-vacancy",
    eyebrow: "Employer submission",
    title: "Share a vacancy with ITFY talent",
    description:
      "Tell us what the role involves, who it is suited for, and how candidates should apply. The ITFY team will review the details before sharing the opportunity.",
    steps: [
      "Submit accurate role and application details.",
      "The ITFY team reviews the vacancy and checks candidate fit.",
      "Suitable learners or graduates receive clear application instructions.",
    ],
    submitLabel: "Submit vacancy",
  },
  "staff-volunteering": {
    id: "staff-volunteering-enquiry",
    eyebrow: "Staff engagement",
    title: "Plan a useful staff volunteering experience",
    description:
      "Share your company details, team size, skills, and availability. We will use them to suggest a volunteering format that is practical for your staff and valuable to learners.",
    steps: [
      "Tell us who wants to volunteer and what they can offer.",
      "We match your team with a suitable learner or programme need.",
      "Both sides agree the scope, timing, and responsibilities before delivery.",
    ],
    submitLabel: "Send volunteering enquiry",
  },
} as const;

function getInitialValues(kind: OrganisationEnquiryKind): FormValues {
  const shared = {
    kind,
    organisationName: "",
    organisationWebsite: "",
    industry: "",
    contactName: "",
    contactRole: "",
    workEmail: "",
    phone: "",
    preferredContact: "email",
    consent: false,
    companyFax: "",
  };

  if (kind === "job-vacancy") {
    return {
      ...shared,
      roleTitle: "",
      opportunityType: "full-time",
      team: "",
      numberOfOpenings: "1",
      jobLocation: "",
      workArrangement: "on-site",
      entryLevelFit: "yes",
      applicationDeadline: "",
      expectedStartDate: "",
      compensation: "",
      roleSummary: "",
      requirements: "",
      applicationMethod: "",
      additionalNotes: "",
    };
  }

  return {
    ...shared,
    organisationAddress: "",
    numberOfStaff: "1",
    volunteeringAreas: [],
    staffExpertise: "",
    engagementLength: "not-sure",
    availability: "",
    deliveryMode: "flexible",
    preferredLocation: "",
    numberOfLearners: "",
    goals: "",
    additionalNotes: "",
  };
}

function stringValue(values: FormValues, field: string) {
  const value = values[field];
  return typeof value === "string" ? value : "";
}

function SectionIntro({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="border-b border-brand-border pb-4">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-gold">
        Step {number}
      </p>
      <h3 className="mt-2 font-heading text-2xl font-bold text-brand-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export function OrganisationEnquiryForm({ kind }: { kind: OrganisationEnquiryKind }) {
  const copy = formCopy[kind];
  const [values, setValues] = useState<FormValues>(() => getInitialValues(kind));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const getFieldError = (field: string) => fieldErrors[field]?.[0];
  const fieldId = (field: string) => `${kind}-${field}`;

  const updateValue = (field: string, value: FormValue) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateVolunteeringArea = (area: string, checked: boolean) => {
    const currentAreas = Array.isArray(values.volunteeringAreas)
      ? values.volunteeringAreas
      : [];
    const nextAreas = checked
      ? Array.from(new Set([...currentAreas, area]))
      : currentAreas.filter((item) => item !== area);
    updateValue("volunteeringAreas", nextAreas);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    setFieldErrors({});

    try {
      const response = await fetch("/api/organisation-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        setFieldErrors(payload?.errors?.fieldErrors ?? {});
        throw new Error(payload?.message || "We could not send your submission right now.");
      }

      setValues(getInitialValues(kind));
      setSubmitState({
        type: "success",
        message: payload.message || "Thank you. Your submission has been received.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your submission right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={copy.id} className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <aside className="lg:sticky lg:top-40">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-4xl font-bold text-brand-ink sm:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">{copy.description}</p>

          <ol className="mt-8 space-y-4">
            {copy.steps.map((step, index) => (
              <li key={step} className="flex gap-4 text-sm leading-7 text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-[24px] border border-brand-border bg-white p-5 text-sm leading-7 text-slate-600">
            <p className="font-bold text-brand-ink">Need help before submitting?</p>
            <p className="mt-1">
              Email{" "}
              <a className="font-semibold text-brand-primary hover:text-brand-ink" href="mailto:info@itforyouthghana.org">
                info@itforyouthghana.org
              </a>
              .
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="space-y-10 rounded-[30px] border border-brand-border bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="text-sm text-slate-500">
            Fields marked <span className="font-bold text-brand-gold">*</span> are required.
          </p>

          <div className="space-y-6">
            <SectionIntro
              number="1"
              title="About the organisation"
              description="Start with the details the ITFY team will use to understand and verify the organisation."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Organisation name" htmlFor={fieldId("organisationName")} required error={getFieldError("organisationName")}>
                <TextInput
                  id={fieldId("organisationName")}
                  name="organisationName"
                  required
                  autoComplete="organization"
                  value={stringValue(values, "organisationName")}
                  onChange={(event) => updateValue("organisationName", event.target.value)}
                  aria-invalid={Boolean(getFieldError("organisationName"))}
                  placeholder="Company or organisation name"
                />
              </FormField>

              <FormField label="Sector or industry" htmlFor={fieldId("industry")} required error={getFieldError("industry")}>
                <TextInput
                  id={fieldId("industry")}
                  name="industry"
                  required
                  value={stringValue(values, "industry")}
                  onChange={(event) => updateValue("industry", event.target.value)}
                  aria-invalid={Boolean(getFieldError("industry"))}
                  placeholder="For example: fintech, education, telecoms"
                />
              </FormField>

              {kind === "staff-volunteering" ? (
                <FormField label="Organisation address" htmlFor={fieldId("organisationAddress")} required error={getFieldError("organisationAddress")}>
                  <TextInput
                    id={fieldId("organisationAddress")}
                    name="organisationAddress"
                    required
                    autoComplete="street-address"
                    value={stringValue(values, "organisationAddress")}
                    onChange={(event) => updateValue("organisationAddress", event.target.value)}
                    aria-invalid={Boolean(getFieldError("organisationAddress"))}
                    placeholder="Street, area, city and region"
                  />
                </FormField>
              ) : null}

              <FormField label="Organisation website (optional)" htmlFor={fieldId("organisationWebsite")} error={getFieldError("organisationWebsite")}>
                <TextInput
                  id={fieldId("organisationWebsite")}
                  name="organisationWebsite"
                  type="url"
                  autoComplete="url"
                  value={stringValue(values, "organisationWebsite")}
                  onChange={(event) => updateValue("organisationWebsite", event.target.value)}
                  aria-invalid={Boolean(getFieldError("organisationWebsite"))}
                  placeholder="https://example.com"
                />
              </FormField>
            </div>
          </div>

          <div className="space-y-6">
            <SectionIntro
              number="2"
              title="Main contact"
              description="Tell us who can answer follow-up questions and agree the next steps."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Full name" htmlFor={fieldId("contactName")} required error={getFieldError("contactName")}>
                <TextInput
                  id={fieldId("contactName")}
                  name="contactName"
                  required
                  autoComplete="name"
                  value={stringValue(values, "contactName")}
                  onChange={(event) => updateValue("contactName", event.target.value)}
                  aria-invalid={Boolean(getFieldError("contactName"))}
                  placeholder="Primary contact's name"
                />
              </FormField>

              <FormField label="Role or job title" htmlFor={fieldId("contactRole")} required error={getFieldError("contactRole")}>
                <TextInput
                  id={fieldId("contactRole")}
                  name="contactRole"
                  required
                  autoComplete="organization-title"
                  value={stringValue(values, "contactRole")}
                  onChange={(event) => updateValue("contactRole", event.target.value)}
                  aria-invalid={Boolean(getFieldError("contactRole"))}
                  placeholder="For example: People Operations Lead"
                />
              </FormField>

              <FormField label="Work email" htmlFor={fieldId("workEmail")} required error={getFieldError("workEmail")}>
                <TextInput
                  id={fieldId("workEmail")}
                  name="workEmail"
                  type="email"
                  required
                  autoComplete="email"
                  value={stringValue(values, "workEmail")}
                  onChange={(event) => updateValue("workEmail", event.target.value)}
                  aria-invalid={Boolean(getFieldError("workEmail"))}
                  placeholder="name@organisation.org"
                />
              </FormField>

              <FormField label="Phone number" htmlFor={fieldId("phone")} required error={getFieldError("phone")}>
                <TextInput
                  id={fieldId("phone")}
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={stringValue(values, "phone")}
                  onChange={(event) => updateValue("phone", event.target.value)}
                  aria-invalid={Boolean(getFieldError("phone"))}
                  placeholder="+233 ..."
                />
              </FormField>

              <FormField label="Preferred reply method" htmlFor={fieldId("preferredContact")} required error={getFieldError("preferredContact")}>
                <select
                  id={fieldId("preferredContact")}
                  name="preferredContact"
                  required
                  value={stringValue(values, "preferredContact")}
                  onChange={(event) => updateValue("preferredContact", event.target.value)}
                  className={selectClassName}
                  aria-invalid={Boolean(getFieldError("preferredContact"))}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="either">Either</option>
                </select>
              </FormField>
            </div>
          </div>

          {kind === "job-vacancy" ? (
            <JobVacancyFields
              values={values}
              fieldId={fieldId}
              getFieldError={getFieldError}
              updateValue={updateValue}
            />
          ) : (
            <StaffVolunteeringFields
              values={values}
              fieldId={fieldId}
              getFieldError={getFieldError}
              updateValue={updateValue}
              updateVolunteeringArea={updateVolunteeringArea}
            />
          )}

          <div className="sr-only" aria-hidden="true">
            <label htmlFor={fieldId("companyFax")}>Company fax</label>
            <input
              id={fieldId("companyFax")}
              name="companyFax"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={stringValue(values, "companyFax")}
              onChange={(event) => updateValue("companyFax", event.target.value)}
            />
          </div>

          <label className="flex cursor-pointer gap-3 rounded-2xl border border-brand-border bg-brand-mist/45 p-4">
            <input
              type="checkbox"
              name="consent"
              required
              checked={Boolean(values.consent)}
              onChange={(event) => updateValue("consent", event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-brand-border text-brand-navy focus:ring-brand-gold"
              aria-invalid={Boolean(getFieldError("consent"))}
            />
            <span>
              <span className="block text-sm font-bold text-brand-ink">
                {kind === "job-vacancy"
                  ? "I confirm these vacancy details are accurate and authorise ITFY Ghana to share them with suitable candidates."
                  : "I authorise ITFY Ghana to contact our organisation about this staff volunteering enquiry."}
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                We will use the information in this form to assess the enquiry, coordinate next steps, and keep an internal record of the conversation.
              </span>
              {getFieldError("consent") ? (
                <span className="mt-2 block text-sm font-medium text-rose-600">{getFieldError("consent")}</span>
              ) : null}
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={isSubmitting} variant="dark" size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                copy.submitLabel
              )}
            </Button>
            <p className="text-sm text-slate-500">We will review the details before confirming next steps.</p>
          </div>

          <p
            aria-live="polite"
            className={clsx(
              "flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium",
              submitState.type === "idle" && "hidden",
              submitState.type === "success" && "bg-emerald-50 text-emerald-700",
              submitState.type === "error" && "bg-rose-50 text-rose-700",
            )}
          >
            {submitState.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            {submitState.message}
          </p>
        </form>
      </div>
    </section>
  );
}

type ConditionalFieldsProps = {
  values: FormValues;
  fieldId: (field: string) => string;
  getFieldError: (field: string) => string | undefined;
  updateValue: (field: string, value: FormValue) => void;
};

function JobVacancyFields({ values, fieldId, getFieldError, updateValue }: ConditionalFieldsProps) {
  return (
    <div className="space-y-6">
      <SectionIntro
        number="3"
        title="Vacancy details"
        description="Give candidates enough detail to understand the opportunity and decide whether it fits."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Position title" htmlFor={fieldId("roleTitle")} required error={getFieldError("roleTitle")}>
          <TextInput
            id={fieldId("roleTitle")}
            name="roleTitle"
            required
            value={stringValue(values, "roleTitle")}
            onChange={(event) => updateValue("roleTitle", event.target.value)}
            aria-invalid={Boolean(getFieldError("roleTitle"))}
            placeholder="For example: Junior UX Designer"
          />
        </FormField>

        <FormField label="Opportunity type" htmlFor={fieldId("opportunityType")} required error={getFieldError("opportunityType")}>
          <select
            id={fieldId("opportunityType")}
            name="opportunityType"
            required
            value={stringValue(values, "opportunityType")}
            onChange={(event) => updateValue("opportunityType", event.target.value)}
            className={selectClassName}
          >
            <option value="full-time">Full-time role</option>
            <option value="part-time">Part-time role</option>
            <option value="internship">Internship</option>
            <option value="graduate-programme">Graduate programme</option>
            <option value="contract">Contract role</option>
            <option value="apprenticeship">Apprenticeship</option>
          </select>
        </FormField>

        <FormField label="Team or department (optional)" htmlFor={fieldId("team")} error={getFieldError("team")}>
          <TextInput
            id={fieldId("team")}
            name="team"
            value={stringValue(values, "team")}
            onChange={(event) => updateValue("team", event.target.value)}
            placeholder="For example: Product and Design"
          />
        </FormField>

        <FormField label="Number of openings" htmlFor={fieldId("numberOfOpenings")} required error={getFieldError("numberOfOpenings")}>
          <TextInput
            id={fieldId("numberOfOpenings")}
            name="numberOfOpenings"
            type="number"
            min={1}
            max={500}
            required
            value={stringValue(values, "numberOfOpenings")}
            onChange={(event) => updateValue("numberOfOpenings", event.target.value)}
            aria-invalid={Boolean(getFieldError("numberOfOpenings"))}
          />
        </FormField>

        <FormField label="Role location" htmlFor={fieldId("jobLocation")} required error={getFieldError("jobLocation")}>
          <TextInput
            id={fieldId("jobLocation")}
            name="jobLocation"
            required
            value={stringValue(values, "jobLocation")}
            onChange={(event) => updateValue("jobLocation", event.target.value)}
            aria-invalid={Boolean(getFieldError("jobLocation"))}
            placeholder="For example: Accra, Greater Accra"
          />
        </FormField>

        <FormField label="Work arrangement" htmlFor={fieldId("workArrangement")} required error={getFieldError("workArrangement")}>
          <select
            id={fieldId("workArrangement")}
            name="workArrangement"
            required
            value={stringValue(values, "workArrangement")}
            onChange={(event) => updateValue("workArrangement", event.target.value)}
            className={selectClassName}
          >
            <option value="on-site">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Fully remote</option>
          </select>
        </FormField>

        <FormField label="Is this suitable for an early-career candidate?" htmlFor={fieldId("entryLevelFit")} required error={getFieldError("entryLevelFit")}>
          <select
            id={fieldId("entryLevelFit")}
            name="entryLevelFit"
            required
            value={stringValue(values, "entryLevelFit")}
            onChange={(event) => updateValue("entryLevelFit", event.target.value)}
            className={selectClassName}
          >
            <option value="yes">Yes</option>
            <option value="depends">It depends on the candidate</option>
            <option value="no">No</option>
          </select>
        </FormField>

        <FormField label="Application deadline" htmlFor={fieldId("applicationDeadline")} required error={getFieldError("applicationDeadline")}>
          <TextInput
            id={fieldId("applicationDeadline")}
            name="applicationDeadline"
            type="date"
            required
            value={stringValue(values, "applicationDeadline")}
            onChange={(event) => updateValue("applicationDeadline", event.target.value)}
            aria-invalid={Boolean(getFieldError("applicationDeadline"))}
          />
        </FormField>

        <FormField label="Expected start date (optional)" htmlFor={fieldId("expectedStartDate")} error={getFieldError("expectedStartDate")}>
          <TextInput
            id={fieldId("expectedStartDate")}
            name="expectedStartDate"
            type="date"
            value={stringValue(values, "expectedStartDate")}
            onChange={(event) => updateValue("expectedStartDate", event.target.value)}
            aria-invalid={Boolean(getFieldError("expectedStartDate"))}
          />
        </FormField>

        <FormField label="Salary or allowance range (optional)" htmlFor={fieldId("compensation")} error={getFieldError("compensation")}>
          <TextInput
            id={fieldId("compensation")}
            name="compensation"
            value={stringValue(values, "compensation")}
            onChange={(event) => updateValue("compensation", event.target.value)}
            placeholder="For example: GHS 4,000–5,500 per month"
          />
        </FormField>
      </div>

      <FormField label="What will the person do in this role?" htmlFor={fieldId("roleSummary")} required error={getFieldError("roleSummary")}>
        <TextArea
          id={fieldId("roleSummary")}
          name="roleSummary"
          required
          minLength={30}
          value={stringValue(values, "roleSummary")}
          onChange={(event) => updateValue("roleSummary", event.target.value)}
          aria-invalid={Boolean(getFieldError("roleSummary"))}
          className="min-h-36"
          placeholder="Summarise the role and list the main responsibilities."
        />
      </FormField>

      <FormField label="What skills, experience or qualifications are needed?" htmlFor={fieldId("requirements")} required error={getFieldError("requirements")}>
        <TextArea
          id={fieldId("requirements")}
          name="requirements"
          required
          minLength={20}
          value={stringValue(values, "requirements")}
          onChange={(event) => updateValue("requirements", event.target.value)}
          aria-invalid={Boolean(getFieldError("requirements"))}
          className="min-h-32"
          placeholder="Separate essential requirements from skills that would simply be helpful."
        />
      </FormField>

      <FormField label="How should candidates apply?" htmlFor={fieldId("applicationMethod")} required error={getFieldError("applicationMethod")}>
        <TextArea
          id={fieldId("applicationMethod")}
          name="applicationMethod"
          required
          minLength={10}
          value={stringValue(values, "applicationMethod")}
          onChange={(event) => updateValue("applicationMethod", event.target.value)}
          aria-invalid={Boolean(getFieldError("applicationMethod"))}
          className="min-h-28"
          placeholder="Add the application link or email address and list the documents candidates should send."
        />
      </FormField>

      <FormField label="Anything else candidates should know? (optional)" htmlFor={fieldId("additionalNotes")} error={getFieldError("additionalNotes")}>
        <TextArea
          id={fieldId("additionalNotes")}
          name="additionalNotes"
          value={stringValue(values, "additionalNotes")}
          onChange={(event) => updateValue("additionalNotes", event.target.value)}
          className="min-h-24"
          placeholder="Add interview stages, accessibility information, benefits, or other useful context."
        />
      </FormField>
    </div>
  );
}

type StaffVolunteeringFieldsProps = ConditionalFieldsProps & {
  updateVolunteeringArea: (area: string, checked: boolean) => void;
};

function StaffVolunteeringFields({
  values,
  fieldId,
  getFieldError,
  updateValue,
  updateVolunteeringArea,
}: StaffVolunteeringFieldsProps) {
  const selectedAreas = Array.isArray(values.volunteeringAreas) ? values.volunteeringAreas : [];

  return (
    <div className="space-y-6">
      <SectionIntro
        number="3"
        title="The volunteering idea"
        description="Describe the people, skills, and timing so we can shape an engagement around a real programme need."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="How many staff members would take part?" htmlFor={fieldId("numberOfStaff")} required error={getFieldError("numberOfStaff")}>
          <TextInput
            id={fieldId("numberOfStaff")}
            name="numberOfStaff"
            type="number"
            min={1}
            max={500}
            required
            value={stringValue(values, "numberOfStaff")}
            onChange={(event) => updateValue("numberOfStaff", event.target.value)}
            aria-invalid={Boolean(getFieldError("numberOfStaff"))}
          />
        </FormField>

        <FormField label="Preferred commitment" htmlFor={fieldId("engagementLength")} required error={getFieldError("engagementLength")}>
          <select
            id={fieldId("engagementLength")}
            name="engagementLength"
            required
            value={stringValue(values, "engagementLength")}
            onChange={(event) => updateValue("engagementLength", event.target.value)}
            className={selectClassName}
          >
            <option value="one-off">One-off activity</option>
            <option value="short-series">Short series of activities</option>
            <option value="ongoing">Ongoing engagement</option>
            <option value="not-sure">We are not sure yet</option>
          </select>
        </FormField>

        <FormField label="Preferred date or availability window" htmlFor={fieldId("availability")} required error={getFieldError("availability")}>
          <TextInput
            id={fieldId("availability")}
            name="availability"
            required
            value={stringValue(values, "availability")}
            onChange={(event) => updateValue("availability", event.target.value)}
            aria-invalid={Boolean(getFieldError("availability"))}
            placeholder="For example: weekday mornings in October"
          />
        </FormField>

        <FormField label="Preferred delivery mode" htmlFor={fieldId("deliveryMode")} required error={getFieldError("deliveryMode")}>
          <select
            id={fieldId("deliveryMode")}
            name="deliveryMode"
            required
            value={stringValue(values, "deliveryMode")}
            onChange={(event) => updateValue("deliveryMode", event.target.value)}
            className={selectClassName}
          >
            <option value="flexible">Flexible</option>
            <option value="in-person">In person</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </FormField>

        <FormField label="Preferred activity location (optional)" htmlFor={fieldId("preferredLocation")} error={getFieldError("preferredLocation")}>
          <TextInput
            id={fieldId("preferredLocation")}
            name="preferredLocation"
            value={stringValue(values, "preferredLocation")}
            onChange={(event) => updateValue("preferredLocation", event.target.value)}
            placeholder="Your office, an ITFY venue, online, or another location"
          />
        </FormField>

        <FormField label="How many learners could your team support? (optional)" htmlFor={fieldId("numberOfLearners")} error={getFieldError("numberOfLearners")}>
          <TextInput
            id={fieldId("numberOfLearners")}
            name="numberOfLearners"
            type="number"
            min={1}
            max={1000}
            value={stringValue(values, "numberOfLearners")}
            onChange={(event) => updateValue("numberOfLearners", event.target.value)}
            aria-invalid={Boolean(getFieldError("numberOfLearners"))}
            placeholder="Leave blank if you are unsure"
          />
        </FormField>
      </div>

      <fieldset>
        <legend className="text-sm font-bold text-brand-ink">
          How would your staff like to help? <span aria-hidden="true" className="text-brand-gold">*</span>
        </legend>
        <p className="mt-1 text-sm leading-6 text-slate-500">Select every option that fits.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {volunteeringAreaOptions.map((option) => (
            <label
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm font-medium transition",
                selectedAreas.includes(option.value)
                  ? "border-brand-gold bg-brand-warm text-brand-ink"
                  : "border-brand-border bg-white text-slate-600 hover:border-brand-gold/60",
              )}
            >
              <input
                type="checkbox"
                name="volunteeringAreas"
                value={option.value}
                checked={selectedAreas.includes(option.value)}
                onChange={(event) => updateVolunteeringArea(option.value, event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-border text-brand-navy focus:ring-brand-gold"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {getFieldError("volunteeringAreas") ? (
          <p className="mt-2 text-sm font-medium text-rose-600">{getFieldError("volunteeringAreas")}</p>
        ) : null}
      </fieldset>

      <FormField label="What skills or professional experience can the team offer?" htmlFor={fieldId("staffExpertise")} required error={getFieldError("staffExpertise")}>
        <TextArea
          id={fieldId("staffExpertise")}
          name="staffExpertise"
          required
          minLength={20}
          value={stringValue(values, "staffExpertise")}
          onChange={(event) => updateValue("staffExpertise", event.target.value)}
          aria-invalid={Boolean(getFieldError("staffExpertise"))}
          className="min-h-32"
          placeholder="Describe relevant roles, sectors, technical skills, or lived experience."
        />
      </FormField>

      <FormField label="What should a useful engagement achieve?" htmlFor={fieldId("goals")} required error={getFieldError("goals")}>
        <TextArea
          id={fieldId("goals")}
          name="goals"
          required
          minLength={20}
          value={stringValue(values, "goals")}
          onChange={(event) => updateValue("goals", event.target.value)}
          aria-invalid={Boolean(getFieldError("goals"))}
          className="min-h-32"
          placeholder="Tell us what your staff hope to contribute and what would make the experience worthwhile."
        />
      </FormField>

      <FormField label="Anything else we should plan for? (optional)" htmlFor={fieldId("additionalNotes")} error={getFieldError("additionalNotes")}>
        <TextArea
          id={fieldId("additionalNotes")}
          name="additionalNotes"
          value={stringValue(values, "additionalNotes")}
          onChange={(event) => updateValue("additionalNotes", event.target.value)}
          className="min-h-24"
          placeholder="Add accessibility, safeguarding, travel, equipment, or other logistical notes."
        />
      </FormField>
    </div>
  );
}
