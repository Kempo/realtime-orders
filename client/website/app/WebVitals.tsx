"use client";

import { useReportWebVitals } from "next/web-vitals";
import { sendGAEvent } from "@next/third-parties/google";

export default function WebVitals() {
  useReportWebVitals(({ id, name, label, value }) => {
    sendGAEvent("event", name, {
      event_category:
        label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
      // values must be integers
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id, // id unique to current page load
      non_interaction: true, // avoids affecting bounce rate.
    });
  });

  return null;
}
