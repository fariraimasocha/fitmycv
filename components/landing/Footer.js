import Link from "next/link";
import { FileText } from "lucide-react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const otherApps = [
  { label: "LinkGenie", href: "https://linkgenie.one" },
  { label: "WaitFast", href: "https://waitfast.one" },
  { label: "LaunchMe", href: "https://launchme.site" },
  { label: "LearnHowToPrompt", href: "https://learnhowtoprompt.one" },
];

export default function Footer() {
  return (
    <footer
      className="bg-[#F8FAFC] border-t border-[#E2E8F0]"
      style={{ padding: "48px 140px" }}
    >
      <div className="flex flex-col" style={{ gap: 48 }}>
        {/* Top row */}
        <div
          className="flex flex-row justify-between w-full"
          style={{ gap: 48 }}
        >
          {/* Brand col */}
          <div
            className="flex flex-col"
            style={{ width: 280, gap: 16 }}
          >
            <div className="flex flex-row items-center" style={{ gap: 10 }}>
              {/* Logo mark */}
              <div
                className="flex items-center justify-center"
                style={{
                  background: "#111827",
                  width: 24,
                  height: 24,
                  borderRadius: 5,
                  flexShrink: 0,
                }}
              >
                <FileText size={12} color="white" />
              </div>
              <span
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                FitMyCv
              </span>
            </div>
            <p
              className="text-[#64748B]"
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: 260,
              }}
            >
              AI-powered CV tailoring. Land more interviews with less effort.
            </p>
          </div>

          {/* Links col */}
          <div className="flex flex-col" style={{ gap: 16 }}>
            <h4
              className="text-[#0F172A]"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Links
            </h4>
            <ul className="flex flex-col" style={{ gap: 12 }}>
              {footerLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                    style={{
                      fontFamily: "var(--font-sn-pro)",
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Apps col */}
          <div className="flex flex-col" style={{ gap: 16 }}>
            <h4
              className="text-[#0F172A]"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Other Apps
            </h4>
            <ul className="flex flex-col" style={{ gap: 12 }}>
              {otherApps.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                    style={{
                      fontFamily: "var(--font-sn-pro)",
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-row justify-between items-center w-full border-t border-[#E2E8F0]"
          style={{ paddingTop: 24 }}
        >
          <p
            className="text-[#94A3B8]"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontSize: 13,
              fontWeight: 400,
            }}
          >
            2025 FitMyCv. All rights reserved.
          </p>
          <div className="flex flex-row" style={{ gap: 24 }}>
            {otherApps.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94A3B8] hover:text-[#64748B] transition-colors"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 13,
                  fontWeight: 400,
                }}
              >
                {href.replace("https://", "")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
