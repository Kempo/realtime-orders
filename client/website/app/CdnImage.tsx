"use client";

import Image, { ImageProps } from "next/image";
import cloudfrontLoader from "../loader";

// Wraps next/image with our CloudFront loader. Lives in a client component
// because a loader function cannot be passed from a Server Component.
export default function CdnImage(props: ImageProps) {
  return <Image loader={cloudfrontLoader} {...props} />;
}
