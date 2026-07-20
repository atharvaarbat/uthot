import type { Metadata } from "next";
import Story from "@/components/flow/story";

export const metadata: Metadata = {
  title: "The story — uthot",
  description:
    "Why the seven gates exist — a thinking instrument born from the cycle of excitement and rejection that every founder knows.",
  openGraph: {
    title: "The story — uthot",
    description:
      "Why the seven gates exist — a thinking instrument born from the cycle of excitement and rejection that every founder knows.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "The story — uthot",
      },
    ],
  },
  twitter: {
    title: "The story — uthot",
    description:
      "Why the seven gates exist — a thinking instrument born from the cycle of excitement and rejection that every founder knows.",
    images: ["/og.png"],
  },
};

export default function StoryPage() {
  return <Story />;
}
