import { MongoClient } from "mongodb";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Request-context aware MongoClient for the Auth.js adapter. On Cloudflare
// Workers a connection created during one request cannot be used by another,
// so reconnect whenever a different request lands on a warm isolate. Outside
// workerd (node dev, next build) ctx is null and the client is simply cached.

let ownerCtx = null;
let clientPromise = null;

function currentRequestCtx() {
  try {
    return getCloudflareContext().ctx ?? null;
  } catch {
    return null;
  }
}

export default function getMongoClient() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return Promise.reject(new Error("Missing MONGODB_URI for auth adapter"));
  }

  const ctx = currentRequestCtx();
  if (clientPromise && (ctx === null || ctx === ownerCtx)) {
    return clientPromise;
  }

  ownerCtx = ctx;

  // Close the previous request's client in the background; never block on it.
  const previous = clientPromise;
  if (previous) {
    previous.then((client) => client.close(true)).catch(() => {});
  }

  const promise = new MongoClient(uri).connect().catch((err) => {
    // Don't cache a failed connect (unless it was already replaced).
    if (clientPromise === promise) {
      clientPromise = null;
      ownerCtx = null;
    }
    throw err;
  });
  clientPromise = promise;
  return promise;
}
