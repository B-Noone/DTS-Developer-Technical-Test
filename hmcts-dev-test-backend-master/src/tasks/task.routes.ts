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

taskRouter.get('/task/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const singleTask = await database.findOne(id);

        if (!singleTask) {
            res.status(StatusCodes.NOT_FOUND).json({ error: `No task found!` });
            return;
        }

        res.status(StatusCodes.OK).json({ message: `Task found!`, singleTask });
        return;

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        return;
    }
});

taskRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const taskParam: Task = req.query as any;
        const task: UnitTask | null = await database.findOne(id);

        if (!task) {
            res.status(StatusCodes.NOT_FOUND).json({ error: `No task found!` });
            return;
        }

        const updatedTask = await database.update(id, taskParam);

        if (!updatedTask) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to update task!` });
            return;
        }

        res.status(StatusCodes.OK).json({ message: `Task updated successfully!`, updatedTask });
        return;

    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        return;
    }
});

taskRouter.get('/findTasks', async (req: Request, res: Response) => {
    try {
        const taskParam: Task = req.query as any;
        const tasks = await database.findTasks(taskParam);

        if (!tasks || tasks.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ error: `No tasks found!` });
            return;
        }

        res.status(StatusCodes.OK).json({ total: tasks.length, tasks });
        return;

    }
    catch (error) {
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

taskRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: `Missing required id!` });
            return;
        }

        const task: UnitTask | null = await database.findOne(id);

        if (!task) {
            res.status(StatusCodes.NOT_FOUND).json({ error: `Task not found!` });
            return;
        }

        const deleted = await database.remove(id);

        if (!deleted) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to delete task!` });
            return;
        }

        res.status(StatusCodes.OK).json({ message: `Task deleted successfully!` });
        return;

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
        return;
    }
});