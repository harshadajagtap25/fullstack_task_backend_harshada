import { v4 as uuidv4 } from "uuid";
import { getRedisClient } from "../config/redis";
import { moveTasksToMongoDB } from "./mongoService";
import { Task } from "../models/Task";
require("dotenv").config();

const REDIS_KEY = process.env.REDIS_KEY || "";
const MAX_CACHE_SIZE = process.env.MAX_CACHE_SIZE || 50;

export const addTask = async (content: string): Promise<Task> => {
  const redisClient = getRedisClient();

  const newTask: Task = {
    id: uuidv4(),
    content,
    createdAt: new Date(),
    completed: false,
  };

  try {
    const tasksStr = await redisClient.get(REDIS_KEY);
    let tasks: Task[] = [];

    if (tasksStr) {
      tasks = JSON.parse(tasksStr);
    }

    // Add new task
    tasks.push(newTask);

    // checking if we have reached limit
    if (tasks.length > Number(MAX_CACHE_SIZE)) {
      console.log(
        `Cache size exceeded ${MAX_CACHE_SIZE} items, moving to MongoDB...`
      );
      await moveTasksToMongoDB(tasks);

      await redisClient.del(REDIS_KEY);
      console.log("Cache cleared after moving tasks to MongoDB");

      return newTask;
    }

    await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
    console.log(`Task added to Redis. Current cache size: ${tasks.length}`);

    return newTask;
  } catch (error) {
    console.error("Error adding task to Redis:", error);
    throw error;
  }
};

export const getAllTasks = async (): Promise<Task[]> => {
  const redisClient = getRedisClient();

  try {
    const tasksStr = await redisClient.get(REDIS_KEY);
    let redisTasks: Task[] = [];

    if (tasksStr) {
      redisTasks = JSON.parse(tasksStr);
    }

    const mongoTasks = await fetchTasksFromMongoDB();

    return [...mongoTasks, ...redisTasks];
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    throw error;
  }
};

const fetchTasksFromMongoDB = async (): Promise<Task[]> => {
  const { getAllTasksFromMongoDB } = require("./mongoService");
  return getAllTasksFromMongoDB();
};
