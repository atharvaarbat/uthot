import type { Metadata } from "next";
import Review from "@/components/flow/review";

export const metadata: Metadata = {
  title: "The record — noai",
};

export default function ReviewPage() {
  return <Review />;
}
