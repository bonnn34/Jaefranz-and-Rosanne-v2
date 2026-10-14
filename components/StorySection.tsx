"use client"

import React from "react"
import localFont from "next/font/local"
import { Playfair_Display } from "next/font/google"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { sectionType, storyChapterTitleSize } from "@/lib/section-typography"
import Image from "next/image"
import { TornPaperEdge } from "./TornPaperEdge"
import { TintedDeco } from "@/components/tinted-deco"

const theSeasons = localFont({
  src: "../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

// Numbers (ghost numeral, "Chapter 01") are never set in The Seasons: they use
// Playfair Display italic, whose old-style figures read as a separate voice
const numeralFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  display: "swap",
})

// Faint corner sprigs inside each card, on the side opposite the ghost numeral
const CARD_CORNER_DECO = {
  left: "/deco/deco-new/left-top-corner.png",
  right: "/deco/deco-new/right-top-corner.png",
} as const

const lightBg = "var(--color-welcome-bg)"
const darkBg = "var(--color-welcome-green)"
const revealEase = [0.22, 1, 0.36, 1] as const

// Plain cards: every card is the light motif paper; inks from the sunrise
// palette (components/loader/sunrise-sky.css → --sr-*)
const CARD_TITLE = "var(--sr-maroon)"
const CARD_BODY = "color-mix(in srgb, var(--sr-navy) 88%, var(--sr-maroon))"

interface StorySectionProps {
  imageSrc?: string
  title?: string
  text: React.ReactNode
  layout: "image-left" | "image-right"
  theme: "dark" | "light"
  isFirst?: boolean
  isLast?: boolean
  plain?: boolean
  chapterIndex?: number
  // Word before the number on plain cards, e.g. "Chapter" → "Chapter 01"
  chapterLabelText?: string
}

// Plain card choreography: the card rises in, then its parts follow in order
// (label → title → divider → text → closing flourish); the ghost number drifts
// in from its side and the timeline dot pops.
function plainCardVariants(reduceMotion: boolean | null, fromLeft: boolean, delay: number) {
  const card: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay } } }
    : {
        hidden: { opacity: 0, y: 46, scale: 0.96, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.95,
            delay,
            ease: revealEase,
            when: "beforeChildren",
            staggerChildren: 0.12,
          },
        },
      }
  const item: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
      }
  const rule: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scaleX: 0 },
        visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: revealEase } },
      }
  const ghost: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: fromLeft ? 48 : -48, scale: 1.12 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.4, ease: revealEase } },
      }
  const dot: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { type: "spring", stiffness: 420, damping: 16 },
        },
      }
  const corner: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.9, rotate: fromLeft ? 4 : -4 },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: { duration: 1.6, ease: revealEase },
        },
      }
  return { card, item, rule, ghost, dot, corner }
}

function PlainChapterDivider({ variants, alignEnd }: { variants: Variants; alignEnd: boolean }) {
  const line = "color-mix(in srgb, var(--sr-brick) 45%, transparent)"
  return (
    <motion.div
      variants={variants}
      className={`mb-4 flex origin-center items-center justify-center gap-1.5 sm:mb-5 ${alignEnd ? "md:origin-right md:justify-end" : "md:origin-left md:justify-start"}`}
    >
      <span className="h-px w-8 sm:w-12" style={{ background: line }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ background: "var(--sr-amber)" }} aria-hidden />
      <span className="h-px w-8 sm:w-12" style={{ background: line }} />
    </motion.div>
  )
}

export const StorySection: React.FC<StorySectionProps> = ({
  imageSrc,
  title,
  text,
  layout,
  theme,
  isFirst = false,
  isLast = false,
  plain = false,
  chapterIndex = 0,
  chapterLabelText = "Chapter",
}) => {
  const isDark = theme === "dark"
  const showImage = !plain && Boolean(imageSrc)
  const reduceMotion = useReducedMotion()
  const slideFromLeft = layout === "image-left"

  const imageFrameStyle = isDark
    ? {
        background:
          "color-mix(in srgb, var(--color-welcome-bg-soft) 12%, var(--color-welcome-bg-soft))",
        boxShadow:
          "0 10px 28px color-mix(in srgb, var(--color-motif-accent) 35%, transparent)",
      }
    : {
        background: "var(--color-welcome-bg-soft)",
        border: "1px solid color-mix(in srgb, var(--color-motif-deep) 10%, transparent)",
        boxShadow:
          "0 8px 24px color-mix(in srgb, var(--color-motif-deep) 7%, transparent), inset 0 1px 0 color-mix(in srgb, white 70%, transparent)",
      }

  const rotation = layout === "image-left" ? "rotate-1 md:rotate-2" : "-rotate-1 md:-rotate-2"
  const flexDirection = layout === "image-left" ? "flex-row" : "flex-row-reverse"
  const plainAlign =
    layout === "image-left" ? "md:text-left md:items-start" : "md:text-right md:items-end"

  const chapterLabel = String(chapterIndex + 1).padStart(2, "0")
  const stagger = Math.min(chapterIndex * 0.07, 0.45)

  // Ghost numeral alternates sides chapter by chapter: right, left, right, ...
  const ghostOnRight = chapterIndex % 2 === 0
  const plainMotion = plainCardVariants(reduceMotion, !ghostOnRight, stagger)

  const imageInitial = reduceMotion
    ? { opacity: 1, scale: 1, y: 0 }
    : { opacity: 0, scale: 0.9, y: 24 }

  const textInitial = reduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 16 }

  const sectionSurfaceClass = plain
    ? `love-story-plain-track love-story-plain-track--theme-${theme}${isFirst ? " love-story-plain-track--first" : ""}${isLast ? " love-story-plain-track--last" : ""}`
    : ""

  return (
    <div
      className={`${theSeasons.variable} relative z-[2] ${sectionSurfaceClass}`}
      style={plain ? undefined : { background: isDark ? darkBg : lightBg }}
    >
      {!isDark && !plain && (
        <>
          {!isFirst && (
            <div className="pointer-events-none absolute left-0 top-0 z-20 -mt-[8px] w-full md:-mt-[20px]">
              <TornPaperEdge flipped={true} color={lightBg} />
            </div>
          )}
          <div className="pointer-events-none absolute bottom-0 left-0 z-20 -mb-[8px] w-full md:-mb-[20px]">
            <TornPaperEdge flipped={false} color={lightBg} />
          </div>
        </>
      )}

      <div
        className={`container relative z-10 mx-auto px-2 md:px-12 ${showImage ? "py-12 md:py-32" : "py-1.5 md:py-14"} ${isFirst ? (showImage ? "pt-16 md:pt-36" : "pt-14 md:pt-16") : ""} ${isLast ? (showImage ? "pb-16 md:pb-36" : "pb-6 md:pb-16") : ""}`}
      >
        <div
          className={
            showImage
              ? `flex ${flexDirection} items-center justify-between gap-3 md:gap-16`
              : `mx-auto flex max-w-2xl flex-col items-center px-2 text-center sm:px-4 ${plainAlign}`
          }
        >
          {showImage && imageSrc && (
            <div className="flex w-[45%] shrink-0 justify-center md:w-5/12">
              <motion.div
                className={`relative w-full md:max-w-md ${rotation}`}
                initial={imageInitial}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.95, delay: stagger, ease: revealEase }}
              >
                <div className="w-full p-1.5 md:p-3" style={imageFrameStyle}>
                  <div className="group relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt="Story moment"
                      fill
                      sizes="(max-width: 768px) 45vw, (max-width: 1024px) 40vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      quality={90}
                      priority={chapterIndex < 2}
                    />
                    {isDark && (
                      <div className="pointer-events-none absolute inset-0 z-10 bg-black/5 mix-blend-multiply" />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {plain ? (
            <motion.article
              className={`story-plain-card story-card w-full max-w-xl px-6 pb-8 pt-11 sm:px-9 sm:pb-10 sm:pt-12 md:px-10 md:pb-11 md:pt-14 ${ghostOnRight ? "story-card--ghost-right" : "story-card--ghost-left"}`}
              variants={plainMotion.card}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
            >
              {/* Large faint chapter number behind the content */}
              <span className="story-card__ghost-clip" aria-hidden>
                <motion.span
                  className={`${numeralFont.className} story-card__ghost`}
                  variants={plainMotion.ghost}
                >
                  {chapterLabel}
                </motion.span>
                <motion.span
                  className={`story-card__corner ${ghostOnRight ? "story-card__corner--left" : "story-card__corner--right"}`}
                  variants={plainMotion.corner}
                >
                  <TintedDeco src={ghostOnRight ? CARD_CORNER_DECO.left : CARD_CORNER_DECO.right} />
                </motion.span>
              </span>
              <motion.span className="story-plain-card__dot" variants={plainMotion.dot} aria-hidden />
              <div className="wedding-frame-inner hidden min-[400px]:block" aria-hidden />
              <div className={`relative z-[2] flex flex-col items-center text-center ${slideFromLeft ? "md:items-start md:text-left" : "md:items-end md:text-right"}`}>
                <motion.p
                  variants={plainMotion.item}
                  className={`${theSeasons.className} story-plain-chapter-label story-card__label mb-3 text-[0.6rem] font-medium uppercase sm:text-[0.66rem]`}
                >
                  {chapterLabelText}{" "}
                  <span className={`${numeralFont.className} story-card__label-num`}>{chapterLabel}</span>
                </motion.p>
                {title ? (
                  <motion.h2
                    variants={plainMotion.item}
                    className={`${theSeasons.className} mb-3 uppercase leading-tight tracking-[0.08em] sm:mb-4 sm:tracking-[0.1em] md:tracking-[0.11em]`}
                    style={{ fontSize: storyChapterTitleSize, color: CARD_TITLE }}
                  >
                    {title}
                  </motion.h2>
                ) : null}
                <PlainChapterDivider variants={plainMotion.rule} alignEnd={!slideFromLeft} />
                <motion.div
                  variants={plainMotion.item}
                  style={{ color: CARD_BODY }}
                  className={`story-card__text font-goudy-italic space-y-3 sm:space-y-4 md:space-y-5 lg:leading-[1.75] ${sectionType.textRelaxed}`}
                >
                  {text}
                </motion.div>
                <motion.div
                  variants={plainMotion.rule}
                  className="story-plain-chapter-line story-card__end mt-7 sm:mt-8"
                  aria-hidden
                />
              </div>
              {!isLast && (
                <div className="story-plain-chapter-connector" aria-hidden>
                  <span className="story-plain-chapter-connector__stem" />
                </div>
              )}
            </motion.article>
          ) : (
            <motion.div
              className={
                showImage
                  ? "w-[55%] @container/story md:w-5/12"
                  : "w-full @container/story px-2 sm:px-4"
              }
              style={{ color: isDark ? lightBg : "var(--color-welcome-text)" }}
              initial={textInitial}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.85, delay: stagger + 0.15, ease: revealEase }}
            >
              {title && (
                <h2
                  className={`${theSeasons.className} mb-3 uppercase leading-tight tracking-[0.08em] sm:mb-4 sm:tracking-[0.1em] md:mb-6 md:tracking-[0.12em]`}
                  style={{
                    fontSize: storyChapterTitleSize,
                    color: isDark ? lightBg : "var(--color-welcome-navy)",
                  }}
                >
                  {title}
                </h2>
              )}
              <div
                className={`font-goudy-italic space-y-3 sm:space-y-4 md:space-y-6 lg:leading-[1.7] ${sectionType.textRelaxed}`}
              >
                {text}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
