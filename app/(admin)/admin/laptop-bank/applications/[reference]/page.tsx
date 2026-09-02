import { GraduationCap } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LaptopBankSubmissionForm } from "@/components/admin/laptop-bank-submission-form";
import {
  ConsentList,
  DetailSection,
  StorageFailureWarning,
  SubmissionNotFound,
  UploadLink,
} from "@/components/admin/laptop-bank-submission-detail";
import { getStudentApplication } from "@/lib/cms/laptop-bank-submissions";

const ACCESS_LABELS: Record<string, string> = {
  none: "No access to a computer",
  "phone-only": "Phone only",
  "shared-machine": "A shared family or friend's machine",
  "campus-lab-or-cafe": "Campus lab or internet cafe only",
  "broken-laptop": "A broken laptop she cannot repair",
};

const CONSENT_LABELS = {
  commitmentCompleteTrack: "Will complete her training track",
  commitmentPeerTeaching: "Will give the peer teaching hours",
  commitmentCheckIns: "Will take part in three check-ins",
  loanToOwnTerms: "Accepts the loan-to-own terms",
  declarationOfTruth: "Declares the information is true",
  privacy: "Privacy notice — how we handle her information",
  storyAndPhoto: "Story or photograph may be used (optional)",
};

/**
 * One Her First Laptop application.
 *
 * This screen shows the most sensitive data on the site: a name, a phone
 * number, an institution, a student identifier, an enrolment document and a
 * written account of someone's circumstances. It is a review surface and
 * nothing more — there is deliberately no export, no bulk download and no
 * copy-all, because spec §7 requires applicant data to live in the named
 * system only, with "no spreadsheet export as the working copy".
 */
export default async function AdminLaptopBankApplicationPage({
  params,
}: {
  params: { reference: string };
}) {
  const application = await getStudentApplication(params.reference);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Her First Laptop"
        title={
          application ? application.preferredName || application.fullName : "Laptop application"
        }
        description={`Reference ${params.reference}`}
        icon={<GraduationCap className="h-6 w-6" />}
      />

      {!application ? (
        <SubmissionNotFound reference={params.reference} />
      ) : (
        <div className="space-y-6">
          {application.proofOfEnrolmentStorageFailed ? (
            <StorageFailureWarning what="The proof of enrolment" />
          ) : null}

          <DetailSection
            title="1. About her"
            rows={[
              { label: "Full name", value: application.fullName },
              { label: "Preferred name", value: application.preferredName },
              {
                label: "Phone",
                value: application.phoneIsWhatsApp
                  ? `${application.phone} (on WhatsApp)`
                  : application.phone,
              },
              { label: "Alternative contact", value: application.alternativeContact },
              { label: "Email", value: application.email },
              { label: "Region of residence", value: application.regionOfResidence },
            ]}
          />

          <DetailSection
            title="2. Her studies"
            rows={[
              { label: "Institution", value: application.institution },
              { label: "Programme of study", value: application.programmeOfStudy },
              { label: "Year of study", value: application.yearOfStudy },
              {
                label: "Expected completion",
                value: [application.expectedCompletionMonth, application.expectedCompletionYear]
                  .filter(Boolean)
                  .join(" "),
              },
              { label: "Student identifier", value: application.studentIdentifier },
            ]}
          />

          {application.proofOfEnrolmentUploadId ? (
            <UploadLink
              uploadId={application.proofOfEnrolmentUploadId}
              label="Proof of enrolment"
              logged
            />
          ) : null}

          <DetailSection
            title="3. Her situation"
            rows={[
              {
                label: "Current computer access",
                value:
                  ACCESS_LABELS[application.currentComputerAccess] ??
                  application.currentComputerAccess,
              },
              { label: "IT for Youth track", value: application.itfyTrack },
              { label: "How she heard about us", value: application.referralSource },
              {
                label: "Why she needs a computer",
                value: application.whyYouNeedIt,
                longform: true,
              },
              {
                label: "What she will do with it",
                value: application.whatYouWillDo,
                longform: true,
              },
            ]}
          />

          <ConsentList consents={application.consents} labels={CONSENT_LABELS} />

          {/*
            Spec §6.2 promises the applicant, in the form itself, that
            declining story and photograph consent "does not affect your
            application". That promise is only kept if the person deciding sees
            it, so it is stated here rather than left implicit.
          */}
          <div className="rounded-[24px] border border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-800">
            <span className="font-bold">
              Story and photograph consent{application.storyAndPhotoConsent ? " was" : " was not"}{" "}
              given.
            </span>{" "}
            This must not affect the selection decision either way — the public form promises her
            exactly that. It governs only whether her story may later appear on
            /her-first-laptop/stories, and a story still needs a written consent record on file
            before her name, institution and photograph can appear together.
          </div>

          <LaptopBankSubmissionForm
            kind="student-application"
            reference={application.reference}
            status={application.status}
            notes={application.notes}
            applicantEmail={application.email}
          />
        </div>
      )}
    </div>
  );
}
