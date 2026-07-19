import type { Metadata } from "next";
import Review from "@/components/flow/review";

export const metadata: Metadata = {
  title: "The record — uthot",
  description:
    "Review your answers and insights. A thinking instrument for founders.",
  openGraph: {
    title: "The record — uthot",
    description:
      "Review your answers and insights. A thinking instrument for founders.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The record — uthot",
      },
    ],
  },
  twitter: {
    title: "The record — uthot",
    description:
      "Review your answers and insights. A thinking instrument for founders.",
    images: ["/opengraph-image"],
  },
};

export default function ReviewPage() {
  return <Review />;
}
