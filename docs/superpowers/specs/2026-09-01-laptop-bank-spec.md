# IT for Youth Laptop Bank + Her First Laptop — build spec (transcribed)

Source of truth: **"IT for Youth Laptop Bank — Website Build Specification v1.0"**
(August 2026, "Developer instructions — what, where, how").

A second PDF, **"Website Structure and Content Specification, Draft 1 — for
internal review before build"**, was supplied alongside it. Where the two
disagree, **v1.0 wins** — it is versioned 1.0 and written as developer
instructions, while Draft 1 is explicitly pre-build internal review. Draft 1 is
retained here only for the material v1.0 does not cover: the locked naming and
terminology table (§2), and the technical notes (§14). Its 8-stage process, its
"How we make it possible" navigation section and its 3-tier giving table are
all **superseded** by v1.0's 9 stages, top-level Laptop Bank nav and
`{{GIVE_1..3}}` tokens. Do not implement Draft 1's versions.

## Marker conventions (v1.0 §1)

| Marker | Meaning |
|---|---|
| COPY | Publish this text exactly as written. |
| BUILD | Structural or component instruction. |
| BEHAVIOUR | Interaction, validation or logic. |
| DATA | Field, model or CMS instruction. |
| `{{TOKEN}}` | Content not yet supplied by IT for Youth. See §11. |

- **BUILD** Render every `{{TOKEN}}` in staging as visible red text. Fail the
  production build if any `{{ }}` string exists in published content.
- **BUILD** Naming, exact, everywhere: "IT for Youth Laptop Bank" (short form
  after first mention on a page: "the Laptop Bank") and "Her First Laptop".

## Locked terminology (Draft 1 §2)

| Use this | Not this |
|---|---|
| IT for Youth Laptop Bank | Laptop Bank Ghana, ITFYG Laptop Bank |
| Her First Laptop | Her 1st Laptop, HerFirstLaptop |
| Renewed, refurbished | Used, second-hand, old, pre-owned, hand-me-down |
| Retired asset, fleet refresh, decommissioned device | Junk, e-waste, scrap (waste language belongs only on the recycling page) |
| Students, young women, participants, recipients | Beneficiaries, the needy, the less privileged |
| Data sanitisation, certified erasure | Wiping, formatting, deleting |
| Partner organisation, donor organisation | Sponsor (unless money changed hands) |

Capitalisation: "Laptop Bank" takes initial capitals as part of the programme
name. "laptop" alone is lower case. "Her First Laptop" always takes three
capitals.

## URL map (v1.0 §2.2) — final, printed on legal paperwork, never change

| URL | Page | Spec section | Phase |
|---|---|---|---|
| `/laptop-bank` | Laptop Bank landing | 5.1 | 1 |
| `/laptop-bank/how-it-works` | Process detail | 5.2 | 1 |
| `/laptop-bank/what-we-accept` | Intake specification | 5.3 | 1 |
| `/laptop-bank/data-security` | Data sanitisation | 5.4 | 1 |
| `/laptop-bank/donate-equipment` | Corporate offer form | 5.5 · 6.1 | 1 |
| `/her-first-laptop` | Appeal landing | 5.6 | 1 |
| `/her-first-laptop/eligibility` | Eligibility and selection | 5.7 | 1 |
| `/her-first-laptop/apply` | Student application form | 5.8 · 6.2 | 1 |
| `/policies/laptop-bank-privacy-notice` | Privacy notice | 5.9 | 1 |
| `/policies/laptop-bank-documents` | Document downloads | 5.10 | 1 |
| `/laptop-bank/impact` | Dashboard and reports | 5.11 | 2 |
| `/laptop-bank/partners` | Named donors | 5.12 | 2 |
| `/laptop-bank/recycling` | End-of-life handling | 5.13 | 2 |
| `/her-first-laptop/stories` | Recipient stories | 5.14 | 2 |

- **BUILD** 301 redirect `/what-we-do/laptop-bank` → `/laptop-bank`.
- **BUILD** Reserve `/laptop-bank/uk`, do not publish.
- **BUILD** Pages 5.11–5.14 must not appear in navigation or sitemap until
  populated with real records.

## Navigation (v1.0 §2.1)

"Laptop Bank" is top level, not nested.

| Item | Type | Children |
|---|---|---|
| Laptop Bank | Dropdown | How it works · What we accept · Data security · Impact · Partners · Donate equipment |
| Get involved | Dropdown | Her First Laptop · Volunteer · Partner with us |

**Reconciliation against the live site.** v1.0 §2.1 also lists About / What we
do / Impact / News / Contact / Donate, which describes a different site from
the one that exists: the live nav is Who We Are, What We Do, Apply for
Training, For Organisations, Get Involved, Our Impact, News & Updates, and the
most recent commit on this branch (`b911b32`) deliberately tuned it. Adopting
§2.1 wholesale would delete Apply for Training and For Organisations, which is
plainly not what this spec is asking for. So: **add** the "Laptop Bank"
top-level dropdown with exactly the children above, and **add** "Her First
Laptop" to the existing "Get Involved" dropdown. Leave every other nav item
alone. Impact and Partners are Phase 2, so per §9 they stay out of the
dropdown until populated.

## Components (v1.0 §3) — build once, reuse, no page-specific duplicates

| ID | Component | Requirements |
|---|---|---|
| C1 | Hero | Heading, subheading, primary button, secondary button or link. Secondary must be visible without scrolling on mobile. |
| C2 | Stat band | 4 metrics from one CMS record. Displays last-updated date. Auto-hides the whole band if any metric is null. |
| C3 | Process stepper | Horizontal on ≥1024px, vertical accordion below. One anchor per stage: `#stage-1` … `#stage-9`. Reads Process Stage. |
| C4 | Expandable section | Deep-linkable anchor. Opens automatically when the URL fragment matches. |
| C5 | Spec table | Responsive. Collapses to stacked cards below 768px. Accepted / not accepted visual states. Reads Intake Item. |
| C6 | Callout box | Two variants: info, warning. |
| C7 | Card row | 2, 3 or 4 cards. Title, body, optional link. |
| C8 | Multi-step form | Step progress indicator, save and resume, conditional panels, file upload with client-side compression, honeypot field, server-side rate limit. No image captcha. |
| C9 | Logo grid | Reads Donor. Renders only records where `display_consent = "logo"`. |
| C10 | Story card | Reads Story. Renders only records where `publication_consent = true`. |
| C11 | Metric card grid | Reads Dashboard Metrics. Displays period label and last-updated date. |
| C12 | Document download block | Title, format, file size, version, date. Reads Document. |
| C13 | Related programme block | Body text, link label, destination. Placed on the 8 pathway pages. |
| C14 | Sticky mobile CTA | Appears below 768px after 40% scroll. One button. |
| C15 | Giving mechanic | 3 fixed amounts plus open amount. Each amount shows an outcome line. Dual currency: GHS and GBP/USD. |

## CMS content types (v1.0 §4) — all six editable without a developer

| Type | Fields | Consumed by |
|---|---|---|
| Process Stage | `number` (int) · `title` · `summary_sentence` · `full_text` · `owner` · `record_produced` · `duration` | C3, page 5.2 |
| Intake Item | `item` · `minimum_accepted` · `notes` · `accepted` (bool) · `sort_order` | C5, pages 5.1 and 5.3 |
| Donor | `name` · `logo` · `sector` · `country` · `display_consent` (enum: logo, named, anonymous) · `quote` · `quote_attribution` | C9, pages 5.1 and 5.12 |
| Story | `preferred_name` · `photo` · `quote` · `pathway` · `region` · `institution` · `publication_consent` (bool) · `consent_record_ref` · `date` | C10, pages 5.6 and 5.14 |
| Dashboard Metrics | `period_label` · `last_updated` · one integer field per metric in 5.11 | C2, C11 |
| Document | `title` · `file` · `format` · `version` · `date` · `audience_tag` (enum: corporate, applicant, public) | C12, page 5.10 |

- **DATA** Story and Donor records must not render when their consent field is
  false or "anonymous". **Enforce in the query, not the template.**

---

# Page specifications

## 5.1 `/laptop-bank`

| # | Block | Component | Content |
|---|---|---|---|
| 1 | Hero | C1 | Copy below |
| 2 | Stat band | C2 | 4 metrics: accepted, equipped, drives sanitised, partners |
| 3 | What we handle for you | C7 — 4 cards | Table below |
| 4 | Process, 9 stages | C3 | Summary sentence only. Link: "See the process in full" → `/laptop-bank/how-it-works` |
| 5 | Where the machines go | C7 — 3 cards | Copy below |
| 6 | What we accept | C5, condensed | First 6 Intake Items only. Link → `/laptop-bank/what-we-accept` |
| 7 | Partners | C9 | Phase 2. Hide when fewer than 4 records. |
| 8 | Closing CTA | C1 variant | Copy below |
| 9 | Sticky CTA | C14 | Button: Offer your equipment |

**COPY** Hero heading:
> Your retired laptops have another decade of use in them.

**COPY** Hero subheading:
> The IT for Youth Laptop Bank collects retired computers from Ghanaian and
> international companies, sanitises every drive to a certified standard,
> refurbishes each machine, and places it with a young person in training. You
> get a documented, compliant route for your fleet refresh. She gets the tool
> she needs.

**COPY** Hero buttons: `[Offer your equipment]` → `/laptop-bank/donate-equipment` ·
`[Download the corporate pack]` → PDF, ungated

Block 3 — four cards:

| Card title | Card body (COPY) | Link |
|---|---|---|
| Certified data destruction | Every drive is sanitised to a recognised standard on arrival, whether or not it has already been wiped. You receive a certificate for every serial number. | `/laptop-bank/data-security` |
| Documented transfer | A Deed of Gift transfers title, records every asset, and disclaims warranty. Your legal and procurement teams get a document they can file. | `/policies/laptop-bank-documents` |
| Collection and logistics | We count, seal and collect from your premises, with a dual-signed manifest at both ends. | `/laptop-bank/how-it-works` |
| Certified recycling of the rest | Units we cannot use are recycled through a licensed handler against a certificate of destruction. Nothing enters the informal waste stream. | `/laptop-bank/recycling` |

Block 5 — three cards:

| Card title | Card body (COPY) | Link |
|---|---|---|
| Her First Laptop | Individual machines for young women in higher education, delivered with Girls in Tech. | `/her-first-laptop` |
| Tech Clubs and Rural Tech Connect | Shared machines equipping school clubs and community labs beyond Accra. | `/what-we-do/tech-clubs` |
| Academy and Entrepreneurship Hub | Machines for participants and founders in active training. | `/what-we-do/youth-academy` |

**COPY** Block 8 heading:
> Planning a fleet refresh?

**COPY** Block 8 body:
> Tell us roughly what you have and when. We will tell you within
> `{{SLA_REPLY}}` what we can take, what we cannot, and how we would handle the
> rest. Offers of ten machines and offers of five hundred are both welcome.

**COPY** Block 8 button: `[Offer your equipment]`

- **BEHAVIOUR** Corporate pack download requires no email address. Track
  download events separately.
- **BEHAVIOUR** `{{SLA_REPLY}}` is used on this page, 5.2 and 5.5. Single
  source in the CMS, referenced three times.
- **BUILD** Title: `IT for Youth Laptop Bank — donate retired corporate laptops in Ghana`
- **BUILD** Meta: `We collect retired corporate computers, sanitise every drive to a certified standard, refurbish them and place them with young people in training. Certificates, documented transfer and licensed recycling included.`

## 5.2 `/laptop-bank/how-it-works`

| # | Block | Component | Content |
|---|---|---|---|
| 1 | Intro | Text | Copy below |
| 2 | Summary table | Table | 9 rows: stage, duration, what you receive |
| 3 | Stage detail | C4 × 9 | One expandable per stage. Anchors `#stage-1` … `#stage-9` |
| 4 | CTA | C1 variant | Button: Offer your equipment |

**COPY** Intro:
> Nine stages, from your first email to the certificate confirming a machine
> has reached the end of its useful life. Every stage produces a document, and
> you receive copies of the ones that concern your equipment.

Block 2 — publish exactly:

| Stage | Duration | What you receive |
|---|---|---|
| 1 Offer and qualification | Within `{{SLA_REPLY}}` | A written decision, including what we cannot take and why |
| 2 Agreement and transfer of title | `{{DUR_AGREEMENT}}` | Signed Deed of Gift with your asset list annexed |
| 3 Collection | By arrangement | Dual-signed collection manifest |
| 4 Intake, tagging and grading | `{{DUR_INTAKE}}` | Grading summary for your consignment |
| 5 Data sanitisation | `{{DUR_WIPE}}` | A sanitisation certificate for every serial number |
| 6 Refurbishment and quality assurance | `{{DUR_REFURB}}` | Available on request |
| 7 Allocation and handover | Next selection cycle | Named deployment report at 3 months |
| 8 In-life tracking | 12 months | Outcome summary at 12 months |
| 9 End of life and recycling | As required | Certificate of destruction covering your rejected units |

Block 3 — Process Stage records. Each expandable shows `full_text`, then
`owner` and `record_produced` as a two-column footer.

| # | Title | full_text | owner / record_produced |
|---|---|---|---|
| 1 | Offer and qualification | We assess every offer against our published intake specification before agreeing to anything. The assessment covers quantity, age and specification, location, your timeline, and whether the machines are locked to a management platform. An offer can be accepted in full, accepted in part, or declined with an explanation and a referral to a certified recycler. | Partnerships lead / Offer record with outcome and reason |
| 2 | Agreement and transfer of title | A Deed of Gift is signed before collection. It transfers legal title to IT for Youth Ghana, records the asset list by serial number, disclaims all warranties, confirms which party is responsible for data removal, confirms the machines have been released from device management and firmware passwords cleared, and states that we may deploy, retain for parts, or responsibly recycle any unit at our discretion. Units we cannot use are not returned. | Operations manager / Signed Deed of Gift with asset manifest annexed |
| 3 | Collection and chain of custody | Machines are counted against the manifest at your premises, in the presence of your representative, and both parties sign. Units travel sealed and are counted again on arrival at our facility by a second member of staff. Any discrepancy is recorded and reported to you within one working day. | Operations manager / Dual-signed collection manifest; arrival count sheet |
| 4 | Intake, tagging and grading | Every unit receives a permanent IT for Youth asset tag and a register entry capturing serial number, make, model, processor, memory, storage, screen condition, battery health, charger presence and donor batch. Each unit is then graded. Grade A deploys to an individual. Grade B deploys to shared use in a club or lab. Grade C is retained for parts. Reject goes to certified recycling. | Technical lead / Asset register entry per unit; consignment grading summary |
| 5 | Data sanitisation | Every storage device is sanitised to `{{WIPE_STANDARD}}` on arrival, whether or not it has already been wiped. Method depends on the drive: full overwrite for mechanical drives, the drive's own secure erase or cryptographic erase command for solid-state drives, and physical destruction for any drive that fails to verify. Drives from units graded for parts or rejection are removed and destroyed rather than wiped. Each unit produces a certificate carrying the serial number, method, date, result and operator. | Technical lead / Per-unit sanitisation certificate; consolidated pack issued to donor |
| 6 | Refurbishment, imaging and quality assurance | Physical repair and cleaning, memory or storage upgrades where parts allow, battery replacement where economical, then installation of `{{OS_NAME}}` and the standard IT for Youth software image. Every unit passes a written quality assurance checklist before it leaves the bench: boot time, all ports and keys, camera and microphone, wireless, battery runtime under load, and no diagnostic errors. | Technical lead / Signed QA checklist per unit |
| 7 | Allocation and handover | Units are allocated against applications by a selection panel on a published cycle. Not first-come-first-served. The recipient signs a loan-to-own agreement, receives an induction covering care, security, backup and fault reporting, and signs a handover record. Photographs are taken only where separate written consent exists. | Programmes lead / Selection panel minutes; signed loan-to-own agreement; handover record |
| 8 | In-life tracking and support | Check-ins at three, six and twelve months confirm the machine is working and in the recipient's possession. Repairs are handled from the parts pool. Loss or theft is reported and recorded against the asset. On completion of the agreed training track and `{{PEER_HOURS}}` of peer teaching, title transfers to the recipient. | Programmes lead / Check-in log per asset; ownership transfer certificate |
| 9 | End of life and recycling | Units leave only through a licensed electronic waste handler, against a weight receipt and a certificate of destruction. Nothing is sold into the informal repair market and nothing is left in general waste. Volumes and certificates are published annually. | Operations manager / Disposal certificate referenced against every asset tag |

## 5.3 `/laptop-bank/what-we-accept`

| # | Block | Component | Content |
|---|---|---|---|
| 1 | Intro | Text | Copy below |
| 2 | Firmware warning | C6 warning | Copy below. **Must sit above block 3.** |
| 3 | Specification | C5 | All Intake Items, split accepted / not accepted |
| 4 | Closing | Text | Copy below |

**COPY** Intro heading:
> We are selective, and here is why.

**COPY** Intro body:
> A computer that cannot run a supported operating system for at least three
> more years is not a gift to a student, it is a problem transferred to her. So
> we publish our minimums, we test every unit against them, and we say no in
> writing when equipment falls short. We would rather take twenty good machines
> than two hundred we have to bury.

**COPY** Warning heading:
> Before you offer machines, check two things.

**COPY** Warning body:
> Corporate laptops are usually enrolled in a device management platform and
> often carry a firmware password. Both must be cleared by your IT team before
> handover, because neither can be removed by us. A machine still enrolled
> cannot be reimaged and cannot be deployed, however good the hardware is. Your
> IT team will know this as releasing the device from management and clearing
> the BIOS or EFI password.

**COPY** Closing:
> Not sure whether your equipment qualifies? Send us the model names and rough
> age and we will tell you. There is no obligation.

Intake Item records to load:

| item | minimum_accepted | notes | accepted |
|---|---|---|---|
| Laptop processor | Intel Core i5 8th generation or newer, or AMD Ryzen 3 2000 series or newer | Anything older cannot run a supported operating system for a useful lifetime. | true |
| Memory | 8 GB, or 4 GB with a second slot | Single-slot 4 GB units are Grade C at best. | true |
| Storage | 256 GB solid-state | Mechanical drives accepted only where an SSD can be fitted from the parts pool. | true |
| Screen | Intact, no cracks, no dead-pixel clusters | Cracked screens are Grade C. | true |
| Battery | 60 per cent of rated capacity, or a replacement available | Tested on every unit. | true |
| Charger | One per unit | Bulk offers without chargers are assessed case by case. | true |
| Firmware and management state | No BIOS or EFI password, released from all device management platforms | The most common reason a donation fails. Raise it before collection. | true |
| Provenance | Named donor organisation with a signed Deed of Gift | No anonymous bulk drops. | true |
| Peripherals and parts | Monitors, docking stations, chargers, keyboards, mice, network switches, access points, memory and storage parts, projectors | Actively wanted. These equip labs and clubs. | true |
| Below the processor floor | — | Declined in writing with a referral to a licensed recycler. | false |
| Cathode-ray monitors, printers | — | Not accepted. | false |
| Water-damaged units | — | Not accepted. | false |
| Desktops without monitors | — | Not accepted. | false |
| Unknown-provenance devices | — | Not accepted. | false |

## 5.4 `/laptop-bank/data-security`

Nine sections, in this order. One paragraph each unless noted.

| # | Section heading | Content required | Anchor |
|---|---|---|---|
| 1 | Our commitment | Every storage device entering our facility is sanitised before any other work begins, whether or not it has already been wiped. We assume nothing about the state of an incoming drive. | `#commitment` |
| 2 | Method by drive type | Full overwrite for mechanical drives. Secure erase or cryptographic erase for solid-state. Physical destruction where a drive fails to verify. Name `{{WIPE_STANDARD}}` explicitly. | `#method` |
| 3 | Verification | Every erase is verified. Any drive failing verification is physically destroyed rather than retried. | `#verification` |
| 4 | Certificates | One per serial number: method, date, result, operator. Consolidated pack issued to the donor. State retention period `{{CERT_RETENTION}}`. | `#certificates` |
| 5 | Chain of custody | Count at donor premises against manifest, dual signature, sealed transport, second count and signature on arrival, discrepancies reported within one working day. | `#custody` |
| 6 | Physical security | Where units are held, who has access, how the register is maintained. Awaiting `{{FACILITY_STATEMENT}}`. | `#facility` |
| 7 | Drives we do not wipe | Drives from units graded for parts or rejection are removed and destroyed, not sanitised and resold. | `#parts-drives` |
| 8 | Asset tags and branding | Donor asset tags, engravings and branding are removed before deployment. | `#tags` |
| 9 | What we do not do | We do not sell donated equipment. We do not pass units into the informal repair market. We do not deploy any machine that has not passed both sanitisation and quality assurance. | `#exclusions` |

- **BUILD** Page ends with a C12 block containing one file: the data handling
  statement PDF, versioned and dated.

## 5.5 `/laptop-bank/donate-equipment`

| # | Block | Component | Content |
|---|---|---|---|
| 1 | Heading and intro | Text | Copy below |
| 2 | Form | C8, 3 steps | Fields in 6.1 |
| 3 | Confirmation state | Text | Copy below |

**COPY** Heading: `Offer your equipment`

**COPY** Intro:
> Five minutes now saves a meeting later. We reply within `{{SLA_REPLY}}` with
> what we can take, what we cannot, and how we would handle the rest. If you
> have an asset list, attach it and skip most of this form.

**COPY** Confirmation:
> Thank you. Your reference is `{{REF}}`. We will reply within `{{SLA_REPLY}}`.
> We have emailed you the corporate pack, which includes our data handling
> statement and the Deed of Gift template.

- **BEHAVIOUR** Step titles: 1 About your organisation · 2 About the equipment ·
  3 Logistics and consent.
- **BEHAVIOUR** Save progress between steps against a browser token. No account
  required.
- **BEHAVIOUR** On submit: generate reference, render confirmation state on the
  same URL, send acknowledgement email with corporate pack attached, create CRM
  record with source attribution.
- **BEHAVIOUR** Do not redirect to a generic thank-you page.

## 5.6 `/her-first-laptop`

| # | Block | Component | Content |
|---|---|---|---|
| 1 | Hero | C1 | Copy below |
| 2 | The need | Text | Three sentences plus one figure. Awaiting `{{NEED_STAT}}`. |
| 3 | Giving mechanic | C15 | Amounts in §11 |
| 4 | How it works | C7 — 4 cards | Copy below |
| 5 | Loan-to-own | Text | Copy below |
| 6 | One story | C10, limit 1 | Phase 2. Hide when no consented record exists. |
| 7 | Where the machines come from | Text + link | Copy below |
| 8 | Closing giving mechanic | C15 | Repeat of block 3 |
| 9 | Sticky CTA | C14 | Button: Give a laptop |

**COPY** Hero heading: `Her first laptop`
**COPY** Hero subheading: `A refurbished machine of her own, and the training to use it.`
**COPY** Hero primary button: `[Give a laptop]`
**COPY** Hero secondary link: `I am a student — apply here` → `/her-first-laptop/apply`

Block 4 — four cards, in order:

| Card title | Card body (COPY) |
|---|---|
| 1. A company retires a machine | Banks, telecoms companies and mining firms refresh their laptop fleets every three to four years. We collect what they retire. |
| 2. We sanitise and refurbish it | Every drive is wiped to a certified standard. Parts are replaced, the machine is reimaged, and it passes a full quality check. |
| 3. She applies and is selected | Applications are reviewed by a panel on a published cycle, against published criteria. |
| 4. She earns full ownership | The laptop is hers to keep once she completes her training track and `{{PEER_HOURS}}` teaching other young people what she has learned. |

**COPY** Block 5:
> This is not a giveaway. Every laptop is issued on a `{{LOAN_MONTHS}}`
> agreement and becomes hers outright when she has completed her training track
> and her teaching hours. Your donation covers sanitisation, parts, licensing,
> logistics and a year of support — not the purchase of a computer, because the
> computer was already built.

**COPY** Block 7:
> Her First Laptop is powered by the IT for Youth Laptop Bank, which collects,
> sanitises and refurbishes retired corporate equipment across Ghana.
> `[How the Laptop Bank works]`

- **BEHAVIOUR** The student link in block 1 must remain visible in the mobile
  viewport without scrolling.
- **BEHAVIOUR** C15 shows GHS and one of GBP or USD side by side. Currency
  toggle optional; dual display is not.

## 5.7 `/her-first-laptop/eligibility`

| # | Block | Component | Content |
|---|---|---|---|
| 1 | Who can apply | Bullet list | Copy below |
| 2 | How we choose | Ordered list | Copy below |
| 3 | What you commit to | Bullet list | Copy below |
| 4 | The cycle | Text | `{{CYCLE}}` and `{{PANEL}}` |
| 5 | If you are not selected | Text | Copy below |
| 6 | No payment notice | C6 warning | Copy below |
| 7 | FAQ | C4 × 6 | Questions below |
| 8 | CTA | C1 variant | Button: Start your application |

**COPY** Block 1 — Who can apply:
> - Women enrolled at a recognised Ghanaian tertiary institution
> - Currently on, or accepted onto, an IT for Youth training track
> - Without regular access to a working computer

**COPY** Block 2 — How we choose:
> 1. How limited your current access to a computer is
> 2. Commitment already shown through participation in our programmes
> 3. How far your course or work genuinely requires a computer
> 4. Priority groups: `{{PRIORITY_GROUPS}}`

**COPY** Block 3 — What you commit to:
> - Completing your training track
> - `{{PEER_HOURS}}` teaching other young people what you have learned
> - Three check-ins over twelve months
> - Reporting loss, theft or damage

**COPY** Block 5:
> We receive far more applications than we have machines. If you are not
> selected this cycle you stay on the list for the next one, and you can use the
> shared machines in our Tech Clubs and community labs in the meantime.

**COPY** Block 6:
> Applying is free. No payment of any kind is required at any stage, and no
> member of our staff will ever ask you for money. If anyone does, report it to
> `{{REPORT_CONTACT}}`.

Block 7 — FAQ questions, in order:
1. Does it cost anything?
2. When does the laptop become mine?
3. What happens if it breaks?
4. Can I apply if I already have a broken laptop?
5. Can I apply if I am not yet in an IT for Youth programme?
6. How long does a decision take?

**Presentation reconciliation.** This repo's public pages avoid bullet lists
(standing preference; enforced across phases 2–5 of the media/prose
programme via `lib/utils/prose.ts`). Blocks 1 and 3 therefore publish the same
COPY strings composed into prose through `pointsToParagraph`, not as `<ul>`.
Block 2's ordering is semantic — the criteria are ranked — so it publishes as
the numbered `<ol>` treatment already established in
`components/organisations/organisation-enquiry-form.tsx` (numbered circles,
no bullet glyph, no icon). Every COPY word is preserved.

## 5.8 `/her-first-laptop/apply`

| # | Block | Component | Content |
|---|---|---|---|
| 1 | Eligibility and commitments summary | Text | Condensed blocks 1 and 3 from 5.7. **Must appear before the first field.** |
| 2 | Form | C8 | Fields in 6.2 |
| 3 | Confirmation state | Text | Copy below |

**COPY** Confirmation:
> Your application is in. Your reference is `{{REF}}`. Decisions for this cycle
> are announced on `{{DECISION_DATE}}` and we will contact you on the number you
> gave us, whether or not you are selected.

- **BEHAVIOUR** Mobile first. Target a full page weight under 500 KB. Most
  applicants are on a phone on mobile data.
- **BEHAVIOUR** Save and resume keyed on phone number or email. No account.
- **BEHAVIOUR** On submit: send confirmation by SMS and email. SMS is the
  primary channel.
- **BEHAVIOUR** Compress image uploads client-side to a maximum 1600px long
  edge before upload.

## 5.9 `/policies/laptop-bank-privacy-notice`

Sections in this order. Content supplied by IT for Youth; build the page
structure now.

| # | Section | Must state |
|---|---|---|
| 1 | Who we are | Controller identity and a named contact route for data questions |
| 2 | What we collect | Split into four sub-sections: applicants, recipients, corporate contacts, website visitors |
| 3 | Why | A specific purpose per category |
| 4 | Lawful basis | Per purpose |
| 5 | Who we share with | Named categories: selection panel, institutions for enrolment verification, funders receiving aggregate reporting, hosting and email providers |
| 6 | How long we keep it | Retention in years per category, with a short stated retention for unsuccessful applications |
| 7 | Your rights | Access, correction, deletion, complaint route |
| 8 | Data leaving Ghana | Whether site, forms and email are hosted outside Ghana, and where |

- **BUILD** Link this page from: both forms, the footer of every page, and both
  confirmation emails.

## 5.10 `/policies/laptop-bank-documents`

One page, C12 blocks grouped by `audience_tag`. Files at launch: Corporate pack
(PDF) · Deed of Gift template · Data handling statement · Intake specification ·
Loan-to-own agreement template · Privacy notice.

- **DATA** Every file displays version and date. Superseded versions are
  removed, not stacked.

## 5.11 `/laptop-bank/impact` (Phase 2)

C11 metric grid, then a C12 downloads block. All metrics from one Dashboard
Metrics record:

| Field | Label on page |
|---|---|
| `units_offered` | Units offered |
| `units_accepted` | Units accepted |
| `units_declined_at_offer` | Units declined at offer |
| `units_rejected_at_intake` | Units rejected at intake |
| `drives_sanitised` | Drives sanitised, with certificates issued |
| `deployed_individual` | Deployed to individuals |
| `deployed_shared` | Deployed to clubs and labs |
| `ownership_transfers` | Recipients who now own their machine |
| `retention_12m_pct` | Working and in the recipient's hands at 12 months |
| `units_recycled` | Units recycled through a licensed handler |
| `partner_orgs` | Partner organisations |
| `deployment_by_region` | Deployment by region |
| `deployment_by_pathway` | Deployment by pathway |

- **DATA** Do not query the asset register live. Read the CMS record only.
  Display its `last_updated` date at the top of the grid.
- **BUILD** Downloads block: annual Laptop Bank report, data handling statement,
  intake specification, recycling summary.

## 5.12 `/laptop-bank/partners` (Phase 2)

C9 logo grid, then quote cards for donors with a quote populated. Recognition
tiers described in body copy supplied by IT for Youth.

- **BEHAVIOUR** Suppress the page from navigation until at least 4 records have
  `display_consent = logo`.

## 5.13 `/laptop-bank/recycling` (Phase 2)

Sections: licensed handler name and licence reference · certificates of
destruction · annual volumes by weight · explicit statement that we are not an
import route for foreign electronic waste. Link from the Advocacy pathway page.

## 5.14 `/her-first-laptop/stories` (Phase 2)

C10 grid. Query filters on `publication_consent = true`.

- **DATA** Never render `preferred_name`, `institution` and `photo` together
  unless `consent_record_ref` is populated. Enforce in the query.

---

# 6. Form field specifications

## 6.1 Corporate equipment offer form

**Step 1 — About your organisation**

| Field | Type | Req | Validation and behaviour |
|---|---|---|---|
| Organisation name | text | Y | |
| Sector | select | N | Banking · telecoms · mining · oil and gas · public sector · education · NGO · technology · other |
| Country | select | Y | Non-Ghana selection sets `crm.import_flag = true` |
| City | text | Y | |
| Your name | text | Y | |
| Your role | text | Y | |
| Work email | email | Y | Format check. Free webmail domain triggers a soft prompt, not a block |
| Phone | tel | N | |
| How did you hear about us | select | N | Stored as source attribution |

**Step 2 — About the equipment**

| Field | Type | Req | Validation and behaviour |
|---|---|---|---|
| Equipment types | multiselect | Y | Laptops · desktops · monitors · docking stations · chargers · keyboards and mice · networking · projectors · parts · other |
| Estimated quantity | select | Y | Bands: 1–9 · 10–49 · 50–99 · 100–499 · 500+ |
| Approximate age | select | Y | Under 3 years · 3–5 · 5–7 · over 7 · mixed |
| Make and model | textarea | N | Free text |
| Asset list | file | N | CSV, XLSX, PDF. Max 10 MB. Prompt for this at the top of the step |
| Released from device management | radio | Y | Yes · No · Need to check. "No" or "Need to check" opens an info panel; does not block submission |
| Firmware passwords cleared | radio | Y | Same three options, same behaviour |
| Drives already wiped | radio | Y | Yes with certificates · Yes without · No · Unsure. All four answers display the same line: "We re-sanitise every drive on arrival regardless." |
| Drives retained by you | radio | Y | Yes · No. "Yes" sets `crm.needs_storage = true` |

**Step 3 — Logistics, recognition and consent**

| Field | Type | Req | Validation and behaviour |
|---|---|---|---|
| Collection address | textarea | N | Do not block submission on this |
| Target timeline | select | Y | Within a month · 1–3 months · 3–6 months · later · no fixed date |
| Public recognition | radio | Y | Named with logo · Named only · Anonymous. Writes directly to `Donor.display_consent` |
| Support refurbishment costs | checkbox | N | Label: "I would also like to discuss supporting refurbishment costs" |
| Deployment report | checkbox | N | Default checked |
| Anything else | textarea | N | |
| Privacy consent | checkbox | Y | Unchecked by default. Links to 5.9. **Must not be bundled with any other consent** |
| Marketing consent | checkbox | N | Separate checkbox, unchecked by default |

- **BEHAVIOUR** Anti-spam: hidden honeypot field plus server-side rate limiting.
  No image captcha.

## 6.2 Student application form

| Field | Type | Req | Validation and behaviour |
|---|---|---|---|
| Full name | text | Y | |
| Preferred name | text | N | Used in all correspondence |
| Phone | tel | Y | Ghana format validation. Adjacent checkbox: "This number is on WhatsApp" |
| Alternative contact | tel or email | Y | Must differ from the primary phone |
| Email | email | N | |
| Institution | select + other | Y | Pre-populated list of recognised institutions |
| Programme of study | text | Y | |
| Year of study | select | Y | |
| Expected completion | month + year | Y | |
| Student identifier | text | Y | |
| Proof of enrolment | file | Y | JPG, PNG, PDF. Max 5 MB. Compress client-side to 1600px long edge |
| Region of residence | select | Y | 16 regions |
| Current computer access | radio | Y | None · Phone only · Shared family or friend machine · Campus lab or cafe only · Broken laptop I cannot repair |
| IT for Youth track | select | Y | The 8 pathways plus "Not yet enrolled" |
| Why you need a computer | textarea | Y | Hard cap 200 words. Live word counter |
| What you will do with it | textarea | Y | Hard cap 150 words. Live word counter |
| Referral source | select | N | |
| Commitment: complete the track | checkbox | Y | Ticked individually |
| Commitment: `{{PEER_HOURS}}` teaching | checkbox | Y | Number displayed in the label |
| Commitment: three check-ins | checkbox | Y | |
| Loan-to-own terms | checkbox + link | Y | Link opens the full agreement in a new tab |
| Declaration of truth | checkbox | Y | |
| Privacy consent | checkbox | Y | Links to 5.9 |
| Story and photo consent | checkbox | N | Optional. Adjacent text: "This does not affect your application." |

- **DATA** Do not add fields for household income, guardian income, bank
  details, or hardship documentation. **Do not add date of birth.**
- **BEHAVIOUR** All four commitment and consent checkboxes are separate inputs.
  No single combined checkbox.

# 7. Data handling rules

- Uploaded enrolment documents are stored outside the public web root and served
  only through an authenticated route. No guessable URLs.
- Implement a deletion job on the retention schedule in 5.9 section 6. Log
  deletions.
- Form notification emails to staff contain a reference number and a link only.
  **No personal data in the email body.**
- Applicant data is written to the named system only. No shared inbox, no
  spreadsheet export as the working copy.
- Consent checkboxes are never pre-ticked and never bundled. Store each consent
  as its own boolean with a timestamp.
- Set no analytics or embed cookies before consent.
- Serve the whole site over HTTPS. Force redirect.

# 8. Cross-links on the eight pathway pages

Add one C13 block to each page below, after the main body, before the footer.
CMS-editable per page.

| Pathway page | Body text (COPY) | Link label | Destination |
|---|---|---|---|
| Girls in Tech | Every woman on this pathway can apply for a refurbished laptop of her own through Her First Laptop. | Apply for a laptop | `/her-first-laptop` |
| Youth Tech Academy | Academy participants without a working computer can apply for one through the IT for Youth Laptop Bank. | About the Laptop Bank | `/laptop-bank` |
| Rural Tech Connect | The devices behind this pathway come from companies retiring their equipment, through the IT for Youth Laptop Bank. | About the Laptop Bank | `/laptop-bank` |
| Tech Clubs | School clubs are equipped with refurbished machines from the IT for Youth Laptop Bank. | About the Laptop Bank | `/laptop-bank` |
| Entrepreneurship Hub | Founders in the Hub can apply for a device through the IT for Youth Laptop Bank. | About the Laptop Bank | `/laptop-bank` |
| Code Impact Challenge | Challenge teams are loaned machines from the IT for Youth Laptop Bank for the duration of the build. | About the Laptop Bank | `/laptop-bank` |
| Advocacy | Our position on device access and electronic waste sits with the IT for Youth Laptop Bank. | Recycling and e-waste | `/laptop-bank/recycling` |
| Community Outreach | No block at launch. | — | — |

# 9. Build order

| Phase | Deliverables | Blocked by |
|---|---|---|
| 1 Launch | Nav and URL map (§2) · components C1, C3–C8, C12, C13, C14, C15 · CMS types Process Stage, Intake Item, Document · pages 5.1–5.10 · forms 6.1 and 6.2 · data handling (§7) · cross-links (§8) | Tokens in §11 marked Phase 1 |
| 2 First 90 days | Components C2, C9, C10, C11 · CMS types Donor, Story, Dashboard Metrics · pages 5.11–5.14 · stat band on 5.1 | First completed consignment; 4+ consenting donors; recycler appointed |
| 3 Later | Applicant status lookup by reference · `/laptop-bank/uk` · donor self-service portal | Volume; UK entity decisions |

# 10. Pre-launch checklist

- No `{{TOKEN}}` string exists anywhere in published content.
- C2 stat band is hidden, or shows real figures with a last-updated date. No
  zeros, no placeholders.
- `{{SLA_REPLY}}` renders the same value on 5.1, 5.2 and 5.5.
- Privacy notice links from both forms, every footer, and both confirmation
  emails.
- All nine `#stage-n` anchors on 5.2 resolve and auto-open the matching C4.
- All nine anchors on 5.4 resolve.
- Both forms submit successfully on a throttled 3G profile.
- 5.8 total page weight under 500 KB.
- Enrolment document upload is not retrievable by URL without authentication.
- Every consent checkbox is unchecked on first load.
- Phase 2 pages return 404 or are noindex until populated.
- Corporate pack downloads without an email gate.
- Story and Donor queries exclude non-consenting records — verified with a test
  record.

# 11. Content awaiting IT for Youth

Developer action: build with the token in place. **Do not invent values.**

| Token | Needed for | Phase |
|---|---|---|
| `{{SLA_REPLY}}` | Reply commitment. Pages 5.1, 5.2, 5.5 | 1 |
| `{{DUR_AGREEMENT}}` `{{DUR_INTAKE}}` `{{DUR_WIPE}}` `{{DUR_REFURB}}` | Stage durations, page 5.2 | 1 |
| `{{WIPE_STANDARD}}` | Named sanitisation standard. Pages 5.2 stage 5, 5.4 | 1 |
| `{{CERT_RETENTION}}` | Certificate retention period. Page 5.4 | 1 |
| `{{FACILITY_STATEMENT}}` | Physical security paragraph. Page 5.4 section 6 | 1 |
| `{{OS_NAME}}` | Operating system installed. Page 5.2 stage 6 | 1 |
| `{{GIVE_1}}` `{{GIVE_2}}` `{{GIVE_3}}` plus an outcome line for each | C15 giving mechanic, page 5.6 | 1 |
| `{{LOAN_MONTHS}}` | Loan period. Pages 5.6, 5.7, form 6.2 | 1 |
| `{{PEER_HOURS}}` | Teaching hours. Pages 5.2, 5.6, 5.7, form 6.2 | 1 |
| `{{CYCLE}}` `{{PANEL}}` `{{DECISION_DATE}}` | Selection cycle, panel, next decision date. Pages 5.7, 5.8 | 1 |
| `{{PRIORITY_GROUPS}}` | Published priority groups. Page 5.7 | 1 |
| `{{REPORT_CONTACT}}` | Reporting route for payment demands. Page 5.7 | 1 |
| `{{NEED_STAT}}` | The one figure in block 2. Page 5.6 | 1 |
| Privacy notice body | All eight sections. Page 5.9 | 1 |
| All six launch PDFs | Page 5.10 | 1 |
| `{{RECYCLER}}` | Licensed handler name and licence reference. Page 5.13 | 2 |
| Recognition tier copy | Page 5.12 | 2 |

`{{REF}}` is not in §11 — it is generated at submit time by the application
itself (5.5, 5.8), not supplied by IT for Youth.

# 16. Claims not to publish until verified (Draft 1 §16)

Retained because it constrains what may go into seed content. Keep off the site
until the underlying fact exists and is documented:

- Any statement that donated equipment is tax deductible.
- Any named erasure standard not yet demonstrably followed.
- Any cost per laptop not calculated including failed intake and labour.
- Any count of requests received, laptops deployed or students trained that
  cannot be evidenced from a record.
- Any claim about employment or income outcomes for recipients.
- Any statement that equipment is "recycled responsibly" without a named
  partner behind it.
- Any story or photograph without recorded consent, and any composite story
  presented as an individual.
- Any implication that the UK entity can receive donations or issue receipts.

This is why every unsupplied figure stays a token and no seed Donor, Story or
Dashboard Metrics record ships with invented numbers.
