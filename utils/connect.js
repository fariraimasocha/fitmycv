import mongoose from "mongoose";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// On Cloudflare Workers, a socket created during one request is canceled by
// the runtime when that request ends — it can never be reused by another
// request ("Cannot perform I/O on behalf of a different request", hung-worker
// kills, "Connection was force closed"). Closing the stale connection is also
// impossible (that would be I/O on the dead socket).
//
// So on workerd we never call mongoose.connect(). Per incoming request we:
//   1. connect a brand-new MongoClient (owned by the current request),
//   2. reset the default connection's bookkeeping (no socket I/O), and
//   3. re-point the default connection at the new client via setClient().
// The abandoned client's socket was already canceled by the runtime, so
// nothing leaks. Outside workerd (node dev / next build) we keep the classic
// cached mongoose.connect() — including the readyState check that guards
// against dead sockets after laptop sleep ("ReplicaSetNoPrimary").

let ownerCtx = null;
let connectPromise = null;

function currentRequestCtx() {
  try {
    return getCloudflareContext().ctx ?? null;
  } catch {
    return null;
  }
}

async function connectWithFreshClient(uri) {
  // Use mongoose's own mongodb driver module — the bundle can contain two
  // copies of "mongodb", and setClient() rejects a client made from the
  // other copy (instanceof check).
  const client = await new mongoose.mongo.MongoClient(uri).connect();
  const conn = mongoose.connection;
  conn.readyState = 0; // abandon the dead socket's bookkeeping — no I/O
  conn.setClient(client);
  return conn;
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  const ctx = currentRequestCtx();

  if (ctx === null) {
    // node (dev / build): classic cached connection.
    // readyState: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting.
    const state = mongoose.connection.readyState;
    if (state === 1) return mongoose.connection;
    if (state !== 2) connectPromise = null; // dead socket — redial
    if (!connectPromise) {
      connectPromise = mongoose.connect(MONGODB_URI).then((m) => m.connection);
    }
    try {
      return await connectPromise;
    } catch (err) {
      connectPromise = null;
      throw err;
    }
  }

  // Same request: reuse its connection (multiple queries per request).
  if (ctx === ownerCtx && connectPromise) {
    return connectPromise;
  }

  ownerCtx = ctx;
  const promise = connectWithFreshClient(MONGODB_URI).catch((err) => {
    if (connectPromise === promise) {
      connectPromise = null;
      ownerCtx = null;
    }
    throw err;
  });
  connectPromise = promise;
  return promise;
}
