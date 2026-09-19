export type HeroStoryChapter = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  position: "left" | "right";
  range: [number, number];
};

export const heroStoryIntro = {
  eyebrow: "Ethiopian coffee · A family legacy",
  title: ["Three generations.", "One origin. One legacy."],
  description:
    "A coffee story rooted in Guji, carried through generations and continuing into the future.",
  range: [0, 0.11] as [number, number],
};

export const heroStoryChapters: HeroStoryChapter[] = [
  {
    number: "01",
    eyebrow: "The foundation",
    title: "It began with the land.",
    description:
      "Mr. Hasan Areedo established the family’s connection to coffee production, collection and domestic trade in Guji.",
    position: "left",
    range: [0.12, 0.34],
  },
  {
    number: "02",
    eyebrow: "Building Sibu",
    title: "The legacy was carried forward.",
    description:
      "Mr. Kadir Hasan expanded the family business and established Sibu Trading PLC in 2014 with an international vision.",
    position: "right",
    range: [0.37, 0.67],
  },
  {
    number: "03",
    eyebrow: "The next chapter",
    title: "And the story continues.",
    description:
      "Mr. Salim Kadir Hasan and Mr. Zidan Kadir Hasan Areedo combine inherited coffee knowledge with specialty processing, traceability and global relationships.",
    position: "left",
    range: [0.71, 1],
  },
];
