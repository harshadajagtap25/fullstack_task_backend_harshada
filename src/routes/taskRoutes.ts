import express from "express";
import {
  addTaskController,
  getAllTasksController,
} from "../controllers/taskController";

const router = express.Router();

router.post("/add", addTaskController);
router.get("/fetchAllTasks", getAllTasksController);

export default router;
