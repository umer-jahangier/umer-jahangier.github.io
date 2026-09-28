import { Bricolage_Grotesque } from "next/font/google";
import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Shantell_Sans } from "next/font/google";

export const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: "variable", axes: ["opsz", "wdth"], display: "swap" });
export const geist = Geist({ variable: "--font-geist", subsets: ["latin"], weight: "variable", display: "swap" });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
export const shantell = Shantell_Sans({ variable: "--font-shantell", subsets: ["latin"], weight: "variable", display: "swap" });
