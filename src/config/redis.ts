require("dotenv").config();
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

const REDIS_HOST = process.env.REDIS_HOST || "";
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_USERNAME = process.env.REDIS_USERNAME || "";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

export const initRedisClient = async (): Promise<void> => {
  try {
    redisClient = createClient({
      url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    });

    redisClient.on("error", (err) => {
      // console.error("Redis Client Error:", err);
    });

    await redisClient.connect();
    // console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    // console.log("Redis connection closed");
  }
};
