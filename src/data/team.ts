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
  "Demo team layout — profiles pending Sibu Trading approval.";

export const featuredTeamMember: TeamMember = {
  name: "Aster Bekele",
  role: "Commercial & Operations Lead",
  biography:
    "Coordinates sourcing priorities, preparation planning and buyer communication across the coffee journey.",
  image: asterBekele,
  alt: "Temporary demo portrait for the Sibu Trading team-page layout",
};

export const teamMembers: readonly TeamMember[] = [
  {
    name: "Tesfaye Alemu",
    role: "Sourcing & Quality Lead",
    biography:
      "Connects origin relationships, lot selection and quality conversations from sourcing through preparation.",
    image: tesfayeAlemu,
    alt: "Temporary demo portrait for the Sibu Trading team-page layout",
  },
  {
    name: "Liya Demissie",
    role: "Export Operations Lead",
    biography:
      "Brings together export coordination, customer updates and the detailed preparation behind each shipment.",
    image: liyaDemissie,
    alt: "Temporary demo portrait for the Sibu Trading team-page layout",
  },
  {
    name: "Mekonnen Nuru",
    role: "Logistics & Documentation Lead",
    biography:
      "Supports lot handling, dispatch readiness and the documentation that connects coffee to destination.",
    image: mekonnenNuru,
    alt: "Temporary demo portrait for the Sibu Trading team-page layout",
  },
] as const;
