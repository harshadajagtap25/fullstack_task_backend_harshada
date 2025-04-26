import express from "express";
import cors from "cors";
import { initRedisClient } from "./config/redis";
import { connectToMongoDB } from "./config/mongodb";
import { setupMQTT } from "./config/mqtt";
import taskRoutes from "./routes/taskRoutes";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api", taskRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

async function startServer() {
  try {
    // Initializing Redis
    await initRedisClient();

    // Connection with MongoDB
    await connectToMongoDB();

    // MQTT
    setupMQTT();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
