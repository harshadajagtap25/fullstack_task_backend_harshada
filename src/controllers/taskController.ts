import { Request, Response } from "express";
import { getAllTasks } from "../services/redisService";
import { sendTaskToMQTT } from "../services/mqttService";

export const addTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      res.status(400).json({ error: "Task content cannot be empty" });
      return;
    }

    sendTaskToMQTT(content);

    res.status(202).json({
      message: "Task submitted successfully",
      content,
    });
  } catch (error) {
    console.error("Error in addTaskController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllTasksController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const tasks = await getAllTasks();

    const taskResponse = tasks.map((task) => ({
      id: task.id,
      content: task.content,
      createdAt: task.createdAt,
      completed: task.completed,
    }));

    res.status(200).json(taskResponse);
  } catch (error) {
    // console.error("Error in getAllTasksController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
