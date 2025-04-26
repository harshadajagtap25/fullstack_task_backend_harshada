require("dotenv").config();
import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.DB_NAME || "";
const COLLECTION_NAME = process.env.MONGO_COLLECTION || "";

let client: MongoClient;
let db: Db;
let tasksCollection: Collection;

export const connectToMongoDB = async (): Promise<void> => {
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();

    db = client.db(DB_NAME);
    tasksCollection = db.collection(COLLECTION_NAME);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export const getTasksCollection = (): Collection => {
  if (!tasksCollection) {
    throw new Error("MongoDB collection not initialized");
  }
  return tasksCollection;
};

export const closeMongoConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};
