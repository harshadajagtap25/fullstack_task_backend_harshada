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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("./config/redis");
const mongodb_1 = require("./config/mongodb");
const mqtt_1 = require("./config/mqtt");
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", taskRoutes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initializing Redis
            yield (0, redis_1.initRedisClient)();
            // Connection with MongoDB
            yield (0, mongodb_1.connectToMongoDB)();
            // MQTT
            (0, mqtt_1.setupMQTT)();
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
        catch (error) {
            console.error("Failed to start the server:", error);
            process.exit(1);
        }
    });
}
startServer();
exports.default = app;
