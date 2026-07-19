import type { Metadata } from "next";
import Flow from "@/components/flow/flow";

export const metadata: Metadata = {
  title: "The gates — uthot",
};

export default function ReflectPage() {
  return <Flow />;
}
