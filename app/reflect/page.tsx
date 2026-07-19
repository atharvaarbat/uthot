import type { Metadata } from "next";
import Flow from "@/components/flow/flow";

export const metadata: Metadata = {
  title: "The gates — uthot",
  description:
    "Work through thirty-five questions designed to clarify your thinking. A thinking instrument for founders.",
  openGraph: {
    title: "The gates — uthot",
    description:
      "Work through thirty-five questions designed to clarify your thinking. A thinking instrument for founders.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The gates — uthot",
      },
    ],
  },
  twitter: {
    title: "The gates — uthot",
    description:
      "Work through thirty-five questions designed to clarify your thinking. A thinking instrument for founders.",
    images: ["/opengraph-image"],
  },
};

export default function ReflectPage() {
  return <Flow />;
}
