import type { ImageMetadata } from "astro";
import melkamuKenea from "../assets/team/melkamu-kenea.webp";
import husniaMuzeyin from "../assets/team/husnia-muzeyin.webp";
import sileshiOlani from "../assets/team/sileshi-olani.webp";
import helenAssefaSete from "../assets/team/helen-assefa-sete.webp";
import isayasMitikuFufa from "../assets/team/isayas-mitiku-fufa.webp";

export type TeamMember = {
  name: string;
  role: string;
  image: ImageMetadata;
  alt: string;
};

export const teamMembers: readonly TeamMember[] = [
  {
    name: "Isayas Mitiku Fufa",
    role: "Export Manager",
    image: isayasMitikuFufa,
    alt: "Portrait of Isayas Mitiku Fufa",
  },
  {
    name: "Helen Assefa Sete",
    role: "Export Documentation Head",
    image: helenAssefaSete,
    alt: "Portrait of Helen Assefa Sete",
  },
  {
    name: "Sileshi Olani",
    role: "Quality Manager",
    image: sileshiOlani,
    alt: "Portrait of Sileshi Olani",
  },
  {
    name: "Husnia Muzeyin",
    role: "Finance Head",
    image: husniaMuzeyin,
    alt: "Portrait of Husnia Muzeyin",
  },
  {
    name: "Melkamu Kenea",
    role: "HR and Administration Head",
    image: melkamuKenea,
    alt: "Portrait of Melkamu Kenea",
  },
] as const;
