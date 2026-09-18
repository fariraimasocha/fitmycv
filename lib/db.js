import { connectDB } from "@/utils/connect";

// Single source of truth for connection handling lives in utils/connect.js
// (request-context aware for Cloudflare Workers).
export default async function dbConnect() {
  return connectDB();
}
