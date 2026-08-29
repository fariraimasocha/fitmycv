"use client";

import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@phosphor-icons/react";

import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardPin,
  CutoutCorner,
} from "@/components/ui/cutout-card";

const SURFACE = "text-[var(--landing-paper-soft)]";

export default function BlogCard({ post, priority = false }) {
  const { slug, title, excerpt, image, imageAlt, category, readingTime } = post;

  return (
    <CutoutCard className="flex h-full flex-col">
      <Link href={`/blog/${slug}`} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-paper-soft)]">
        <CutoutCardMedia className="relative aspect-3/2 w-full bg-[var(--landing-paper-strong)]">
          <CutoutCardImage src={image} alt={imageAlt} priority={priority} />

          {/* Category pin — top-right. The two corners flare the surface out of
              the pin's left and bottom edges so it reads as a notch punched
              into the image, not a chip sitting on top of it. `rounded-tr`
              matches the card radius so the pin isn't clipped by it. */}
          <CutoutCardPin className="right-0 top-0 rounded-tr-[28px] rounded-bl-[20px] bg-[var(--landing-paper-soft)] pb-2.5 pl-3.5 pr-5 pt-3">
            <span className="block rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-2.5 py-0.5 font-sans text-xs font-semibold text-[var(--landing-ink)]">
              {category}
            </span>
            <CutoutCorner
              className={`absolute right-full top-0 -scale-y-100 ${SURFACE}`}
            />
            <CutoutCorner
              className={`absolute right-0 top-full -scale-y-100 ${SURFACE}`}
            />
          </CutoutCardPin>

          {/* Reading time — bottom-left, notched into the media edge. The clock
              and label sit in their own pill inside the notch; without the
              surrounding padding the icon collides with the card border. */}
          <CutoutCardInsetLabel className="bottom-0 left-0 rounded-tr-[20px] bg-[var(--landing-paper-soft)] pl-4 pr-4 pt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-strong)] px-2.5 py-1">
              <ClockIcon
                size={12}
                weight="bold"
                aria-hidden="true"
                className="text-[var(--landing-primary-dark)]"
              />
              <span className="font-sans text-xs font-medium text-[var(--landing-ink)]">
                {readingTime} min read
              </span>
            </span>
            <CutoutCorner
              className={`absolute bottom-0 left-full -scale-x-100 ${SURFACE}`}
            />
            <CutoutCorner
              className={`absolute bottom-full left-0 -scale-x-100 ${SURFACE}`}
            />
          </CutoutCardInsetLabel>
        </CutoutCardMedia>

        <CutoutCardContent className="flex flex-1 flex-col gap-3 p-6 pb-5">
          <h3 className="font-outfit text-lg font-extrabold leading-snug text-[var(--landing-ink)]">
            {title}
          </h3>
          <p className="text-sm leading-7 text-[var(--landing-ink-soft)]">
            {excerpt}
          </p>
        </CutoutCardContent>

        <CutoutCardFooter className="relative h-14 border-t border-[var(--landing-line)] px-6">
          <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)]">
            Read article
          </span>
          <CutoutCardAction className="right-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--landing-primary-dark)] text-[oklch(0.99_0.006_84)]">
              <ArrowRightIcon size={15} weight="bold" aria-hidden="true" />
            </span>
          </CutoutCardAction>
        </CutoutCardFooter>
      </Link>
    </CutoutCard>
  );
}
