/**
 * Photographs paired with prose on public pages.
 *
 * Public pages pair every prose block with an image or video. Where the CMS
 * carries no authored image, a card resolves one from this pool. Local ITFYG
 * photography is listed first in each theme so it wins the low hash indices;
 * Unsplash fills the remainder. `images.unsplash.com` is already an allowed
 * remotePatterns host in next.config.mjs.
 */

export type PoolEntry = {
  /** An Unsplash URL, or a local path under /images/. */
  url: string;
  /** Describes the photograph; used when the CMS carries no imageAlt. */
  alt: string;
};

export type MediaTheme =
  | "training"
  | "coding"
  | "mentoring"
  | "community"
  | "girls-in-tech"
  | "entrepreneurship"
  | "partnership"
  | "corporate"
  | "graduation"
  | "rural"
  | "advocacy"
  | "youth"
  | "team"
  | "impact";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

/**
 * FNV-1a. Chosen because it is tiny, dependency-free, and above all
 * deterministic — these components render on the server and hydrate on the
 * client, so the pick must not vary between the two.
 */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

const LOCAL = {
  banner: { url: "/images/randomPictures/children_holding_sign_in_streets.jpg", alt: "Young people holding an IT For Youth Ghana banner in the street." },
  gradFrontal: { url: "/images/randomPictures/frontalgraduation.jpg", alt: "Graduates in gowns seated at a cohort graduation ceremony." },
  girlsUx: { url: "/images/randomPictures/girlstaslkingUX.jpg", alt: "Young women working together at computers in a training lab." },
  graduation: { url: "/images/randomPictures/graduation.jpg", alt: "Graduates in caps and gowns at an IT For Youth Ghana ceremony." },
  graduations: { url: "/images/randomPictures/graduations.jpg", alt: "Graduates holding their ceremony programmes." },
  gradSpeaking: { url: "/images/randomPictures/graduationspeaking.jpg", alt: "The marquee set for a cohort graduation ceremony." },
  groupGirls: { url: "/images/randomPictures/group_girls.jpg", alt: "Participants in IT For Youth Ghana t-shirts standing together." },
  girlsEntrance: { url: "/images/randomPictures/groupofgirlsentrance.jpg", alt: "A group of young women in programme t-shirts outside the venue." },
  schoolHall: { url: "/images/randomPictures/groupworkstudents.jpg", alt: "School pupils in uniform raising their hands during a session." },
  happyStudents: { url: "/images/randomPictures/happystudentscasual.jpg", alt: "Pupils in uniform celebrating during a school tech club session." },
  mainGrad: { url: "/images/randomPictures/maingraduationpic.jpg", alt: "A large group portrait of graduates outdoors." },
  mavePeter: { url: "/images/randomPictures/mave_peter.JPG", alt: "Team members and a young participant at a media appearance." },
  lab: { url: "/images/randomPictures/mireiotalking.jpg", alt: "Facilitators working with learners in a computer lab." },
  assembly: { url: "/images/randomPictures/peterblackboard.jpg", alt: "A school assembly hall full of seated pupils." },
  eventSpeaker: { url: "/images/randomPictures/peterTalking.jpg", alt: "A speaker addressing the Code Impact Challenge audience." },
  cohortGirls: { url: "/images/randomPictures/petertalkingtostudentscoloful.jpg", alt: "Cohort participants in programme t-shirts together." },
  pupilsHands: { url: "/images/randomPictures/redclothingStudents.jpg", alt: "Pupils in school uniform with hands raised in a hall." },
  pupilsHall: { url: "/images/randomPictures/redstudentgrouplesson.jpg", alt: "Pupils gathered in a school hall for a tech club session." },
  podium: { url: "/images/randomPictures/studentpresenting.jpg", alt: "A presenter speaking at a podium beside a projector screen." },
  gradSpeech: { url: "/images/randomPictures/studentpresentin.jpg", alt: "A graduate giving a speech at the ceremony podium." },
  coding: { url: "/images/randomPictures/studentsBackcoding.jpg", alt: "Learners writing code at desktop computers." },
  labBlue: { url: "/images/randomPictures/studentsblueclothing.jpg", alt: "Learners at workstations during a training session." },
  gradSeated: { url: "/images/randomPictures/studentslisteningfrontal.JPG", alt: "Gowned graduates seated under the ceremony marquee." },
  gradListening: { url: "/images/randomPictures/studentslistening.jpg", alt: "Graduates listening during the ceremony." },
  workshop: { url: "/images/randomPictures/UX4.jpg", alt: "Participants at tables with laptops during a workshop." },
  uxCourse: { url: "/images/randomPictures/UXcours.jpg", alt: "Women working on laptops during a UX design course." },
  uxStudents: { url: "/images/randomPictures/uXstudents.jpg", alt: "A classroom of participants working on laptops." },
  facilitator: { url: "/images/randomPictures/UXteacher_opt.jpg", alt: "A facilitator presenting at a whiteboard beside programme banners." },
  facilitator2: { url: "/images/randomPictures/UXteacher.png", alt: "A facilitator leading a session at the whiteboard." },
  classroomPair: { url: "/images/randomPictures/whiteLady.jpg", alt: "A facilitator working with a learner in the classroom." },
} satisfies Record<string, PoolEntry>;

export const MEDIA_POOL: Record<MediaTheme, PoolEntry[]> = {
  training: [
    LOCAL.labBlue, LOCAL.pupilsHall, LOCAL.gradListening, LOCAL.lab, LOCAL.uxStudents, LOCAL.workshop,
    { url: UNSPLASH("photo-1509062522246-3755977927d7"), alt: "A classroom of pupils working with their teacher." },
    { url: UNSPLASH("photo-1524178232363-1fb2b075b655"), alt: "Rows of learners seated in a large lecture room." },
  ],
  coding: [
    LOCAL.coding, LOCAL.labBlue, LOCAL.girlsUx, LOCAL.lab,
    { url: UNSPLASH("photo-1531482615713-2afd69097998"), alt: "Developers working at computers in a studio." },
    { url: UNSPLASH("photo-1516321318423-f06f85e504b3"), alt: "Hands typing on a laptop keyboard." },
    { url: UNSPLASH("photo-1531538606174-0f90ff5dce83"), alt: "Colleagues pointing at code on a laptop screen." },
    { url: UNSPLASH("photo-1497633762265-9d179a990aa6"), alt: "A stack of programming books." },
  ],
  mentoring: [
    LOCAL.facilitator, LOCAL.facilitator2, LOCAL.classroomPair, LOCAL.mavePeter, LOCAL.uxCourse,
    { url: UNSPLASH("photo-1543269865-cbf427effbad"), alt: "Young people collaborating around a table." },
    { url: UNSPLASH("photo-1600880292203-757bb62b4baf"), alt: "Two colleagues celebrating over a laptop." },
    { url: UNSPLASH("photo-1531545514256-b1400bc00f31"), alt: "A small group gathered around a laptop, smiling." },
  ],
  community: [
    LOCAL.banner, LOCAL.schoolHall, LOCAL.happyStudents, LOCAL.assembly, LOCAL.pupilsHands,
    { url: UNSPLASH("photo-1488521787991-ed7bbaae773c"), alt: "Children smiling and reaching towards the camera." },
    { url: UNSPLASH("photo-1541844053589-346841d0b34c"), alt: "Children gathered together outdoors, smiling." },
    { url: UNSPLASH("photo-1509099836639-18ba1795216d"), alt: "A group of children laughing together." },
  ],
  "girls-in-tech": [
    LOCAL.groupGirls, LOCAL.girlsEntrance, LOCAL.cohortGirls, LOCAL.girlsUx, LOCAL.uxCourse,
    { url: UNSPLASH("photo-1571260899304-425eee4c7efc"), alt: "A student standing with books beside her study group." },
    { url: UNSPLASH("photo-1573497019940-1c28c88b4f3e"), alt: "A woman smiling in a professional setting." },
    { url: UNSPLASH("photo-1573164713988-8665fc963095"), alt: "A young professional woman beside a window." },
  ],
  entrepreneurship: [
    LOCAL.podium, LOCAL.gradSpeech, LOCAL.workshop,
    { url: UNSPLASH("photo-1552664730-d307ca884978"), alt: "A team planning against a wall of sticky notes." },
    { url: UNSPLASH("photo-1454165804606-c3d57bc86b40"), alt: "Hands sketching plans beside a laptop." },
    { url: UNSPLASH("photo-1591115765373-5207764f72e7"), alt: "An audience at a startup meetup." },
    { url: UNSPLASH("photo-1434030216411-0b793f4b4173"), alt: "A hand writing notes beside a coffee cup." },
    { url: UNSPLASH("photo-1503945438517-f65904a52ce6"), alt: "Game pieces arranged to suggest strategy." },
  ],
  partnership: [
    LOCAL.mavePeter, LOCAL.eventSpeaker, LOCAL.podium,
    { url: UNSPLASH("photo-1600880292203-757bb62b4baf"), alt: "Two colleagues celebrating over a laptop." },
    { url: UNSPLASH("photo-1517048676732-d65bc937f952"), alt: "A team meeting around a long table." },
    { url: UNSPLASH("photo-1522071820081-009f0129c71c"), alt: "Colleagues working together in a shared workspace." },
    { url: UNSPLASH("photo-1517245386807-bb43f82c33c4"), alt: "Hands gesturing towards charts on a laptop." },
    { url: UNSPLASH("photo-1521737604893-d14cc237f11d"), alt: "A group working together at a long table." },
  ],
  corporate: [
    LOCAL.workshop, LOCAL.uxCourse, LOCAL.uxStudents,
    { url: UNSPLASH("photo-1544717297-fa95b6ee9643"), alt: "A professional working at a desk with a laptop." },
    { url: UNSPLASH("photo-1560250097-0b93528c311a"), alt: "A professional portrait in an office setting." },
    { url: UNSPLASH("photo-1517048676732-d65bc937f952"), alt: "A team meeting around a long table." },
    { url: UNSPLASH("photo-1524178232363-1fb2b075b655"), alt: "Rows of attendees in a large conference room." },
    { url: UNSPLASH("photo-1522071820081-009f0129c71c"), alt: "Colleagues working in a shared workspace." },
  ],
  graduation: [
    LOCAL.gradFrontal, LOCAL.graduation, LOCAL.graduations, LOCAL.gradSpeaking, LOCAL.mainGrad, LOCAL.gradSeated, LOCAL.gradListening,
    { url: UNSPLASH("photo-1541339907198-e08756dedf3f"), alt: "Graduates throwing their caps at sunset." },
  ],
  rural: [
    LOCAL.banner, LOCAL.schoolHall, LOCAL.assembly, LOCAL.pupilsHands,
    { url: UNSPLASH("photo-1509391366360-2e959784a276"), alt: "Solar panels in an open field." },
    { url: UNSPLASH("photo-1541844053589-346841d0b34c"), alt: "Children gathered together outdoors." },
    { url: UNSPLASH("photo-1509099836639-18ba1795216d"), alt: "A group of children laughing together." },
    { url: UNSPLASH("photo-1488521787991-ed7bbaae773c"), alt: "Children reaching towards the camera." },
  ],
  advocacy: [
    LOCAL.banner, LOCAL.eventSpeaker, LOCAL.podium, LOCAL.gradSpeech,
    { url: UNSPLASH("photo-1591115765373-5207764f72e7"), alt: "An audience listening at a public talk." },
    { url: UNSPLASH("photo-1488521787991-ed7bbaae773c"), alt: "Children reaching towards the camera." },
    { url: UNSPLASH("photo-1503945438517-f65904a52ce6"), alt: "Game pieces arranged to suggest a lone voice." },
    { url: UNSPLASH("photo-1541844053589-346841d0b34c"), alt: "Children gathered together outdoors." },
  ],
  youth: [
    LOCAL.groupGirls, LOCAL.girlsEntrance, LOCAL.happyStudents, LOCAL.pupilsHands, LOCAL.schoolHall,
    { url: UNSPLASH("photo-1517486808906-6ca8b3f04846"), alt: "Young people sitting together on a bench outdoors." },
    { url: UNSPLASH("photo-1522202176988-66273c2fd55f"), alt: "Three young people studying together at a laptop." },
    { url: UNSPLASH("photo-1543269865-cbf427effbad"), alt: "Young people collaborating around a table." },
  ],
  team: [
    LOCAL.mavePeter, LOCAL.eventSpeaker, LOCAL.facilitator, LOCAL.facilitator2, LOCAL.classroomPair,
    { url: UNSPLASH("photo-1573497019940-1c28c88b4f3e"), alt: "A team member smiling in a professional setting." },
    { url: UNSPLASH("photo-1560250097-0b93528c311a"), alt: "A professional portrait in an office setting." },
    { url: UNSPLASH("photo-1573164713988-8665fc963095"), alt: "A young professional beside a window." },
  ],
  impact: [
    LOCAL.graduations, LOCAL.mainGrad, LOCAL.podium, LOCAL.gradSpeech, LOCAL.gradFrontal,
    { url: UNSPLASH("photo-1541339907198-e08756dedf3f"), alt: "Graduates throwing their caps at sunset." },
    { url: UNSPLASH("photo-1434030216411-0b793f4b4173"), alt: "A hand writing notes beside a coffee cup." },
    { url: UNSPLASH("photo-1517245386807-bb43f82c33c4"), alt: "Hands gesturing towards charts on a laptop." },
  ],
};

/** Picks a stable photograph for a single card. */
export function resolveMedia(key: string, theme: MediaTheme): PoolEntry {
  const pool = MEDIA_POOL[theme];
  return pool[fnv1a(key) % pool.length];
}

/**
 * Picks photographs for a group of sibling cards, avoiding repeats within the
 * group. Once the pool is exhausted the used set is cleared and photographs
 * repeat, which is the honest degradation for a group larger than its pool.
 */
export function resolveMediaSet(keys: string[], theme: MediaTheme): PoolEntry[] {
  const pool = MEDIA_POOL[theme];
  const used = new Set<number>();
  let lastIndex: number | undefined;

  return keys.map((key) => {
    if (used.size >= pool.length) {
      used.clear();
      // Re-seed with the photo just handed out so the wrap-around can't
      // repeat it immediately — card 9 landing on the same photo as card 8
      // is the most visible kind of duplicate. Guard pool.length === 1: a
      // repeat is then unavoidable, and re-adding would leave used.size
      // equal to pool.length, breaking the while loop's termination
      // guarantee below.
      if (lastIndex !== undefined && pool.length > 1) used.add(lastIndex);
    }
    let index = fnv1a(key) % pool.length;
    while (used.has(index)) index = (index + 1) % pool.length;
    used.add(index);
    lastIndex = index;
    return pool[index];
  });
}
