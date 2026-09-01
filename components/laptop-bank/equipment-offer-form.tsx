"use client";

import { CalloutBox } from "@/components/laptop-bank/callout-box";
import {
  CheckboxField,
  CheckboxSet,
  FileField,
  RadioGroup,
  SelectField,
  type Option,
} from "@/components/laptop-bank/form-controls";
import {
  MultiStepForm,
  type FormStep,
  type FormValues,
  type FileValues,
  type SubmitOutcome,
} from "@/components/laptop-bank/multi-step-form";
import { TokenText } from "@/components/laptop-bank/token";
import { FormField, TextArea, TextInput } from "@/components/ui/form-field";
import { laptopBankDonateEquipmentContent } from "@/lib/content/laptop-bank-config";
import { formatFileSize } from "@/lib/utils/image-compress";
import { isFreeWebmail } from "@/lib/utils/validators";

/** Spec §6.1 step 1. */
const SECTORS: Option[] = [
  { value: "banking", label: "Banking" },
  { value: "telecoms", label: "Telecoms" },
  { value: "mining", label: "Mining" },
  { value: "oil-and-gas", label: "Oil and gas" },
  { value: "public-sector", label: "Public sector" },
  { value: "education", label: "Education" },
  { value: "ngo", label: "NGO" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

/**
 * Ghana first because it is the common case, then the countries Draft 1 names
 * as likely sources. "Other" keeps the list short without excluding anyone —
 * spec §6.1 only requires that a non-Ghana selection sets the import flag.
 */
const COUNTRIES: Option[] = [
  { value: "Ghana", label: "Ghana" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "United States", label: "United States" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "South Africa", label: "South Africa" },
  { value: "Other", label: "Another country" },
];

const EQUIPMENT_TYPES: Option[] = [
  { value: "laptops", label: "Laptops" },
  { value: "desktops", label: "Desktops" },
  { value: "monitors", label: "Monitors" },
  { value: "docking-stations", label: "Docking stations" },
  { value: "chargers", label: "Chargers" },
  { value: "keyboards-and-mice", label: "Keyboards and mice" },
  { value: "networking", label: "Networking" },
  { value: "projectors", label: "Projectors" },
  { value: "parts", label: "Parts" },
  { value: "other", label: "Other" },
];

const QUANTITY_BANDS: Option[] = [
  { value: "1-9", label: "1 to 9" },
  { value: "10-49", label: "10 to 49" },
  { value: "50-99", label: "50 to 99" },
  { value: "100-499", label: "100 to 499" },
  { value: "500+", label: "500 or more" },
];

const AGE_BANDS: Option[] = [
  { value: "under-3", label: "Under 3 years" },
  { value: "3-5", label: "3 to 5 years" },
  { value: "5-7", label: "5 to 7 years" },
  { value: "over-7", label: "Over 7 years" },
  { value: "mixed", label: "Mixed" },
];

const THREE_WAY: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "need-to-check", label: "Need to check" },
];

const DRIVES_WIPED: Option[] = [
  { value: "yes-with-certificates", label: "Yes, with certificates" },
  { value: "yes-without", label: "Yes, without certificates" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Unsure" },
];

const YES_NO: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const TIMELINES: Option[] = [
  { value: "within-a-month", label: "Within a month" },
  { value: "1-3-months", label: "1 to 3 months" },
  { value: "3-6-months", label: "3 to 6 months" },
  { value: "later", label: "Later" },
  { value: "no-fixed-date", label: "No fixed date" },
];

/** Spec §6.1 step 3: writes directly to Donor.display_consent. */
const RECOGNITION: Option[] = [
  { value: "logo", label: "Named with logo" },
  { value: "named", label: "Named only" },
  { value: "anonymous", label: "Anonymous" },
];

const HEARD_ABOUT: Option[] = [
  { value: "search", label: "Search engine" },
  { value: "press", label: "Press or news coverage" },
  { value: "social", label: "Social media" },
  { value: "colleague", label: "A colleague or contact" },
  { value: "event", label: "An event" },
  { value: "existing-partner", label: "We already work with IT for Youth Ghana" },
  { value: "other", label: "Somewhere else" },
];

const ASSET_LIST_MAX_BYTES = 10 * 1024 * 1024;

/** Spec 5.5 BEHAVIOUR: save progress against a browser token, no account. */
const STORAGE_KEY = "itfy-laptop-bank-equipment-offer";

const INITIAL_VALUES: FormValues = {
  organisationName: "",
  sector: "",
  country: "",
  city: "",
  contactName: "",
  contactRole: "",
  workEmail: "",
  phone: "",
  heardAboutUs: "",
  equipmentTypes: [],
  estimatedQuantity: "",
  approximateAge: "",
  makeAndModel: "",
  releasedFromManagement: "",
  firmwarePasswordsCleared: "",
  drivesAlreadyWiped: "",
  drivesRetainedByYou: "",
  collectionAddress: "",
  targetTimeline: "",
  publicRecognition: "",
  supportRefurbishmentCosts: false,
  // Spec §6.1 step 3: "Deployment report — default checked." It is a
  // preference about reporting, not a consent, so defaulting it on is
  // permitted. Every actual consent below stays false.
  deploymentReport: true,
  anythingElse: "",
  privacyConsent: false,
  marketingConsent: false,
  companyFax: "",
};

/**
 * Form 6.1 — corporate equipment offer.
 *
 * Three steps, titled exactly as spec 5.5 BEHAVIOUR requires. The conditional
 * panels are all "explain, never block": spec §6.1 says an answer of "No" or
 * "Need to check" on device management or firmware passwords "opens an info
 * panel; does not block submission", and a free-webmail work address "triggers
 * a soft prompt, not a block". An organisation that has not yet checked its
 * firmware state is exactly the organisation this programme needs to talk to.
 */
export function EquipmentOfferForm() {
  const copy = laptopBankDonateEquipmentContent;

  const steps: FormStep[] = [
    {
      title: copy.stepTitles[0],
      fields: [
        "organisationName",
        "sector",
        "country",
        "city",
        "contactName",
        "contactRole",
        "workEmail",
        "phone",
        "heardAboutUs",
      ],
      render: ({ values, setValue, error, fieldId }) => {
        const email = String(values.workEmail ?? "");
        const showWebmailPrompt = email.includes("@") && isFreeWebmail(email);

        return (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Organisation name"
                htmlFor={fieldId("organisationName")}
                required
                error={error("organisationName")}
              >
                <TextInput
                  id={fieldId("organisationName")}
                  name="organisationName"
                  required
                  autoComplete="organization"
                  value={String(values.organisationName ?? "")}
                  onChange={(event) => setValue("organisationName", event.target.value)}
                />
              </FormField>

              <SelectField
                label="Sector"
                id={fieldId("sector")}
                name="sector"
                options={SECTORS}
                value={String(values.sector ?? "")}
                onChange={(value) => setValue("sector", value)}
                error={error("sector")}
              />

              <SelectField
                label="Country"
                id={fieldId("country")}
                name="country"
                options={COUNTRIES}
                required
                value={String(values.country ?? "")}
                onChange={(value) => setValue("country", value)}
                error={error("country")}
              />

              <FormField label="City" htmlFor={fieldId("city")} required error={error("city")}>
                <TextInput
                  id={fieldId("city")}
                  name="city"
                  required
                  value={String(values.city ?? "")}
                  onChange={(event) => setValue("city", event.target.value)}
                />
              </FormField>

              <FormField
                label="Your name"
                htmlFor={fieldId("contactName")}
                required
                error={error("contactName")}
              >
                <TextInput
                  id={fieldId("contactName")}
                  name="contactName"
                  required
                  autoComplete="name"
                  value={String(values.contactName ?? "")}
                  onChange={(event) => setValue("contactName", event.target.value)}
                />
              </FormField>

              <FormField
                label="Your role"
                htmlFor={fieldId("contactRole")}
                required
                error={error("contactRole")}
              >
                <TextInput
                  id={fieldId("contactRole")}
                  name="contactRole"
                  required
                  value={String(values.contactRole ?? "")}
                  onChange={(event) => setValue("contactRole", event.target.value)}
                />
              </FormField>

              <FormField
                label="Work email"
                htmlFor={fieldId("workEmail")}
                required
                error={error("workEmail")}
              >
                <TextInput
                  id={fieldId("workEmail")}
                  name="workEmail"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setValue("workEmail", event.target.value)}
                />
              </FormField>

              <FormField label="Phone" htmlFor={fieldId("phone")} error={error("phone")}>
                <TextInput
                  id={fieldId("phone")}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={String(values.phone ?? "")}
                  onChange={(event) => setValue("phone", event.target.value)}
                />
              </FormField>
            </div>

            {/* Soft prompt, never a block. Spec §6.1 step 1. */}
            {showWebmailPrompt ? (
              <CalloutBox
                variant="info"
                body="That looks like a personal email address. A work address helps us verify the offer and reach the right people if you move on — but you can carry on with this one."
              />
            ) : null}

            <SelectField
              label="How did you hear about us"
              id={fieldId("heardAboutUs")}
              name="heardAboutUs"
              options={HEARD_ABOUT}
              value={String(values.heardAboutUs ?? "")}
              onChange={(value) => setValue("heardAboutUs", value)}
              error={error("heardAboutUs")}
            />
          </>
        );
      },
    },
    {
      title: copy.stepTitles[1],
      fields: [
        "equipmentTypes",
        "estimatedQuantity",
        "approximateAge",
        "makeAndModel",
        "assetList",
        "releasedFromManagement",
        "firmwarePasswordsCleared",
        "drivesAlreadyWiped",
        "drivesRetainedByYou",
      ],
      render: ({ values, files, setValue, setFile, toggleInSet, error, fieldId }) => {
        const equipmentTypes = Array.isArray(values.equipmentTypes)
          ? (values.equipmentTypes as string[])
          : [];
        const assetList = files.assetList;
        const assetListTooLarge = Boolean(assetList && assetList.size > ASSET_LIST_MAX_BYTES);
        const managementUnclear = values.releasedFromManagement === "no" || values.releasedFromManagement === "need-to-check";
        const firmwareUnclear = values.firmwarePasswordsCleared === "no" || values.firmwarePasswordsCleared === "need-to-check";

        return (
          <>
            {/* Spec §6.1: "Prompt for this at the top of the step." */}
            <FileField
              label="Asset list"
              id={fieldId("assetList")}
              name="assetList"
              accept=".csv,.xlsx,.pdf,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf"
              file={assetList}
              onChange={(file) => setFile("assetList", file)}
              hint="CSV, XLSX or PDF, up to 10 MB. If you already have an asset list, attach it here and you can skip most of the questions below."
              error={
                assetListTooLarge
                  ? `That file is ${formatFileSize(assetList!.size)}. Please attach one under 10 MB, or email it to us instead.`
                  : error("assetList")
              }
            />

            <CheckboxSet
              label="Equipment types"
              name="equipmentTypes"
              idPrefix={fieldId("equipmentTypes")}
              options={EQUIPMENT_TYPES}
              values={equipmentTypes}
              onToggle={(value, checked) => toggleInSet("equipmentTypes", value, checked)}
              required
              error={error("equipmentTypes")}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Estimated quantity"
                id={fieldId("estimatedQuantity")}
                name="estimatedQuantity"
                options={QUANTITY_BANDS}
                required
                value={String(values.estimatedQuantity ?? "")}
                onChange={(value) => setValue("estimatedQuantity", value)}
                error={error("estimatedQuantity")}
              />

              <SelectField
                label="Approximate age"
                id={fieldId("approximateAge")}
                name="approximateAge"
                options={AGE_BANDS}
                required
                value={String(values.approximateAge ?? "")}
                onChange={(value) => setValue("approximateAge", value)}
                error={error("approximateAge")}
              />
            </div>

            <FormField
              label="Make and model"
              htmlFor={fieldId("makeAndModel")}
              error={error("makeAndModel")}
            >
              <TextArea
                id={fieldId("makeAndModel")}
                name="makeAndModel"
                rows={3}
                value={String(values.makeAndModel ?? "")}
                onChange={(event) => setValue("makeAndModel", event.target.value)}
              />
            </FormField>

            <RadioGroup
              label="Released from device management"
              name="releasedFromManagement"
              idPrefix={fieldId("releasedFromManagement")}
              options={THREE_WAY}
              required
              value={String(values.releasedFromManagement ?? "")}
              onChange={(value) => setValue("releasedFromManagement", value)}
              error={error("releasedFromManagement")}
              panel={
                managementUnclear ? (
                  <CalloutBox
                    variant="info"
                    body="A machine still enrolled in a device management platform cannot be reimaged and cannot be deployed, however good the hardware is, and we cannot release it ourselves. Your IT team will know this as releasing the device from management. Tell us anyway — we can plan around it, and it is much cheaper to sort out before collection than after."
                  />
                ) : null
              }
            />

            <RadioGroup
              label="Firmware passwords cleared"
              name="firmwarePasswordsCleared"
              idPrefix={fieldId("firmwarePasswordsCleared")}
              options={THREE_WAY}
              required
              value={String(values.firmwarePasswordsCleared ?? "")}
              onChange={(value) => setValue("firmwarePasswordsCleared", value)}
              error={error("firmwarePasswordsCleared")}
              panel={
                firmwareUnclear ? (
                  <CalloutBox
                    variant="info"
                    body="A BIOS or EFI password has to be cleared by your IT team before handover, because it cannot be removed by us. This is the most common reason a donation fails, so it is worth raising internally now rather than at collection."
                  />
                ) : null
              }
            />

            <RadioGroup
              label="Drives already wiped"
              name="drivesAlreadyWiped"
              idPrefix={fieldId("drivesAlreadyWiped")}
              options={DRIVES_WIPED}
              required
              value={String(values.drivesAlreadyWiped ?? "")}
              onChange={(value) => setValue("drivesAlreadyWiped", value)}
              error={error("drivesAlreadyWiped")}
              panel={
                /*
                 * Spec §6.1: "All four answers display the same line." The
                 * point is that the answer changes nothing about what we do,
                 * so showing a different message per answer would undercut it.
                 */
                values.drivesAlreadyWiped ? (
                  <CalloutBox variant="info" body="We re-sanitise every drive on arrival regardless." />
                ) : null
              }
            />

            <RadioGroup
              label="Drives retained by you"
              name="drivesRetainedByYou"
              idPrefix={fieldId("drivesRetainedByYou")}
              options={YES_NO}
              required
              value={String(values.drivesRetainedByYou ?? "")}
              onChange={(value) => setValue("drivesRetainedByYou", value)}
              error={error("drivesRetainedByYou")}
              description="Some organisations remove and keep the storage drives before handover."
            />
          </>
        );
      },
    },
    {
      title: copy.stepTitles[2],
      fields: [
        "collectionAddress",
        "targetTimeline",
        "publicRecognition",
        "supportRefurbishmentCosts",
        "deploymentReport",
        "anythingElse",
        "privacyConsent",
        "marketingConsent",
      ],
      render: ({ values, setValue, error, fieldId }) => (
        <>
          <FormField
            label="Collection address"
            htmlFor={fieldId("collectionAddress")}
            error={error("collectionAddress")}
          >
            <TextArea
              id={fieldId("collectionAddress")}
              name="collectionAddress"
              rows={3}
              value={String(values.collectionAddress ?? "")}
              onChange={(event) => setValue("collectionAddress", event.target.value)}
            />
          </FormField>

          <SelectField
            label="Target timeline"
            id={fieldId("targetTimeline")}
            name="targetTimeline"
            options={TIMELINES}
            required
            value={String(values.targetTimeline ?? "")}
            onChange={(value) => setValue("targetTimeline", value)}
            error={error("targetTimeline")}
          />

          <RadioGroup
            label="Public recognition"
            name="publicRecognition"
            idPrefix={fieldId("publicRecognition")}
            options={RECOGNITION}
            required
            value={String(values.publicRecognition ?? "")}
            onChange={(value) => setValue("publicRecognition", value)}
            error={error("publicRecognition")}
            description="Worth settling now rather than after the first press mention. You can change it later by emailing us."
          />

          <CheckboxField
            label="I would also like to discuss supporting refurbishment costs"
            id={fieldId("supportRefurbishmentCosts")}
            name="supportRefurbishmentCosts"
            checked={values.supportRefurbishmentCosts === true}
            onChange={(checked) => setValue("supportRefurbishmentCosts", checked)}
          />

          <CheckboxField
            label="Send me the deployment report"
            id={fieldId("deploymentReport")}
            name="deploymentReport"
            checked={values.deploymentReport === true}
            onChange={(checked) => setValue("deploymentReport", checked)}
            hint="A named report at three months showing where your equipment went."
          />

          <FormField
            label="Anything else"
            htmlFor={fieldId("anythingElse")}
            error={error("anythingElse")}
          >
            <TextArea
              id={fieldId("anythingElse")}
              name="anythingElse"
              rows={4}
              value={String(values.anythingElse ?? "")}
              onChange={(event) => setValue("anythingElse", event.target.value)}
            />
          </FormField>

          {/*
            Spec §6.1 step 3: privacy consent is required, unchecked by
            default, and "must not be bundled with any other consent".
            Marketing consent is a separate input immediately below, also
            unchecked. Never merge these two.
          */}
          <CheckboxField
            label={
              <>
                I have read how IT for Youth Ghana handles this information, in the{" "}
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
            label="Send me occasional updates about the IT for Youth Laptop Bank"
            id={fieldId("marketingConsent")}
            name="marketingConsent"
            checked={values.marketingConsent === true}
            onChange={(checked) => setValue("marketingConsent", checked)}
          />
        </>
      ),
    },
  ];

  const handleSubmit = async (values: FormValues, files: FileValues): Promise<SubmitOutcome> => {
    const assetList = files.assetList;
    if (assetList && assetList.size > ASSET_LIST_MAX_BYTES) {
      return {
        ok: false,
        message: "That asset list is over 10 MB. Please attach a smaller file, or email it to us instead.",
        fieldErrors: { assetList: ["Please attach a file under 10 MB."] },
      };
    }

    // multipart/form-data rather than JSON, because the asset list is a file.
    const body = new FormData();
    for (const [field, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        for (const member of value) body.append(field, member);
      } else {
        body.append(field, String(value));
      }
    }
    if (assetList) body.append("assetList", assetList);

    const response = await fetch("/api/laptop-bank/equipment-offer", { method: "POST", body });
    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string; confirmation?: string; errors?: { fieldErrors?: Record<string, string[]> } }
      | null;

    if (!response.ok || !payload?.success) {
      return {
        ok: false,
        message: payload?.message || "We could not send your offer right now. Please try again.",
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
      id="offer-your-equipment"
      steps={steps}
      initialValues={INITIAL_VALUES}
      storageKey={STORAGE_KEY}
      submitLabel="Send this offer"
      onSubmit={handleSubmit}
    />
  );
}
