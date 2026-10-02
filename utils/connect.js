import mongoose from "mongoose";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// On Cloudflare Workers, a socket created during one request is canceled by
// the runtime when that request ends, and no other request may touch it
// ("Cannot perform I/O on behalf of a different request"). One isolate also
// serves several requests at once.
//
// So on workerd every request gets its own MongoClient and its own mongoose
// Connection, keyed by the request's ExecutionContext. Models are compiled on
// that connection, and the default exports in models/* look up the current
// request's model on each use (see defineModel). Earlier this re-pointed the
// one global mongoose.connection at the newest client, so two overlapping
// requests ran queries through each other's socket.
//
// Outside workerd (node dev / next build) we keep the classic cached
// mongoose.connect() and the global models, including the readyState check
// that guards against dead sockets after laptop sleep ("ReplicaSetNoPrimary").

const schemas = new Map();
const pending = new WeakMap(); // ctx -> Promise<Connection>
const ready = new WeakMap(); // ctx -> Connection
let connectPromise = null;

function currentRequestCtx() {
  try {
    return getCloudflareContext().ctx ?? null;
  } catch {
    return null;
  }
}

async function connectForRequest(ctx, uri) {
  // Use mongoose's own mongodb driver module. The bundle can contain two
  // copies of "mongodb", and setClient() rejects a client made from the
  // other copy (instanceof check).
  const client = await new mongoose.mongo.MongoClient(uri).connect();
  const conn = mongoose.createConnection();
  // Compiling a model would otherwise send createIndex for every model on
  // every request. Indexes are built from node (dev, scripts) instead.
  conn.config.autoIndex = false;
  conn.config.autoCreate = false;
  conn.setClient(client);
  for (const [name, schema] of schemas) conn.model(name, schema);
  ready.set(ctx, conn);
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
    if (state !== 2) connectPromise = null; // dead socket, redial
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
  let promise = pending.get(ctx);
  if (!promise) {
    promise = connectForRequest(ctx, MONGODB_URI).catch((err) => {
      pending.delete(ctx);
      throw err;
    });
    pending.set(ctx, promise);
  }
  return promise;
}

/**
 * A model that resolves to the current request's connection on workerd and
 * to the global mongoose model elsewhere. Call sites stay `User.findOne(...)`.
 * connectDB() must have been awaited earlier in the same request.
 */
export function defineModel(name, schema) {
  schemas.set(name, schema);

  const resolve = () => {
    const ctx = currentRequestCtx();
    if (ctx === null) return mongoose.models[name] || mongoose.model(name, schema);
    const conn = ready.get(ctx);
    if (!conn) throw new Error(`${name} was used before connectDB() in this request`);
    return conn.models[name] || conn.model(name, schema);
  };

  return new Proxy(function model() {}, {
    get(_, prop) {
      const model = resolve();
      const value = Reflect.get(model, prop, model);
      return typeof value === "function" ? value.bind(model) : value;
    },
  });
}
