import type { Metadata } from "next";
import Flow from "@/components/flow/flow";

export const metadata: Metadata = {
  title: "The gates — noai",
};

export default function ReflectPage() {
  return <Flow />;
}
