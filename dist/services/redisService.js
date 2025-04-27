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
exports.getAllTasks = exports.addTask = void 0;
const uuid_1 = require("uuid");
const redis_1 = require("../config/redis");
const mongoService_1 = require("./mongoService");
require("dotenv").config();
const REDIS_KEY = process.env.REDIS_KEY || "";
const MAX_CACHE_SIZE = process.env.MAX_CACHE_SIZE || 50;
const addTask = (content) => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = (0, redis_1.getRedisClient)();
    const newTask = {
        id: (0, uuid_1.v4)(),
        content,
        createdAt: new Date(),
        completed: false,
    };
    try {
        const tasksStr = yield redisClient.get(REDIS_KEY);
        let tasks = [];
        if (tasksStr) {
            tasks = JSON.parse(tasksStr);
        }
        // Add new task
        tasks.push(newTask);
        // checking if we have reached limit
        if (tasks.length > Number(MAX_CACHE_SIZE)) {
            console.log(`Cache size exceeded ${MAX_CACHE_SIZE} items, moving to MongoDB...`);
            yield (0, mongoService_1.moveTasksToMongoDB)(tasks);
            yield redisClient.del(REDIS_KEY);
            console.log("Cache cleared after moving tasks to MongoDB");
            return newTask;
        }
        yield redisClient.set(REDIS_KEY, JSON.stringify(tasks));
        console.log(`Task added to Redis. Current cache size: ${tasks.length}`);
        return newTask;
    }
    catch (error) {
        console.error("Error adding task to Redis:", error);
        throw error;
    }
});
exports.addTask = addTask;
const getAllTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = (0, redis_1.getRedisClient)();
    try {
        const tasksStr = yield redisClient.get(REDIS_KEY);
        let redisTasks = [];
        if (tasksStr) {
            redisTasks = JSON.parse(tasksStr);
        }
        const mongoTasks = yield fetchTasksFromMongoDB();
        return [...mongoTasks, ...redisTasks];
    }
    catch (error) {
        console.error("Error fetching all tasks:", error);
        throw error;
    }
});
exports.getAllTasks = getAllTasks;
const fetchTasksFromMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const { getAllTasksFromMongoDB } = require("./mongoService");
    return getAllTasksFromMongoDB();
});
