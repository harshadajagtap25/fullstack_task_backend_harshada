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
exports.publishToMQTT = exports.closeMQTTConnection = exports.getMQTTClient = exports.setupMQTT = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const redisService_1 = require("../services/redisService");
let mqttClient;
// using a free public broker
const MQTT_BROKER_URL = "mqtt://broker.emqx.io";
const setupMQTT = () => {
    try {
        // Connection to the MQTT broker
        mqttClient = mqtt_1.default.connect(MQTT_BROKER_URL);
        mqttClient.on("connect", () => {
            // console.log("Connected to MQTT broker");
            mqttClient.subscribe("/add", (err) => {
                if (err) {
                    console.error("Failed to subscribe to /add topic:", err);
                }
                else {
                    console.log("Subscribed to /add topic");
                }
            });
        });
        // Handle incoming messages
        mqttClient.on("message", (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
            if (topic === "/add") {
                try {
                    const taskContent = message.toString();
                    // console.log("Received task via MQTT:", taskContent);
                    yield (0, redisService_1.addTask)(taskContent);
                }
                catch (error) {
                    console.error("Error processing MQTT message:", error);
                }
            }
        }));
        mqttClient.on("error", (error) => {
            console.error("MQTT Client Error:", error);
        });
    }
    catch (error) {
        console.error("Failed to setup MQTT:", error);
        throw error;
    }
};
exports.setupMQTT = setupMQTT;
const getMQTTClient = () => {
    if (!mqttClient) {
        throw new Error("MQTT client not initialized");
    }
    return mqttClient;
};
exports.getMQTTClient = getMQTTClient;
const closeMQTTConnection = () => {
    if (mqttClient) {
        mqttClient.end();
        // console.log("MQTT connection closed");
    }
};
exports.closeMQTTConnection = closeMQTTConnection;
const publishToMQTT = (topic, message) => {
    if (!mqttClient) {
        throw new Error("MQTT client not initialized");
    }
    mqttClient.publish(topic, message);
};
exports.publishToMQTT = publishToMQTT;
