import TailoredCV from "@/models/TailoredCV";
import CompanyResearch from "@/models/CompanyResearch";
import ReferenceCV from "@/models/ReferenceCV";
import Application from "@/models/Application";

// Shared by the API routes and the server-rendered dashboard, so the data a
// page is seeded with is exactly what the client would fetch. Call
// connectDB() first.

export async function listTailoredCVs(userId) {
  const cvs = await TailoredCV.find({ userId })
    .sort({ createdAt: -1 })
    .select("jobTitle jobCompany jobUrl createdAt coverLetter")
    .lean();
  return cvs.map(({ coverLetter, ...cv }) => ({
    ...cv,
    hasCoverLetter: Boolean(coverLetter && String(coverLetter).trim()),
  }));
}

export function listCompanyResearch(userId) {
  return CompanyResearch.find({ userId })
    .sort({ createdAt: -1 })
    .select("companyName jobTitle jobUrl createdAt summary fundingStage teamSize")
    .lean();
}

export function getReferenceCV(userId) {
  return ReferenceCV.findOne({ userId }).lean();
}

export function listApplications(userId, { status, archived } = {}) {
  const query = { userId };
  // "all" lets the tracker filter archived rows on the client. Rows created
  // before archiving existed have no flag, hence $ne.
  if (archived === "true") query.archived = true;
  else if (archived !== "all") query.archived = { $ne: true };
  if (status && status !== "all") query.status = status;
  return Application.find(query).sort({ createdAt: -1 }).lean();
}
