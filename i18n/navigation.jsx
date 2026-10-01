import NextLink from "next/link";
import { createNavigation } from "next-intl/navigation";
import { routing, UNTRANSLATED } from "./routing";

const intl = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = intl;

// Adds the /fr, /es or /de prefix only for pages that exist in that language.
// The blog, jobs and dashboard stay English, so they keep a plain link.
export function Link({ href, ...props }) {
  const path = typeof href === "string" ? href : href?.pathname ?? "";
  if (UNTRANSLATED.test(path.split(/[?#]/)[0]) || /^https?:/.test(path)) {
    return <NextLink href={href} {...props} />;
  }
  return <intl.Link href={href} {...props} />;
}
