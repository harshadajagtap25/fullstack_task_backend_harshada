"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTaskToMQTT = void 0;
const mqtt_1 = require("../config/mqtt");
const sendTaskToMQTT = (content) => {
    try {
        (0, mqtt_1.publishToMQTT)("/add", content);
        // console.log("Task sent to MQTT:", content);
    }
    catch (error) {
        console.error("Error sending task to MQTT:", error);
        throw error;
    }
};
exports.sendTaskToMQTT = sendTaskToMQTT;
