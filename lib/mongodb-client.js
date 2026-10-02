import { connectDB } from "@/utils/connect";

// The Auth.js adapter shares mongoose's MongoClient: one per request on
// Workers (see utils/connect.js), one cached client in node. The adapter calls
// this before every operation, so it always gets the current request's client.
export default function getMongoClient() {
  return connectDB().then((conn) => conn.getClient());
}
