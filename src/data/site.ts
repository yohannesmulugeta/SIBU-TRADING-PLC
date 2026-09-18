export const navigation = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story/" },
  { label: "Origins & Farms", href: "/origins/" },
  { label: "Coffee & Processing", href: "/coffee-processing/" },
  { label: "Quality & Impact", href: "/quality-impact/" },
  { label: "Contact", href: "/contact/" },
] as const;

export const generations = [
  {
    number: "01",
    name: "Mr. Hasan Areedo",
    era: "The foundation",
    description:
      "The first generation established the family’s connection to coffee production, collection and domestic trade in Guji.",
  },
  {
    number: "02",
    name: "Mr. Kadir Hasan",
    era: "Building Sibu",
    description:
      "The second generation expanded the family business and established Sibu Trading PLC in 2014 with an international vision.",
  },
  {
    number: "03",
    name: "Mr. Salim Kadir Hasan & Mr. Zidan Kadir Hasan Areedo",
    era: "Taking the legacy forward",
    description:
      "The third generation combines inherited coffee knowledge with specialty processing, traceability, technology and stronger global relationships.",
  },
] as const;

export const origins = [
  {
    name: "Guji · Kercha",
    description: "The historic heart of Sibu’s coffee journey and a central producing area.",
  },
  {
    name: "Hambella Wamena",
    description: "A high-elevation origin known for aromatic and fruit-forward coffees.",
  },
  {
    name: "Gelana · Abaya",
    description: "Producer communities selected for strong relationships and distinctive cup potential.",
  },
  {
    name: "Yirgacheffe & Lemo",
    description: "Selected Ethiopian origins prepared according to quality and buyer requirements.",
  },
] as const;

export const processes = [
  {
    number: "01",
    title: "Harvest & collection",
    description: "Ripe cherries are selectively picked and delivered from farms and partner communities.",
  },
  {
    number: "02",
    title: "Processing",
    description: "Natural, washed and selected honey processes reveal the character of each origin.",
  },
  {
    number: "03",
    title: "Drying & sorting",
    description: "Careful drying, movement and hand sorting protect consistency and physical quality.",
  },
  {
    number: "04",
    title: "Quality control",
    description: "Moisture, preparation, defects and sensory attributes are checked before presentation.",
  },
  {
    number: "05",
    title: "Preparation & export",
    description: "Coffee is prepared, packed and coordinated for the customer’s shipment requirements.",
  },
] as const;

export const contact = {
  address: "4th Floor, Adot Building, South African Street, Addis Ababa, Ethiopia",
  poBox: "P.O. Box 14666",
  telephone: "+251 11 558 0299",
  mobiles: ["+251 911 514 946", "+251 930 337 334"],
  email: "sibucoffee.ethio@gmail.com",
} as const;
