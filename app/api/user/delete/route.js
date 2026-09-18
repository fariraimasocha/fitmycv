import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import ReferenceCV from "@/models/ReferenceCV";
import TailoredCV from "@/models/TailoredCV";
import Application from "@/models/Application";
import CompanyResearch from "@/models/CompanyResearch";
import StoryBank from "@/models/StoryBank";
import InterviewPrep from "@/models/InterviewPrep";
import JobDigestItem from "@/models/JobDigestItem";
import Feedback from "@/models/Feedback";
import Lead from "@/models/Lead";
import getMongoClient from "@/lib/mongodb-client";

export async function DELETE(request) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const confirmation = String(body?.confirmation ?? "").trim();
  const email = String(session.user.email).trim().toLowerCase();
  const expected = email;

  // Require typing the exact email to confirm. Also allow "DELETE" for tests
  // but the UI will ask for email.
  const isConfirmed =
    confirmation.toLowerCase() === expected || confirmation === "DELETE";

  if (!isConfirmed) {
    return NextResponse.json(
      { error: `Type your email (${session.user.email}) to confirm.` },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  try {
    await connectDB();

    // Delete app data in parallel. Each delete is idempotent.
    const objectId = userId; // mongoose will cast string to ObjectId

    await Promise.all([
      ReferenceCV.deleteOne({ userId: objectId }),
      TailoredCV.deleteMany({ userId: objectId }),
      Application.deleteMany({ userId: objectId }),
      CompanyResearch.deleteMany({ userId: objectId }),
      StoryBank.deleteOne({ userId: objectId }),
      InterviewPrep.deleteMany({ userId: objectId }),
      JobDigestItem.deleteMany({ userId: objectId }),
      Feedback.deleteMany({ userId: objectId }),
      Lead.deleteMany({ email }),
    ]);

    // Auth.js adapter collections – accounts, sessions, verificationTokens live
    // in the same MongoDB database but are not Mongoose models.
    try {
      const client = await getMongoClient();
      const db = client.db();
      const userIdForAdapter = session.user.id;

      // accounts and sessions use userId as ObjectId or string – try both
      const { ObjectId } = await import("mongodb");
      let oid = null;
      try {
        oid = new ObjectId(userIdForAdapter);
      } catch {
        oid = null;
      }
      const userIdFilter = oid ? { $in: [userIdForAdapter, oid] } : userIdForAdapter;

      await Promise.all([
        db.collection("accounts").deleteMany({ userId: userIdFilter }),
        db.collection("sessions").deleteMany({ userId: userIdFilter }),
        // verification tokens are keyed by identifier (email), not userId
        db.collection("verificationTokens").deleteMany({ identifier: email }),
        db.collection("verificationTokens").deleteMany({ identifier: session.user.email }),
      ]);
    } catch (adapterError) {
      // Non-fatal – user doc is the source of truth, adapter cleanup is best-effort
      console.error("Adapter cleanup failed (non-fatal):", adapterError);
    }

    // Finally delete the user doc itself. This must be last so the
    // `authorized` callback still sees a user until the very end.
    await User.deleteOne({ _id: objectId });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Could not delete your account. Try again or contact support." },
      { status: 500 }
    );
  }
}
