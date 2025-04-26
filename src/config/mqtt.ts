import mqtt from "mqtt";
import { addTask } from "../services/redisService";

let mqttClient: mqtt.MqttClient;

// using a free public broker
const MQTT_BROKER_URL = "mqtt://broker.emqx.io";

export const setupMQTT = (): void => {
  try {
    // Connection to the MQTT broker
    mqttClient = mqtt.connect(MQTT_BROKER_URL);

    mqttClient.on("connect", () => {
      // console.log("Connected to MQTT broker");

      mqttClient.subscribe("/add", (err) => {
        if (err) {
          console.error("Failed to subscribe to /add topic:", err);
        } else {
          console.log("Subscribed to /add topic");
        }
      });
    });

    // Handle incoming messages
    mqttClient.on("message", async (topic, message) => {
      if (topic === "/add") {
        try {
          const taskContent = message.toString();
          // console.log("Received task via MQTT:", taskContent);

          await addTask(taskContent);
        } catch (error) {
          console.error("Error processing MQTT message:", error);
        }
      }
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT Client Error:", error);
    });
  } catch (error) {
    console.error("Failed to setup MQTT:", error);
    throw error;
  }
};

export const getMQTTClient = (): mqtt.MqttClient => {
  if (!mqttClient) {
    throw new Error("MQTT client not initialized");
  }
  return mqttClient;
};

export const closeMQTTConnection = (): void => {
  if (mqttClient) {
    mqttClient.end();
    // console.log("MQTT connection closed");
  }
};

export const publishToMQTT = (topic: string, message: string): void => {
  if (!mqttClient) {
    throw new Error("MQTT client not initialized");
  }
  mqttClient.publish(topic, message);
};
