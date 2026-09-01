"use client";

import { useMemo } from "react";

import { CalloutBox } from "@/components/laptop-bank/callout-box";
import {
  CheckboxField,
  FileField,
  RadioGroup,
  SelectField,
  type Option,
} from "@/components/laptop-bank/form-controls";
import {
  MultiStepForm,
  type FileValues,
  type FormStep,
  type FormValues,
  type SubmitOutcome,
} from "@/components/laptop-bank/multi-step-form";
import { TokenText } from "@/components/laptop-bank/token";
import { FormField, TextArea, TextInput } from "@/components/ui/form-field";
import {
  CURRENT_COMPUTER_ACCESS,
  GHANA_REGIONS,
  GHANA_TERTIARY_INSTITUTIONS,
  ITFY_TRACKS,
  MONTHS,
  REFERRAL_SOURCES,
  YEARS_OF_STUDY,
  herFirstLaptopApplyContent,
} from "@/lib/content/her-first-laptop-config";
import { token } from "@/lib/content/laptop-bank-tokens";
import { compressImage, formatFileSize } from "@/lib/utils/image-compress";
import { countWords } from "@/lib/utils/validators";

const OTHER_INSTITUTION = "__other__";

const INSTITUTION_OPTIONS: Option[] = [
  ...GHANA_TERTIARY_INSTITUTIONS.map((name) => ({ value: name, label: name })),
  { value: OTHER_INSTITUTION, label: "Another institution" },
];

const REGION_OPTIONS: Option[] = GHANA_REGIONS.map((region) => ({ value: region, label: region }));
const YEAR_OPTIONS: Option[] = YEARS_OF_STUDY.map((year) => ({ value: year, label: year }));
const MONTH_OPTIONS: Option[] = MONTHS.map((month) => ({ value: month, label: month }));
const TRACK_OPTIONS: Option[] = ITFY_TRACKS.map((track) => ({ ...track }));
const ACCESS_OPTIONS: Option[] = CURRENT_COMPUTER_ACCESS.map((access) => ({ ...access }));
const REFERRAL_OPTIONS: Option[] = REFERRAL_SOURCES.map((source) => ({ ...source }));

/** Spec §6.2: proof of enrolment, JPG/PNG/PDF, max 5 MB. */
const PROOF_MAX_BYTES = 5 * 1024 * 1024;

const WHY_WORD_CAP = 200;
const WHAT_WORD_CAP = 150;

/** The next six years, so an applicant can state a realistic completion year. */
function completionYears(): Option[] {
  const thisYear = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, index) => {
    const year = String(thisYear + index);
    return { value: year, label: year };
  });
}

const INITIAL_VALUES: FormValues = {
  fullName: "",
  preferredName: "",
  phone: "",
  phoneIsWhatsApp: false,
  alternativeContact: "",
  email: "",
  institution: "",
  institutionOther: "",
  programmeOfStudy: "",
  yearOfStudy: "",
  expectedCompletionMonth: "",
  expectedCompletionYear: "",
  studentIdentifier: "",
  regionOfResidence: "",
  currentComputerAccess: "",
  itfyTrack: "",
  whyYouNeedIt: "",
  whatYouWillDo: "",
  referralSource: "",
  // Every commitment and consent starts false. Spec §10 checks that every
  // consent checkbox is unchecked on first load.
  commitmentCompleteTrack: false,
  commitmentPeerTeaching: false,
  commitmentCheckIns: false,
  loanToOwnTerms: false,
  declarationOfTruth: false,
  privacyConsent: false,
  storyAndPhotoConsent: false,
  companyFax: "",
};

/** Live word counter. Spec §6.2 asks for one on both long-answer fields. */
function WordCounter({ value, cap }: { value: string; cap: number }) {
  const count = countWords(value);
  const over = count > cap;
  return (
    <p
      className={over ? "mt-2 text-sm font-bold text-rose-600" : "mt-2 text-sm text-slate-500"}
      // Politely announced so a screen-reader user hears the count approach
      // the cap rather than only finding out at submit.
      aria-live="polite"
    >
      {count} of {cap} words{over ? " — please shorten this to continue." : ""}
    </p>
  );
}

/**
 * Form 6.2 — Her First Laptop student application.
 *
 * Spec 5.8 BEHAVIOUR: mobile first, save and resume keyed on phone number or
 * email, no account, and image uploads compressed client-side to a 1600px long
 * edge before upload.
 *
 * WHAT THIS FORM DELIBERATELY DOES NOT ASK, per spec §6.2 DATA: household
 * income, guardian income, bank details, hardship documentation, or date of
 * birth. Draft 1 §13.2 gives the reason — none of it improves the selection
 * decision and all of it increases what the organisation is liable for if this
 * data is ever exposed. The computer-access question and the free-text
 * questions already carry a hardship signal. Do not add any of them.
 */
export function StudentApplicationForm() {
  const copy = herFirstLaptopApplyContent;
  const years = useMemo(completionYears, []);

  const steps: FormStep[] = [
    {
      title: copy.stepTitles[0],
      fields: ["fullName", "preferredName", "phone", "phoneIsWhatsApp", "alternativeContact", "email"],
      render: ({ values, setValue, error, fieldId }) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Full name" htmlFor={fieldId("fullName")} required error={error("fullName")}>
              <TextInput
                id={fieldId("fullName")}
                name="fullName"
                required
                autoComplete="name"
                value={String(values.fullName ?? "")}
                onChange={(event) => setValue("fullName", event.target.value)}
              />
            </FormField>

            <FormField
              label="Preferred name"
              htmlFor={fieldId("preferredName")}
              error={error("preferredName")}
            >
              <TextInput
                id={fieldId("preferredName")}
                name="preferredName"
                value={String(values.preferredName ?? "")}
                onChange={(event) => setValue("preferredName", event.target.value)}
              />
              <p className="mt-2 text-sm leading-6 text-slate-500">
                What we will call you in every message we send.
              </p>
            </FormField>

            <FormField label="Phone" htmlFor={fieldId("phone")} required error={error("phone")}>
              <TextInput
                id={fieldId("phone")}
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="0XXXXXXXXX or +233XXXXXXXXX"
                value={String(values.phone ?? "")}
                onChange={(event) => setValue("phone", event.target.value)}
              />
              <div className="mt-3">
                <CheckboxField
                  label="This number is on WhatsApp"
                  id={fieldId("phoneIsWhatsApp")}
                  name="phoneIsWhatsApp"
                  checked={values.phoneIsWhatsApp === true}
                  onChange={(checked) => setValue("phoneIsWhatsApp", checked)}
                />
              </div>
            </FormField>

            <FormField
              label="Alternative contact"
              htmlFor={fieldId("alternativeContact")}
              required
              error={error("alternativeContact")}
            >
              <TextInput
                id={fieldId("alternativeContact")}
                name="alternativeContact"
                required
                value={String(values.alternativeContact ?? "")}
                onChange={(event) => setValue("alternativeContact", event.target.value)}
              />
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Another phone number or an email address, different from the one above. If we cannot
                reach you on your main number we will try this one.
              </p>
            </FormField>

            <FormField label="Email" htmlFor={fieldId("email")} error={error("email")}>
              <TextInput
                id={fieldId("email")}
                name="email"
                type="email"
                autoComplete="email"
                value={String(values.email ?? "")}
                onChange={(event) => setValue("email", event.target.value)}
              />
            </FormField>
          </div>
        </>
      ),
    },
    {
      title: copy.stepTitles[1],
      fields: [
        "institution",
        "institutionOther",
        "programmeOfStudy",
        "yearOfStudy",
        "expectedCompletionMonth",
        "expectedCompletionYear",
        "studentIdentifier",
        "proofOfEnrolment",
      ],
      render: ({ values, files, setValue, setFile, error, fieldId }) => {
        const proof = files.proofOfEnrolment;
        const proofTooLarge = Boolean(proof && proof.size > PROOF_MAX_BYTES);

        return (
          <>
            <SelectField
              label="Institution"
              id={fieldId("institution")}
              name="institution"
              options={INSTITUTION_OPTIONS}
              required
              value={String(values.institution ?? "")}
              onChange={(value) => setValue("institution", value)}
              error={error("institution")}
            />

            {values.institution === OTHER_INSTITUTION ? (
              <FormField
                label="Which institution?"
                htmlFor={fieldId("institutionOther")}
                required
                error={error("institutionOther")}
              >
                <TextInput
                  id={fieldId("institutionOther")}
                  name="institutionOther"
                  required
                  value={String(values.institutionOther ?? "")}
                  onChange={(event) => setValue("institutionOther", event.target.value)}
                />
              </FormField>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Programme of study"
                htmlFor={fieldId("programmeOfStudy")}
                required
                error={error("programmeOfStudy")}
              >
                <TextInput
                  id={fieldId("programmeOfStudy")}
                  name="programmeOfStudy"
                  required
                  value={String(values.programmeOfStudy ?? "")}
                  onChange={(event) => setValue("programmeOfStudy", event.target.value)}
                />
              </FormField>

              <SelectField
                label="Year of study"
                id={fieldId("yearOfStudy")}
                name="yearOfStudy"
                options={YEAR_OPTIONS}
                required
                value={String(values.yearOfStudy ?? "")}
                onChange={(value) => setValue("yearOfStudy", value)}
                error={error("yearOfStudy")}
              />

              <SelectField
                label="Expected completion month"
                id={fieldId("expectedCompletionMonth")}
                name="expectedCompletionMonth"
                options={MONTH_OPTIONS}
                required
                value={String(values.expectedCompletionMonth ?? "")}
                onChange={(value) => setValue("expectedCompletionMonth", value)}
                error={error("expectedCompletionMonth")}
              />

              <SelectField
                label="Expected completion year"
                id={fieldId("expectedCompletionYear")}
                name="expectedCompletionYear"
                options={years}
                required
                value={String(values.expectedCompletionYear ?? "")}
                onChange={(value) => setValue("expectedCompletionYear", value)}
                error={error("expectedCompletionYear")}
              />

              <FormField
                label="Student identifier"
                htmlFor={fieldId("studentIdentifier")}
                required
                error={error("studentIdentifier")}
              >
                <TextInput
                  id={fieldId("studentIdentifier")}
                  name="studentIdentifier"
                  required
                  value={String(values.studentIdentifier ?? "")}
                  onChange={(event) => setValue("studentIdentifier", event.target.value)}
                />
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your student number, as it appears on your card. We use it only to verify your
                  enrolment with your institution.
                </p>
              </FormField>
            </div>

            <FileField
              label="Proof of enrolment"
              id={fieldId("proofOfEnrolment")}
              name="proofOfEnrolment"
              accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
              file={proof}
              onChange={(file) => setFile("proofOfEnrolment", file)}
              required
              hint="A photograph or scan of your student card, admission letter or enrolment confirmation. JPG, PNG or PDF, up to 5 MB. A photograph taken on your phone is fine — we shrink it before uploading so it does not use much data."
              error={
                proofTooLarge
                  ? `That file is ${formatFileSize(proof!.size)}. Please choose one under 5 MB.`
                  : error("proofOfEnrolment")
              }
            />
          </>
        );
      },
    },
    {
      title: copy.stepTitles[2],
      fields: [
        "regionOfResidence",
        "currentComputerAccess",
        "itfyTrack",
        "whyYouNeedIt",
        "whatYouWillDo",
        "referralSource",
      ],
      render: ({ values, setValue, error, fieldId }) => {
        const why = String(values.whyYouNeedIt ?? "");
        const what = String(values.whatYouWillDo ?? "");

        return (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Region of residence"
                id={fieldId("regionOfResidence")}
                name="regionOfResidence"
                options={REGION_OPTIONS}
                required
                value={String(values.regionOfResidence ?? "")}
                onChange={(value) => setValue("regionOfResidence", value)}
                error={error("regionOfResidence")}
              />

              <SelectField
                label="IT for Youth track"
                id={fieldId("itfyTrack")}
                name="itfyTrack"
                options={TRACK_OPTIONS}
                required
                value={String(values.itfyTrack ?? "")}
                onChange={(value) => setValue("itfyTrack", value)}
                error={error("itfyTrack")}
              />
            </div>

            <RadioGroup
              label="Current computer access"
              name="currentComputerAccess"
              idPrefix={fieldId("currentComputerAccess")}
              options={ACCESS_OPTIONS}
              required
              value={String(values.currentComputerAccess ?? "")}
              onChange={(value) => setValue("currentComputerAccess", value)}
              error={error("currentComputerAccess")}
            />

            <FormField
              label="Why you need a computer"
              htmlFor={fieldId("whyYouNeedIt")}
              required
              error={error("whyYouNeedIt")}
            >
              <TextArea
                id={fieldId("whyYouNeedIt")}
                name="whyYouNeedIt"
                rows={6}
                required
                value={why}
                onChange={(event) => setValue("whyYouNeedIt", event.target.value)}
              />
              <WordCounter value={why} cap={WHY_WORD_CAP} />
            </FormField>

            <FormField
              label="What you will do with it"
              htmlFor={fieldId("whatYouWillDo")}
              required
              error={error("whatYouWillDo")}
            >
              <TextArea
                id={fieldId("whatYouWillDo")}
                name="whatYouWillDo"
                rows={5}
                required
                value={what}
                onChange={(event) => setValue("whatYouWillDo", event.target.value)}
              />
              <WordCounter value={what} cap={WHAT_WORD_CAP} />
            </FormField>

            <SelectField
              label="How you heard about Her First Laptop"
              id={fieldId("referralSource")}
              name="referralSource"
              options={REFERRAL_OPTIONS}
              value={String(values.referralSource ?? "")}
              onChange={(value) => setValue("referralSource", value)}
              error={error("referralSource")}
            />
          </>
        );
      },
    },
    {
      title: copy.stepTitles[3],
      fields: [
        "commitmentCompleteTrack",
        "commitmentPeerTeaching",
        "commitmentCheckIns",
        "loanToOwnTerms",
        "declarationOfTruth",
        "privacyConsent",
        "storyAndPhotoConsent",
      ],
      render: ({ values, setValue, error, fieldId }) => (
        <>
          {/*
            Spec §6.2 BEHAVIOUR: "All four commitment and consent checkboxes are
            separate inputs. No single combined checkbox." Seven separate
            checkboxes follow, every one unchecked on first load.
          */}
          <CheckboxField
            label="I will complete my training track."
            id={fieldId("commitmentCompleteTrack")}
            name="commitmentCompleteTrack"
            required
            checked={values.commitmentCompleteTrack === true}
            onChange={(checked) => setValue("commitmentCompleteTrack", checked)}
            error={error("commitmentCompleteTrack")}
          />

          <CheckboxField
            label={
              <>
                I will give{" "}
                <TokenText>{token("PEER_HOURS")}</TokenText> teaching other young people what I have
                learned.
              </>
            }
            id={fieldId("commitmentPeerTeaching")}
            name="commitmentPeerTeaching"
            required
            checked={values.commitmentPeerTeaching === true}
            onChange={(checked) => setValue("commitmentPeerTeaching", checked)}
            error={error("commitmentPeerTeaching")}
          />

          <CheckboxField
            label="I will take part in three check-ins over twelve months."
            id={fieldId("commitmentCheckIns")}
            name="commitmentCheckIns"
            required
            checked={values.commitmentCheckIns === true}
            onChange={(checked) => setValue("commitmentCheckIns", checked)}
            error={error("commitmentCheckIns")}
          />

          <CheckboxField
            label={
              <>
                I have read and accept the{" "}
                <a
                  href="/policies/laptop-bank-documents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-primary underline"
                >
                  loan-to-own terms
                </a>
                .
              </>
            }
            id={fieldId("loanToOwnTerms")}
            name="loanToOwnTerms"
            required
            checked={values.loanToOwnTerms === true}
            onChange={(checked) => setValue("loanToOwnTerms", checked)}
            error={error("loanToOwnTerms")}
          />

          <CheckboxField
            label="Everything I have written here is true."
            id={fieldId("declarationOfTruth")}
            name="declarationOfTruth"
            required
            checked={values.declarationOfTruth === true}
            onChange={(checked) => setValue("declarationOfTruth", checked)}
            error={error("declarationOfTruth")}
          />

          <CheckboxField
            label={
              <>
                I have read how IT for Youth Ghana handles my information, in the{" "}
                <a
                  href="/policies/laptop-bank-privacy-notice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-primary underline"
                >
                  Laptop Bank privacy notice
                </a>
                .
              </>
            }
            id={fieldId("privacyConsent")}
            name="privacyConsent"
            required
            checked={values.privacyConsent === true}
            onChange={(checked) => setValue("privacyConsent", checked)}
            error={error("privacyConsent")}
          />

          <CheckboxField
            label="IT for Youth Ghana may use my story or photograph."
            id={fieldId("storyAndPhotoConsent")}
            name="storyAndPhotoConsent"
            checked={values.storyAndPhotoConsent === true}
            onChange={(checked) => setValue("storyAndPhotoConsent", checked)}
            hint="This does not affect your application."
          />

          <CalloutBox
            variant="warning"
            heading="Applying is free"
            body={`No payment of any kind is required at any stage, and no member of our staff will ever ask you for money. If anyone does, report it to ${token("REPORT_CONTACT")}.`}
          />
        </>
      ),
    },
  ];

  const handleSubmit = async (values: FormValues, files: FileValues): Promise<SubmitOutcome> => {
    const proof = files.proofOfEnrolment;

    if (!proof) {
      return {
        ok: false,
        message: "Please attach your proof of enrolment before sending your application.",
        fieldErrors: { proofOfEnrolment: ["Please attach a photograph or scan."] },
      };
    }

    if (proof.size > PROOF_MAX_BYTES) {
      return {
        ok: false,
        message: `That file is ${formatFileSize(proof.size)}. Please choose one under 5 MB.`,
        fieldErrors: { proofOfEnrolment: ["Please choose a file under 5 MB."] },
      };
    }

    // Spec 5.8: compress client-side to a 1600px long edge before upload. A
    // PDF passes through untouched — compressImage checks the type itself.
    const compressed = await compressImage(proof);

    const body = new FormData();
    for (const [field, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        for (const member of value) body.append(field, member);
      } else {
        body.append(field, String(value));
      }
    }
    // The "other institution" free text replaces the sentinel, so the server
    // and the CMS only ever see a real institution name.
    if (values.institution === OTHER_INSTITUTION) {
      body.set("institution", String(values.institutionOther ?? ""));
    }
    body.append("proofOfEnrolment", compressed);

    const response = await fetch("/api/her-first-laptop/apply", { method: "POST", body });
    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string; confirmation?: string; errors?: { fieldErrors?: Record<string, string[]> } }
      | null;

    if (!response.ok || !payload?.success) {
      return {
        ok: false,
        message: payload?.message || "We could not send your application right now. Please try again.",
        fieldErrors: payload?.errors?.fieldErrors,
      };
    }

    return {
      ok: true,
      message: payload.confirmation ?? payload.message ?? "Thank you.",
      confirmation: <TokenText>{payload.confirmation ?? payload.message ?? "Thank you."}</TokenText>,
    };
  };

  return (
    <MultiStepForm
      id="apply-for-a-laptop"
      steps={steps}
      initialValues={INITIAL_VALUES}
      /**
       * Spec 5.8: "Save and resume keyed on phone number or email. No account."
       * A single fixed key is used rather than one derived from the phone
       * number, because the key has to exist before the applicant has typed a
       * phone number — a key derived from a field the form is still collecting
       * cannot restore that field. One key per device is what "no account"
       * means in practice, and it is the same browser-token approach spec 5.5
       * asks for on the corporate form.
       */
      storageKey="itfy-her-first-laptop-application"
      submitLabel="Send my application"
      onSubmit={handleSubmit}
    />
  );
}
