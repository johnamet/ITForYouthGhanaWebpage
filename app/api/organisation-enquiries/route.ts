import { NextResponse } from "next/server";

import { persistContactMessage } from "@/lib/cms/persistence";
import { sendContactNotification } from "@/lib/email/contact-notification";
import {
  organisationEnquirySchema,
  type ContactPayload,
  type OrganisationEnquiryPayload,
} from "@/lib/utils/validators";

const opportunityTypeLabels: Record<
  Extract<OrganisationEnquiryPayload, { kind: "job-vacancy" }>["opportunityType"],
  string
> = {
  "full-time": "Full-time role",
  "part-time": "Part-time role",
  internship: "Internship",
  "graduate-programme": "Graduate programme",
  contract: "Contract role",
  apprenticeship: "Apprenticeship",
};

const workArrangementLabels: Record<
  Extract<OrganisationEnquiryPayload, { kind: "job-vacancy" }>["workArrangement"],
  string
> = {
  "on-site": "On-site",
  hybrid: "Hybrid",
  remote: "Fully remote",
};

const entryLevelLabels: Record<
  Extract<OrganisationEnquiryPayload, { kind: "job-vacancy" }>["entryLevelFit"],
  string
> = {
  yes: "Yes",
  no: "No",
  depends: "Depends on the candidate",
};

const volunteeringAreaLabels: Record<
  Extract<OrganisationEnquiryPayload, { kind: "staff-volunteering" }>["volunteeringAreas"][number],
  string
> = {
  mentoring: "Mentoring",
  workshops: "Skills workshops",
  "career-talks": "Career talks",
  "cv-portfolio-reviews": "CV or portfolio reviews",
  "mock-interviews": "Mock interviews",
  "event-judging": "Event or challenge judging",
  "project-coaching": "Project coaching",
  other: "Other practical support",
};

const engagementLengthLabels: Record<
  Extract<OrganisationEnquiryPayload, { kind: "staff-volunteering" }>["engagementLength"],
  string
> = {
  "one-off": "One-off activity",
  "short-series": "Short series of activities",
  ongoing: "Ongoing engagement",
  "not-sure": "Not sure yet",
};

const deliveryModeLabels: Record<
  Extract<OrganisationEnquiryPayload, { kind: "staff-volunteering" }>["deliveryMode"],
  string
> = {
  "in-person": "In person",
  remote: "Remote",
  hybrid: "Hybrid",
  flexible: "Flexible",
};

function valueOrNotProvided(value?: string | number) {
  return value === undefined || value === "" ? "Not provided" : String(value);
}

function buildJobVacancyMessage(
  payload: Extract<OrganisationEnquiryPayload, { kind: "job-vacancy" }>,
) {
  return [
    "JOB VACANCY SUBMISSION",
    "",
    "ORGANISATION",
    `Name: ${payload.organisationName}`,
    `Website: ${valueOrNotProvided(payload.organisationWebsite)}`,
    `Sector or industry: ${payload.industry}`,
    "",
    "VACANCY",
    `Position title: ${payload.roleTitle}`,
    `Opportunity type: ${opportunityTypeLabels[payload.opportunityType]}`,
    `Team or department: ${valueOrNotProvided(payload.team)}`,
    `Number of openings: ${payload.numberOfOpenings}`,
    `Location: ${payload.jobLocation}`,
    `Work arrangement: ${workArrangementLabels[payload.workArrangement]}`,
    `Suitable for early-career candidates: ${entryLevelLabels[payload.entryLevelFit]}`,
    `Application deadline: ${payload.applicationDeadline}`,
    `Expected start date: ${valueOrNotProvided(payload.expectedStartDate)}`,
    `Salary or allowance range: ${valueOrNotProvided(payload.compensation)}`,
    "",
    "ROLE SUMMARY AND RESPONSIBILITIES",
    payload.roleSummary,
    "",
    "SKILLS, EXPERIENCE AND QUALIFICATIONS",
    payload.requirements,
    "",
    "HOW CANDIDATES SHOULD APPLY",
    payload.applicationMethod,
    "",
    "ADDITIONAL NOTES",
    valueOrNotProvided(payload.additionalNotes),
  ].join("\n");
}

function buildStaffVolunteeringMessage(
  payload: Extract<OrganisationEnquiryPayload, { kind: "staff-volunteering" }>,
) {
  return [
    "STAFF VOLUNTEERING ENQUIRY",
    "",
    "ORGANISATION",
    `Name: ${payload.organisationName}`,
    `Address: ${payload.organisationAddress}`,
    `Website: ${valueOrNotProvided(payload.organisationWebsite)}`,
    `Sector or industry: ${payload.industry}`,
    "",
    "PROPOSED ENGAGEMENT",
    `Number of staff volunteers: ${payload.numberOfStaff}`,
    `Ways they would like to help: ${payload.volunteeringAreas.map((area) => volunteeringAreaLabels[area]).join(", ")}`,
    `Preferred commitment: ${engagementLengthLabels[payload.engagementLength]}`,
    `Availability: ${payload.availability}`,
    `Delivery mode: ${deliveryModeLabels[payload.deliveryMode]}`,
    `Preferred location: ${valueOrNotProvided(payload.preferredLocation)}`,
    `Number of learners they could support: ${valueOrNotProvided(payload.numberOfLearners)}`,
    "",
    "STAFF SKILLS AND EXPERIENCE",
    payload.staffExpertise,
    "",
    "WHAT A USEFUL ENGAGEMENT SHOULD ACHIEVE",
    payload.goals,
    "",
    "ADDITIONAL OR LOGISTICAL NOTES",
    valueOrNotProvided(payload.additionalNotes),
  ].join("\n");
}

function toContactPayload(payload: OrganisationEnquiryPayload): ContactPayload {
  return {
    name: payload.contactName,
    email: payload.workEmail,
    phone: payload.phone,
    organisation: payload.organisationName,
    enquiryType: payload.kind === "job-vacancy" ? "organisation" : "volunteering",
    preferredContact: payload.preferredContact,
    message:
      payload.kind === "job-vacancy"
        ? buildJobVacancyMessage(payload)
        : buildStaffVolunteeringMessage(payload),
    consent: payload.consent,
  };
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = organisationEnquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields and try again.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  // Silently accept bot submissions caught by the honeypot without storing or emailing them.
  if (parsed.data.companyFax) {
    return NextResponse.json({ success: true, message: "Thanks. Your submission has been received." });
  }

  if (
    parsed.data.kind === "job-vacancy" &&
    new Date(`${parsed.data.applicationDeadline}T23:59:59Z`).getTime() < Date.now()
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields and try again.",
        errors: {
          fieldErrors: {
            applicationDeadline: ["Please choose an application deadline that has not passed."],
          },
        },
      },
      { status: 400 },
    );
  }

  const contactPayload = toContactPayload(parsed.data);
  const details = JSON.parse(JSON.stringify(parsed.data)) as Record<string, unknown>;
  delete details.companyFax;

  const persistence = await persistContactMessage({
    ...contactPayload,
    submissionType: parsed.data.kind,
    details,
  }).catch((error) => {
    console.error("Organisation enquiry persistence failed", error);
    return {
      configured: true,
      written: false,
      id: undefined,
    };
  });
  const notification = await sendContactNotification(contactPayload, {
    subject:
      parsed.data.kind === "job-vacancy"
        ? `Job vacancy submission: ${parsed.data.roleTitle}`
        : `Staff volunteering enquiry: ${parsed.data.organisationName}`,
  });

  if (
    !persistence.written &&
    !notification.delivered &&
    (persistence.configured || notification.configured)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "We could not deliver your submission right now. Please try again or email the team directly.",
      },
      { status: 502 },
    );
  }

  const isJobVacancy = parsed.data.kind === "job-vacancy";

  return NextResponse.json({
    success: true,
    message: persistence.written || notification.delivered
      ? isJobVacancy
        ? "Thank you. Your vacancy has been received, and the team will review it before sharing it with suitable candidates."
        : "Thank you. Your staff volunteering enquiry has been received, and the team will contact you to discuss the right format."
      : "Your form is valid. Submission delivery will activate when the website's production services are configured.",
    delivery: notification.delivered ? "brevo" : "not-delivered",
    persistence: persistence.written
      ? "firestore"
      : persistence.configured
        ? "failed"
        : "not-configured",
    id: persistence.id,
  });
}
