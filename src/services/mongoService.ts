import { getTasksCollection } from "../config/mongodb";
import { Task } from "../models/Task";

export const moveTasksToMongoDB = async (tasks: Task[]): Promise<void> => {
  const collection = getTasksCollection();

  try {
    if (tasks.length > 0) {
      await collection.insertMany(tasks);
      // console.log(`${tasks.length} tasks moved to MongoDB successfully`);
    }
  } catch (error) {
    console.error("Error moving tasks to MongoDB:", error);
    throw error;
  }
};

export const getAllTasksFromMongoDB = async (): Promise<Task[]> => {
  const collection = getTasksCollection();

  try {
    const tasks = await collection.find({}).toArray();

    return tasks.map((task) => ({
      id: task.id,
      content: task.content,
      createdAt: new Date(task.createdAt),
      completed: task.completed,
    }));
  } catch (error) {
    console.error("Error fetching tasks from MongoDB:", error);
    throw error;
  }
};
