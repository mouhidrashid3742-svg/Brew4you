import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose as MongooseCache | undefined;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

const cachedConnection = cached as MongooseCache;

async function connect() {
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(uri, {
      dbName: "9bar"
    }) as Promise<typeof mongoose>;
  }

  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}

export default connect;
