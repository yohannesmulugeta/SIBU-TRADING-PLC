import type { ImageMetadata } from "astro";
import asterBekele from "../assets/team/aster-bekele-demo.jpg";
import liyaDemissie from "../assets/team/liya-demissie-demo.jpg";
import mekonnenNuru from "../assets/team/mekonnen-nuru-demo.jpg";
import tesfayeAlemu from "../assets/team/tesfaye-alemu-demo.jpg";

export type TeamMember = {
  name: string;
  role: string;
  biography: string;
  image: ImageMetadata;
  alt: string;
};

export const teamDemoNotice =
  "Demo content: the names, roles, biographies, and AI-generated portraits on this page are fictional placeholders. They will be replaced with approved Sibu Trading information.";

export const featuredTeamMember: TeamMember = {
  name: "Aster Bekele",
  role: "General Manager",
  biography:
    "Fictional placeholder biography for the team-page layout. Replace it with an approved Sibu leadership introduction before publication.",
  image: asterBekele,
  alt: "AI-generated fictional demo portrait for the Sibu Trading team-page layout",
};

export const teamMembers: readonly TeamMember[] = [
  {
    name: "Tesfaye Alemu",
    role: "Quality & Sourcing Lead",
    biography:
      "Fictional placeholder biography. Replace this summary with approved Sibu team information before publication.",
    image: tesfayeAlemu,
    alt: "AI-generated fictional demo portrait for the Sibu Trading team-page layout",
  },
  {
    name: "Liya Demissie",
    role: "Export Operations Manager",
    biography:
      "Fictional placeholder biography. Replace this summary with approved Sibu team information before publication.",
    image: liyaDemissie,
    alt: "AI-generated fictional demo portrait for the Sibu Trading team-page layout",
  },
  {
    name: "Mekonnen Nuru",
    role: "Logistics Coordinator",
    biography:
      "Fictional placeholder biography. Replace this summary with approved Sibu team information before publication.",
    image: mekonnenNuru,
    alt: "AI-generated fictional demo portrait for the Sibu Trading team-page layout",
  },
] as const;
