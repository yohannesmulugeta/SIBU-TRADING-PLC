import type { ImageMetadata } from "astro";
import cafeShowGreenBooth from "../assets/recognition/cafeshow-green-booth-2019.webp";
import coopBankAppreciation from "../assets/recognition/coop-bank-appreciation.webp";
import coopBankMerit from "../assets/recognition/coop-bank-merit-2020.webp";
import cupOfExcellence from "../assets/recognition/cup-of-excellence-ethiopia-2020.webp";
import ecocertEuOrganic from "../assets/recognition/ecocert-eu-organic-2021-2023.webp";
import ecocertNopOrganic from "../assets/recognition/ecocert-nop-organic-2021.webp";
import gelanInvestmentRecognition from "../assets/recognition/gelan-investment-recognition-2014.webp";
import gfoundationAppreciation from "../assets/recognition/gfoundation-appreciation-2025.webp";
import hijraBankAward from "../assets/recognition/hijra-bank-silver-award-2026.webp";
import hijraBankRecognition from "../assets/recognition/hijra-bank-silver-recognition-2026.webp";
import ministryRevenueRecognition from "../assets/recognition/ministry-revenue-recognition-2025.webp";
import oromiaAwardTrophy from "../assets/recognition/oromia-award-trophy-2011.webp";
import oromiaGovernmentRecognition from "../assets/recognition/oromia-government-recognition-2009.webp";
import oromiaInvestmentPerformance from "../assets/recognition/oromia-investment-performance-2014.webp";
import oromiaTaxAwardTrophy from "../assets/recognition/oromia-tax-award-trophy-2017.webp";
import oromiaTaxRecognition2011 from "../assets/recognition/oromia-tax-recognition-2011.webp";
import oromiaTaxRecognition2013 from "../assets/recognition/oromia-tax-recognition-2013.webp";
import oromiaTradeIndustryPlaque from "../assets/recognition/oromia-trade-industry-plaque-2014.webp";
import rainforestAllianceCertificate from "../assets/recognition/rainforest-alliance-certificate-2021-2024.webp";
import recognitionDisplay from "../assets/recognition/sibu-recognition-display.webp";

export const recognitionCategories = ["Company", "Coffee", "Certifications", "Leadership", "Partnerships"] as const;

export type RecognitionCategory = (typeof recognitionCategories)[number];

export type RecognitionItem = {
  id: string;
  category: RecognitionCategory;
  title: string;
  issuer: string;
  recipient: string;
  year: string;
  status: string;
  summary: string;
  alt: string;
  image: ImageMetadata;
  placements?: readonly ("home" | "quality")[];
};

export const recognitionItems: RecognitionItem[] = [
  {
    id: "coop-bank-merit-2020",
    category: "Company",
    title: "Certificate of Merit",
    issuer: "Cooperative Bank of Oromia",
    recipient: "Sibu Coffee Exporter",
    year: "2020",
    status: "Historical recognition",
    summary: "Recognition for export achievement and contribution to the bank between July 2018 and December 2019.",
    alt: "Cooperative Bank of Oromia Certificate of Merit awarded to Sibu Coffee Exporter",
    image: coopBankMerit,
  },
  {
    id: "hijra-bank-silver-recognition-2026",
    category: "Leadership",
    title: "Silver Level Recognition",
    issuer: "Hijra Bank",
    recipient: "Kedir Hasen Aredo",
    year: "2026",
    status: "Leadership recognition",
    summary: "Recognition for contribution to the bank's growth and paid-up capital milestone.",
    alt: "Hijra Bank Silver Level Certificate of Recognition presented to Kedir Hasen Aredo",
    image: hijraBankRecognition,
  },
  {
    id: "coop-bank-appreciation",
    category: "Company",
    title: "Certificate of Appreciation",
    issuer: "Cooperative Bank of Oromia",
    recipient: "Sibu Trading PLC",
    year: "Year not shown",
    status: "Historical recognition",
    summary: "Recognition for Sibu's contribution of foreign currency to the branch and bank.",
    alt: "Cooperative Bank of Oromia Certificate of Appreciation presented to Sibu Trading PLC",
    image: coopBankAppreciation,
  },
  {
    id: "ecocert-eu-organic-2021-2023",
    category: "Certifications",
    title: "Ecocert Organic Certificate",
    issuer: "Ecocert",
    recipient: "Sibu Coffee Exporter PLC",
    year: "2021-2023",
    status: "Expired 31 March 2023",
    summary: "Historical EU organic certification for listed green, sun-dried and washed coffee activities.",
    alt: "Historical Ecocert organic certificate for Sibu Coffee Exporter PLC",
    image: ecocertEuOrganic,
    placements: ["quality"],
  },
  {
    id: "oromia-tax-recognition-2011",
    category: "Leadership",
    title: "Regional Tax Recognition",
    issuer: "Oromia Regional Government",
    recipient: "Kadir Hasan Araddoo",
    year: "2011",
    status: "Leadership recognition",
    summary: "A regional recognition preserved as part of Sibu's leadership archive.",
    alt: "2011 Oromia regional recognition certificate presented to Kadir Hasan Araddoo",
    image: oromiaTaxRecognition2011,
  },
  {
    id: "oromia-investment-performance-2014",
    category: "Leadership",
    title: "Best Investment Performance",
    issuer: "Oromia Investment Commission",
    recipient: "Kadir Hasan",
    year: "2014",
    status: "Leadership recognition",
    summary: "Regional certificate recognizing investment performance.",
    alt: "2014 Oromia certificate for Best Investment Performance presented to Kadir Hasan",
    image: oromiaInvestmentPerformance,
  },
  {
    id: "oromia-government-recognition-2009",
    category: "Leadership",
    title: "Oromia Government Recognition",
    issuer: "Oromia Regional Government",
    recipient: "Kadir Hasan Areedoo",
    year: "2009",
    status: "Leadership recognition",
    summary: "A regional-government recognition preserved in the family and company archive.",
    alt: "2009 Oromia regional-government recognition certificate presented to Kadir Hasan Areedoo",
    image: oromiaGovernmentRecognition,
  },
  {
    id: "gelan-investment-recognition-2014",
    category: "Company",
    title: "Gelan Investment Recognition",
    issuer: "Gelan City Administration and Oromia Industry and Investment",
    recipient: "Sibu Trading",
    year: "2014",
    status: "Historical recognition",
    summary: "Recognition for Sibu Trading's contribution to local investment and development.",
    alt: "2014 Gelan City and Oromia investment recognition certificate issued to Sibu Trading",
    image: gelanInvestmentRecognition,
  },
  {
    id: "cup-of-excellence-ethiopia-2020",
    category: "Coffee",
    title: "Cup of Excellence Ethiopia",
    issuer: "Cup of Excellence Ethiopia",
    recipient: "Sibu Coffee Exporters",
    year: "2020",
    status: "National award winner",
    summary: "National award recognition with a score of 85.79.",
    alt: "Cup of Excellence Ethiopia 2020 National Award Winner certificate for Sibu Coffee Exporters",
    image: cupOfExcellence,
    placements: ["home"],
  },
  {
    id: "oromia-tax-recognition-2013",
    category: "Leadership",
    title: "Tax Recognition",
    issuer: "Oromia Regional Revenue Authority",
    recipient: "Kadir Hasan",
    year: "2013",
    status: "Leadership recognition",
    summary: "A regional tax recognition preserved as part of the leadership archive.",
    alt: "2013 Oromia regional tax recognition certificate presented to Kadir Hasan",
    image: oromiaTaxRecognition2013,
  },
  {
    id: "ecocert-nop-organic-2021",
    category: "Certifications",
    title: "NOP Organic Operation Certificate",
    issuer: "Ecocert",
    recipient: "Sibu Coffee Exporter PLC",
    year: "2021",
    status: "Historical document - current status unverified",
    summary: "Historical NOP organic-operation certificate. Current certification must be confirmed for the relevant crop, station and lot.",
    alt: "Historical 2021 Ecocert NOP organic-operation certificate for Sibu Coffee Exporter PLC",
    image: ecocertNopOrganic,
    placements: ["quality"],
  },
  {
    id: "cafeshow-green-booth-2019",
    category: "Coffee",
    title: "Green Booth Recognition",
    issuer: "Cafe Show Seoul",
    recipient: "Sibu Coffee Exporter PLC",
    year: "2019",
    status: "Sustainability recognition",
    summary: "Recognition of participation in Cafe Show Seoul's eco-friendly Green Booth commitment.",
    alt: "Cafe Show Seoul 2019 Green Booth recognition for Sibu Coffee Exporter PLC",
    image: cafeShowGreenBooth,
  },
  {
    id: "rainforest-alliance-2021-2024",
    category: "Certifications",
    title: "Rainforest Alliance Certificate",
    issuer: "Ecocert",
    recipient: "Sibu Coffee Exporter PLC",
    year: "2021-2024",
    status: "Expired 15 April 2024",
    summary: "Historical Rainforest Alliance certification for Coffee Arabica under the 2017 Sustainable Agriculture Standard.",
    alt: "Historical Rainforest Alliance certificate for Sibu Coffee Exporter PLC",
    image: rainforestAllianceCertificate,
    placements: ["quality"],
  },
  {
    id: "oromia-award-trophy-2011",
    category: "Leadership",
    title: "Oromia Recognition Trophy",
    issuer: "Issuer shown on the physical award",
    recipient: "Sibu leadership archive",
    year: "2011",
    status: "Physical award",
    summary: "A physical trophy retained without asserting a matching certificate that has not been confirmed.",
    alt: "2011 Oromia recognition trophy displayed on a table",
    image: oromiaAwardTrophy,
  },
  {
    id: "oromia-tax-award-trophy-2017",
    category: "Leadership",
    title: "Tax Recognition Trophy",
    issuer: "Issuer shown on the physical award",
    recipient: "Sibu leadership archive",
    year: "2017",
    status: "Physical award",
    summary: "A physical tax-recognition trophy retained without asserting an unconfirmed certificate pairing.",
    alt: "2017 tax recognition trophy displayed on a table",
    image: oromiaTaxAwardTrophy,
  },
  {
    id: "hijra-bank-silver-award-2026",
    category: "Leadership",
    title: "Silver Level Award",
    issuer: "Hijra Bank",
    recipient: "Kedir Hasen Aredo",
    year: "2026",
    status: "Physical award",
    summary: "The physical award corresponding to the supplied Hijra Bank recognition certificate.",
    alt: "Hijra Bank Silver Level Award presented to Kedir Hasen Aredo in May 2026",
    image: hijraBankAward,
  },
  {
    id: "ministry-revenue-recognition-2025",
    category: "Company",
    title: "Tax Compliance Recognition",
    issuer: "Ministry of Revenue",
    recipient: "Sibu Trading PLC",
    year: "2025",
    status: "Company recognition",
    summary: "Recognition for tax compliance and timely payment during the stated fiscal year.",
    alt: "January 2025 Ministry of Revenue recognition certificate presented to Sibu Trading PLC",
    image: ministryRevenueRecognition,
    placements: ["home"],
  },
  {
    id: "gfoundation-appreciation-2025",
    category: "Partnerships",
    title: "Certificate of Appreciation",
    issuer: "GFOUNDATION",
    recipient: "Sibu Trading PLC",
    year: "2025",
    status: "Community partnership",
    summary: "Bilingual recognition of partnership and support for GFOUNDATION's coffee initiative.",
    alt: "Bilingual GFOUNDATION Certificate of Appreciation presented to Sibu Trading PLC",
    image: gfoundationAppreciation,
    placements: ["home"],
  },
  {
    id: "sibu-recognition-display",
    category: "Company",
    title: "Recognition Archive",
    issuer: "Sibu Trading PLC",
    recipient: "Company archive",
    year: "Archive",
    status: "Editorial photograph",
    summary: "A view of certificates, plaques and trophies preserved at Sibu Coffee Exporter PLC.",
    alt: "Sibu Coffee Exporter PLC recognition display with certificates, plaques and trophies",
    image: recognitionDisplay,
  },
  {
    id: "oromia-trade-industry-plaque-2014",
    category: "Company",
    title: "Trade and Industry Recognition Plaque",
    issuer: "Oromia Trade and Industry Bureau",
    recipient: "Sibu archive",
    year: "2014",
    status: "Physical recognition",
    summary: "The original inscription is preserved without adding an unverified English translation.",
    alt: "2014 Oromia trade and industry recognition plaque in a blue presentation case",
    image: oromiaTradeIndustryPlaque,
  },
];

export const homepageRecognition = recognitionItems.filter((item) => item.placements?.includes("home"));
export const qualityRecognition = recognitionItems.filter((item) => item.placements?.includes("quality"));
