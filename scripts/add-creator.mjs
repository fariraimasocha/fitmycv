// Add a UGC creator and print their share link and private stats link.
//
// Run:
//   npm run add-creator -- <code> "<Name>"
//   e.g. npm run add-creator -- tariro "Tariro M"
//
// Collection and fields must match models/Creator.js.

import crypto from "node:crypto";
import mongoose from "mongoose";

const SITE_URL = "https://www.fitmycv.link";
const [rawCode, name] = process.argv.slice(2);
const code = String(rawCode ?? "").trim().toLowerCase();

if (!/^[a-z0-9_-]{2,32}$/.test(code) || !name) {
  console.error('Usage: npm run add-creator -- <code> "<Name>"  (code: 2 to 32 of a-z, 0-9, _ or -)');
  process.exit(1);
}
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set. Run with: node --env-file=.env");

await mongoose.connect(process.env.MONGODB_URI);
const creators = mongoose.connection.collection("creators");
await creators.createIndex({ code: 1 }, { unique: true });
await creators.createIndex({ statsToken: 1 }, { unique: true });

let doc = await creators.findOne({ code });
if (doc) {
  console.log(`"${code}" already exists, here are its links.`);
} else {
  const now = new Date();
  doc = { code, name, statsToken: crypto.randomBytes(16).toString("hex"), clicks: 0, visitors: 0, createdAt: now, updatedAt: now };
  await creators.insertOne(doc);
}

console.log(`Share link:  ${SITE_URL}/r/${doc.code}`);
console.log(`Stats link:  ${SITE_URL}/creator/${doc.statsToken}  (keep private)`);
await mongoose.disconnect();
