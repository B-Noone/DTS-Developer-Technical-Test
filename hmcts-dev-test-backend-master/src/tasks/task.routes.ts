import express, { Request, Response } from "express";
import { Task, UnitTask } from "./task.interface";
import * as database from "./task.database";
import { StatusCodes } from "http-status-codes";

export const taskRouter = express.Router();

taskRouter.get('/tasks', async (req: Request, res: Response) => {
    try {
        const allTasks = await database.findAll();

        if (!allTasks || allTasks.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ error: `No tasks found!` });
            return;
        }

        res.status(StatusCodes.OK).json({ total: allTasks.length, allTasks });
        return;

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        return;
    }
});

taskRouter.post('/add', async (req: Request, res: Response) => {
    try {
        const {title, description, status, due_date}: Task = req.body as any;

        if (!title || !status || !due_date) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: `Missing required fields!` });
            return;
        }

        const task: UnitTask | null = await database.create(req.body);
        
        if (!task) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to create task!` });
            return;
        }

        res.status(StatusCodes.CREATED).json({ message: `Task created successfully!`, task });
        return;

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        return;
    }
});