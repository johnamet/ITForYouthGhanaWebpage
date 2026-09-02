import { Laptop } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LaptopBankSubmissionForm } from "@/components/admin/laptop-bank-submission-form";
import {
  ConsentList,
  DetailSection,
  StorageFailureWarning,
  SubmissionNotFound,
  UploadLink,
} from "@/components/admin/laptop-bank-submission-detail";
import { getEquipmentOffer } from "@/lib/cms/laptop-bank-submissions";

const RECOGNITION_LABELS: Record<string, string> = {
  logo: "Named with logo",
  named: "Named only",
  anonymous: "Anonymous",
};

const CONSENT_LABELS = {
  privacy: "Privacy notice — how we handle this information",
  marketing: "Occasional updates about the Laptop Bank",
};

/**
 * One corporate equipment offer.
 *
 * Fields are grouped by the public form's own three steps, so a reviewer reads
 * the offer in the order the submitter wrote it rather than in an order this
 * page invented.
 */
export default async function AdminLaptopBankOfferPage({
  params,
}: {
  params: { reference: string };
}) {
  const offer = await getEquipmentOffer(params.reference);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="IT for Youth Laptop Bank"
        title={offer ? offer.organisationName : "Equipment offer"}
        description={`Reference ${params.reference}`}
        icon={<Laptop className="h-6 w-6" />}
      />

      {!offer ? (
        <SubmissionNotFound reference={params.reference} />
      ) : (
        <div className="space-y-6">
          {offer.assetListStorageFailed ? <StorageFailureWarning what="The asset list" /> : null}

          {offer.import_flag ? (
            <div className="rounded-[24px] border border-sky-300 bg-sky-50 p-5 text-sm leading-6 text-sky-900">
              <span className="font-bold">This offer is from outside Ghana.</span> It needs an
              import conversation before anything is agreed, and Draft 1 flags that nothing should
              imply the UK entity can receive donations before its registration and banking are in
              place.
            </div>
          ) : null}

          <DetailSection
            title="1. About the organisation"
            rows={[
              { label: "Organisation", value: offer.organisationName },
              { label: "Sector", value: offer.sector },
              { label: "Country", value: offer.country },
              { label: "City", value: offer.city },
              { label: "Contact", value: offer.contactName },
              { label: "Role", value: offer.contactRole },
              {
                label: "Work email",
                value: offer.free_webmail
                  ? `${offer.workEmail} (free webmail — worth confirming who they are)`
                  : offer.workEmail,
              },
              { label: "Phone", value: offer.phone },
              { label: "How they heard about us", value: offer.heardAboutUs },
            ]}
          />

          <DetailSection
            title="2. About the equipment"
            rows={[
              { label: "Equipment types", value: offer.equipmentTypes },
              { label: "Estimated quantity", value: offer.estimatedQuantity },
              { label: "Approximate age", value: offer.approximateAge },
              { label: "Released from device management", value: offer.releasedFromManagement },
              { label: "Firmware passwords cleared", value: offer.firmwarePasswordsCleared },
              { label: "Drives already wiped", value: offer.drivesAlreadyWiped },
              {
                label: "Drives retained by the donor",
                value: offer.needs_storage
                  ? "Yes — we need to supply storage"
                  : offer.drivesRetainedByYou,
              },
              { label: "Make and model", value: offer.makeAndModel, longform: true },
            ]}
          />

          {offer.assetListUploadId ? (
            <UploadLink uploadId={offer.assetListUploadId} label="Asset list" />
          ) : null}

          <DetailSection
            title="3. Logistics, recognition and consent"
            rows={[
              { label: "Target timeline", value: offer.targetTimeline },
              {
                label: "Public recognition",
                value: RECOGNITION_LABELS[offer.publicRecognition] ?? offer.publicRecognition,
              },
              {
                label: "Wants to discuss refurbishment costs",
                value: offer.supportRefurbishmentCosts,
              },
              { label: "Wants the deployment report", value: offer.deploymentReport },
              { label: "Collection address", value: offer.collectionAddress, longform: true },
              { label: "Anything else", value: offer.anythingElse, longform: true },
            ]}
          />

          {/*
            The recognition answer writes straight through to
            Donor.display_consent (spec §6.1 step 3), so it is repeated here
            beside the consents rather than left as one row above — creating
            the Donor record is the next action a reviewer takes, and getting
            this wrong publishes a logo nobody agreed to.
          */}
          <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            <span className="font-bold">
              Recognition: {RECOGNITION_LABELS[offer.publicRecognition] ?? offer.publicRecognition}.
            </span>{" "}
            When you create the Donor record for this organisation, set its display consent to
            exactly this. A logo appears on the public site only for &ldquo;Named with logo&rdquo;.
          </div>

          <ConsentList consents={offer.consents} labels={CONSENT_LABELS} />

          <LaptopBankSubmissionForm
            kind="equipment-offer"
            reference={offer.reference}
            status={offer.status}
            notes={offer.notes}
          />
        </div>
      )}
    </div>
  );
}
