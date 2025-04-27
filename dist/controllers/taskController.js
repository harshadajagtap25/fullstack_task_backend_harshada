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
exports.getAllTasksController = exports.addTaskController = void 0;
const redisService_1 = require("../services/redisService");
const mqttService_1 = require("../services/mqttService");
const addTaskController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        if (!content || content.trim() === "") {
            res.status(400).json({ error: "Task content cannot be empty" });
            return;
        }
        (0, mqttService_1.sendTaskToMQTT)(content);
        res.status(202).json({
            message: "Task submitted successfully",
            content,
        });
    }
    catch (error) {
        console.error("Error in addTaskController:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.addTaskController = addTaskController;
const getAllTasksController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, redisService_1.getAllTasks)();
        const taskResponse = tasks.map((task) => ({
            id: task.id,
            content: task.content,
            createdAt: task.createdAt,
            completed: task.completed,
        }));
        res.status(200).json(taskResponse);
    }
    catch (error) {
        // console.error("Error in getAllTasksController:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllTasksController = getAllTasksController;
