import { publishToMQTT } from "../config/mqtt";

export const sendTaskToMQTT = (content: string): void => {
  try {
    publishToMQTT("/add", content);
    // console.log("Task sent to MQTT:", content);
  } catch (error) {
    console.error("Error sending task to MQTT:", error);
    throw error;
  }
};
