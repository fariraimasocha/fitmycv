"use client";

import { FileX, Clock4, ShieldX, MailX, Target, BatteryLow, X } from "lucide-react";

export default function PainPoints() {
  return (
    <section className="bg-white px-5 py-16 sm:px-10 lg:px-[100px] lg:py-[100px]">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <h2
            className="text-[#0F172A] text-[32px] sm:text-[40px]"
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 700,
              letterSpacing: "-1.6px",
              lineHeight: 1.15,
            }}
          >
            Sending the same CV
            <br />
            to every job?
          </h2>
          <p
            className="text-[#64748B]"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Most candidates blast out identical applications and wonder why they
            never hear back. Here&apos;s what&apos;s going wrong.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="flex flex-col w-full" style={{ gap: 16 }}>
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row w-full" style={{ gap: 16 }}>
            {/* Card 1 — dark, CV stack visual */}
            <div
              className="flex-1 flex flex-col relative overflow-hidden"
              style={{ background: "#111827", borderRadius: 20, padding: 32, gap: 14, minHeight: 280 }}
            >
              {/* Content — normal flow */}
              <div className="flex flex-col relative z-10" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    background: "#1F2937",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  <FileX size={22} color="#9CA3AF" />
                </div>
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 28,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Generic CVs
                  <br />
                  get ignored
                </h3>
                <p
                  className="text-[#9CA3AF]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: 320,
                  }}
                >
                  Recruiters scan for keyword matches. A one-size-fits-all CV
                  rarely hits the mark — it gets 6 seconds of attention before
                  the next candidate.
                </p>
              </div>

              {/* CV Stack Visual — hidden on small screens */}
              <div
                className="hidden sm:block absolute"
                style={{ right: 0, top: 40, width: 380, height: 240 }}
              >
                <div
                  style={{
                    position: "absolute",
                    background: "#374151",
                    width: 180,
                    height: 220,
                    borderRadius: 10,
                    border: "1px solid #4B5563",
                    left: 0,
                    top: 20,
                    transform: "rotate(-3deg)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    background: "#374151",
                    width: 180,
                    height: 220,
                    borderRadius: 10,
                    border: "1px solid #4B5563",
                    left: 60,
                    top: 10,
                    transform: "rotate(1deg)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    background: "#374151",
                    width: 180,
                    height: 220,
                    borderRadius: 10,
                    border: "1px solid #4B5563",
                    left: 120,
                    top: 0,
                    transform: "rotate(4deg)",
                  }}
                />
                {/* Rejected badge */}
                <div
                  className="absolute flex flex-row items-center"
                  style={{
                    right: 0,
                    bottom: 10,
                    background: "#EF4444",
                    borderRadius: 9999,
                    gap: 6,
                    padding: "6px 14px",
                  }}
                >
                  <X size={12} color="white" />
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "var(--font-sn-pro)",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Rejected
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 — light gray */}
            <div
              className="flex-1 flex flex-col justify-between"
              style={{
                background: "#F3F4F6",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #E5E7EB",
              }}
            >
              <div className="flex flex-col" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    background: "#E5E7EB",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  <Clock4 size={22} color="#111827" />
                </div>
                <h3
                  className="text-[#0F172A]"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Hours wasted
                  <br />
                  per application
                </h3>
                <p
                  className="text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Manually tweaking CVs and writing cover letters eats your
                  entire evening.
                </p>
              </div>
              <div className="flex items-end" style={{ gap: 8 }}>
                <span
                  className="text-[#111827]"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 40,
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  3.5h
                </span>
                <span
                  className="text-[#94A3B8]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 13,
                    fontWeight: 500,
                    paddingBottom: 4,
                  }}
                >
                  avg. per application
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row w-full" style={{ gap: 16 }}>
            {/* Card 3 — ATS progress bar */}
            <div
              className="flex-1 flex flex-col"
              style={{
                background: "#F3F4F6",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #E5E7EB",
                gap: 20,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  background: "#E5E7EB",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  flexShrink: 0,
                }}
              >
                <ShieldX size={22} color="#111827" />
              </div>
              <h3
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                }}
              >
                ATS filters
                <br />
                you out
              </h3>
              <p
                className="text-[#64748B]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Automated tracking systems reject 75% of CVs before a human
                ever reads them.
              </p>
              {/* Progress bar */}
              <div className="flex flex-col w-full" style={{ gap: 8 }}>
                <div className="flex flex-row items-center justify-between">
                  <span
                    className="text-[#94A3B8]"
                    style={{
                      fontFamily: "var(--font-sn-pro)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Rejection rate
                  </span>
                  <span
                    className="text-[#EF4444]"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    75%
                  </span>
                </div>
                <div
                  className="w-full overflow-hidden"
                  style={{ background: "#E5E7EB", height: 8, borderRadius: 4 }}
                >
                  <div
                    style={{
                      background: "#EF4444",
                      height: 8,
                      borderRadius: 4,
                      width: "75%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Card 4 — inbox visual */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{
                background: "#FAFAFA",
                borderRadius: 20,
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Content — normal flow */}
              <div className="flex flex-col" style={{ padding: 32, gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    background: "#E5E7EB",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  <MailX size={22} color="#111827" />
                </div>
                <h3
                  className="text-[#0F172A]"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  No feedback,
                  <br />
                  no replies
                </h3>
                <p
                  className="text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  You apply and hear nothing. Was it your CV? Your experience?
                  You never know.
                </p>
              </div>

              {/* Inbox Visual — only shown on larger screens */}
              <div
                className="hidden lg:flex absolute flex-col"
                style={{ left: 400, top: 24, width: 340, gap: 10 }}
              >
                {[
                  { text: "Application received — Acme Corp", muted: false },
                  { text: "Application received — TechStart", muted: false },
                  { text: "Application received — DataFlow", muted: true },
                  { text: "Application received — Nexus AI", muted: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-row items-center"
                    style={{
                      background: "white",
                      borderRadius: 10,
                      gap: 12,
                      padding: "12px 16px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#D1D5DB",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-sn-pro)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: item.muted ? "#94A3B8" : "#64748B",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
                <span
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#94A3B8",
                    fontStyle: "italic",
                  }}
                >
                  No replies in 30+ days...
                </span>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row w-full" style={{ gap: 16 }}>
            {/* Card 5 — keyword tags */}
            <div
              className="flex-1 flex flex-col"
              style={{
                background: "#F3F4F6",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #E5E7EB",
                gap: 16,
              }}
            >
              <div className="flex flex-col" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    background: "#E5E7EB",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  <Target size={22} color="#111827" />
                </div>
                <h3
                  className="text-[#0F172A]"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Wrong keywords, wrong role
                </h3>
                <p
                  className="text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Each job description has unique requirements. Your CV needs to
                  mirror them.
                </p>
              </div>
              {/* Keyword tags */}
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {[
                  { label: "React", red: false },
                  { label: "Python", red: false },
                  { label: "Java ✕", red: true },
                  { label: "SQL ✕", red: true },
                ].map(({ label, red }) => (
                  <span
                    key={label}
                    style={{
                      fontFamily: "var(--font-sn-pro)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: red ? "#EF4444" : "#94A3B8",
                      background: red ? "#FEE2E2" : "white",
                      border: `1px solid ${red ? "#FECACA" : "#E5E7EB"}`,
                      borderRadius: 9999,
                      padding: "6px 12px",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 6 — burnout, dark */}
            <div
              className="flex-1 flex flex-col justify-between"
              style={{
                background: "#111827",
                borderRadius: 20,
                padding: 32,
                gap: 16,
              }}
            >
              <div className="flex flex-col" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    background: "#1F2937",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  <BatteryLow size={22} color="#9CA3AF" />
                </div>
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Application burnout
                  <br />
                  is real
                </h3>
                <p
                  className="text-[#9CA3AF]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  After 50+ rejections, motivation tanks. The process
                  shouldn&apos;t feel this painful.
                </p>
              </div>
              <div className="flex items-end" style={{ gap: 8 }}>
                <span
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 36,
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  50+
                </span>
                <span
                  className="text-[#6B7280]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontSize: 13,
                    fontWeight: 500,
                    paddingBottom: 4,
                  }}
                >
                  applications before burnout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
