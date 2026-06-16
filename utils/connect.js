import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { promise: null };
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  // readyState: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting.
  // Reuse only a live connection. After a laptop sleep / network change the
  // cached socket dies (state 0) — the old code returned it anyway, which is
  // what caused the "ReplicaSetNoPrimary" 500 on save.
  const state = mongoose.connection.readyState;
  if (state === 1) {
    return mongoose.connection;
  }

  // Dead/disconnecting (0 or 3) — drop the stale promise so we redial.
  // State 2 (connecting) keeps the in-flight promise.
  if (state !== 2) {
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    await cached.promise;
  } catch (err) {
    cached.promise = null; // don't cache a rejected connect — let the next call retry
    throw err;
  }

  return mongoose.connection;
}
