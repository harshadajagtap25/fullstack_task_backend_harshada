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
exports.getAllTasksFromMongoDB = exports.moveTasksToMongoDB = void 0;
const mongodb_1 = require("../config/mongodb");
const moveTasksToMongoDB = (tasks) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = (0, mongodb_1.getTasksCollection)();
    try {
        if (tasks.length > 0) {
            yield collection.insertMany(tasks);
            // console.log(`${tasks.length} tasks moved to MongoDB successfully`);
        }
    }
    catch (error) {
        console.error("Error moving tasks to MongoDB:", error);
        throw error;
    }
});
exports.moveTasksToMongoDB = moveTasksToMongoDB;
const getAllTasksFromMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const collection = (0, mongodb_1.getTasksCollection)();
    try {
        const tasks = yield collection.find({}).toArray();
        return tasks.map((task) => ({
            id: task.id,
            content: task.content,
            createdAt: new Date(task.createdAt),
            completed: task.completed,
        }));
    }
    catch (error) {
        console.error("Error fetching tasks from MongoDB:", error);
        throw error;
    }
});
exports.getAllTasksFromMongoDB = getAllTasksFromMongoDB;
