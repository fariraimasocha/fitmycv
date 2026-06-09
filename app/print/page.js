"use client";

import { useEffect, useState } from "react";
import { ResumeTemplate } from "@/components/ResumePreview";
import { PRINT_KEY_PREFIX } from "@/utils/print-document";

const PRINT_CSS = `
.print-root { background: #fff; color: #000; }
.print-page, .print-page * {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
@media screen {
  body { background: #f3f4f6; }
  .print-page {
    width: 210mm;
    max-width: 100%;
    min-height: 297mm;
    margin: 24px auto;
    background: #fff;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  }
}
@media print {
  /* margin:0 removes the browser's auto header/footer (page title, date, URL).
     Page margins are applied as padding on the content instead. */
  @page { size: A4; margin: 0; }
  html, body { margin: 0 !important; background: #fff !important; }
  .no-print { display: none !important; }
  [data-resume-template] { padding: 14mm !important; }
}
`;

function CoverLetterPrint({ content, meta = {} }) {
  const subtitle = [meta.jobTitle, meta.jobCompany].filter(Boolean).join(" at ");
  return (
    <div data-resume-template="cover-letter" className="p-5 text-black sm:p-8">
      {meta.name && <h1 className="text-center text-xl font-bold">{meta.name}</h1>}
      {subtitle && <p className="mt-1 text-center text-sm text-gray-600">{subtitle}</p>}
      {(meta.name || subtitle) && <hr className="my-4 border-black" />}
      <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}

export default function PrintPage() {
  const [state, setState] = useState({ status: "loading", payload: null });
  const { status, payload } = state;

  // Read the one-time handoff payload from localStorage after mount, then clear
  // it. Done in an effect (not a lazy initializer) so the server render and the
  // first client render agree ("loading") and there's no hydration mismatch.
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("k");
    const key = token ? PRINT_KEY_PREFIX + token : null;
    const raw = key ? window.localStorage.getItem(key) : null;
    if (key && raw) window.localStorage.removeItem(key);

    let parsed = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the localStorage handoff on mount; the effect is what keeps SSR/hydration in sync
    setState(
      parsed
        ? { status: "ready", payload: parsed }
        : { status: "empty", payload: null },
    );
  }, []);

  // Once rendered and fonts are loaded, open the print dialog; close when done.
  useEffect(() => {
    if (status !== "ready" || !payload) return;

    const prevTitle = document.title;
    document.title = (payload.filename || "Document.pdf").replace(/\.pdf$/i, "");

    let cancelled = false;
    let raf1;
    let raf2;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      if (cancelled) return;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          if (!cancelled) window.print();
        });
      });
    });

    const handleAfterPrint = () => {
      document.title = prevTitle;
      window.close();
    };
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      cancelled = true;
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      window.removeEventListener("afterprint", handleAfterPrint);
      document.title = prevTitle;
    };
  }, [status, payload]);

  if (status === "loading") return null;

  if (status === "empty" || !payload) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-gray-600">Nothing to print, or the link expired.</p>
        <button
          onClick={() => window.close()}
          className="rounded-full border px-4 py-2 text-sm"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="print-root">
      <style>{PRINT_CSS}</style>
      <div className="no-print fixed right-4 top-4 z-50 flex gap-2">
        <button
          onClick={() => window.print()}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow"
        >
          Save as PDF
        </button>
        <button
          onClick={() => window.close()}
          className="rounded-full border bg-white px-4 py-2 text-sm shadow"
        >
          Close
        </button>
      </div>
      <div className="print-page">
        {payload.kind === "cover-letter" ? (
          <CoverLetterPrint content={payload.content} meta={payload.meta} />
        ) : (
          <ResumeTemplate data={payload.data} template={payload.template} />
        )}
      </div>
    </div>
  );
}
