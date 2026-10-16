import { Archivo } from "next/font/google";

// One family; the width axis carries the voice (expanded caps for campaign
// headlines, normal width for reading).
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});
