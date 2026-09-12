import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const globalKey = "_fitmycvMongoClientPromise";

let clientPromise = global[globalKey];

if (!clientPromise) {
  if (!uri) {
    clientPromise = Promise.reject(new Error("Missing MONGODB_URI for auth adapter"));
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  global[globalKey] = clientPromise;
}

export default clientPromise;
