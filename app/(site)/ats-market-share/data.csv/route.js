import study from "@/data/ats-study-sp500.json";
import { getAtsVendor } from "@/lib/ats-detect";

export const dynamic = "force-static";

const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export function GET() {
  const rows = [
    ["ticker", "company", "sector", "ats", "evidence_url", "checked_on"],
    ...study.companies.map((c) => [
      c.ticker,
      c.name,
      c.sector,
      c.ats ? getAtsVendor(c.ats).name : "",
      c.evidenceUrl ?? "",
      study.checkedOn,
    ]),
  ];
  return new Response(rows.map((r) => r.map(cell).join(",")).join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="fitmycv-ats-sp500.csv"',
    },
  });
}
