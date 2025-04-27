"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeMongoConnection = exports.getTasksCollection = exports.connectToMongoDB = void 0;
require("dotenv").config();
const mongodb_1 = require("mongodb");
const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.DB_NAME || "";
const COLLECTION_NAME = process.env.MONGO_COLLECTION || "";
let client;
let db;
let tasksCollection;
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client = new mongodb_1.MongoClient(MONGO_URI);
        yield client.connect();
        db = client.db(DB_NAME);
        tasksCollection = db.collection(COLLECTION_NAME);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
});
exports.connectToMongoDB = connectToMongoDB;
const getTasksCollection = () => {
    if (!tasksCollection) {
        throw new Error("MongoDB collection not initialized");
    }
    return tasksCollection;
};
exports.getTasksCollection = getTasksCollection;
const closeMongoConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (client) {
        yield client.close();
        console.log("MongoDB connection closed");
    }
});
exports.closeMongoConnection = closeMongoConnection;
