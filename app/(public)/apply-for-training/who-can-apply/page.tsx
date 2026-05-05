import type { Metadata } from "next";

import { TrainingWhoCanApplyPage } from "@/components/training/training-who-can-apply-page";

export const metadata: Metadata = {
  title: "Who Can Apply | IT For Youth Ghana",
  description:
    "See who IT For Youth Ghana training programmes are designed for and how to judge your fit before applying.",
};

export default function WhoCanApplyPage() {
  return <TrainingWhoCanApplyPage />;
}
