import { Cairo } from "next/font/google";

// Trying Cairo site-wide in place of Inter/Tajawal — kept the same export
// names and CSS variables so nothing downstream needs to change if this
// gets reverted.
export const inter = Cairo({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const tajawal = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-tajawal",
});
