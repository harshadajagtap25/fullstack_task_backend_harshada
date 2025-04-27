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
exports.closeRedisConnection = exports.getRedisClient = exports.initRedisClient = void 0;
require("dotenv").config();
const redis_1 = require("redis");
let redisClient;
const REDIS_HOST = process.env.REDIS_HOST || "";
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_USERNAME = process.env.REDIS_USERNAME || "";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
const initRedisClient = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        redisClient = (0, redis_1.createClient)({
            url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
        });
        redisClient.on("error", (err) => {
            // console.error("Redis Client Error:", err);
        });
        yield redisClient.connect();
        // console.log("Connected to Redis");
    }
    catch (error) {
        console.error("Failed to connect to Redis:", error);
        throw error;
    }
});
exports.initRedisClient = initRedisClient;
const getRedisClient = () => {
    if (!redisClient) {
        throw new Error("Redis client not initialized");
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
const closeRedisConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (redisClient) {
        yield redisClient.quit();
        // console.log("Redis connection closed");
    }
});
exports.closeRedisConnection = closeRedisConnection;
